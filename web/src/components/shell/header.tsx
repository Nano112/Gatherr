import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useBotStatus } from '@/lib/hooks';
import { CommandPalette } from './command-palette';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

const ROUTE_NAMES: Record<string, string> = {
	'/': 'Now Playing',
	'/library': 'Library',
	'/sources': 'Sources',
	'/logs': 'Logs',
	'/settings': 'Settings',
};

export function Header() {
	const location = useLocation();
	const routeName = ROUTE_NAMES[location.pathname] ?? 'Dashboard';
	const isNowPlaying = location.pathname === '/';

	const { data: status } = useBotStatus();
	const connected = status?.joined ?? false;
	const guildInfo = ''; // No guild info exposed in API status shape

	const [paletteOpen, setPaletteOpen] = useState(false);

	useEffect(() => {
		function onKey(e: KeyboardEvent) {
			if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
				e.preventDefault();
				setPaletteOpen((v) => !v);
			}
		}
		document.addEventListener('keydown', onKey);
		return () => document.removeEventListener('keydown', onKey);
	}, []);

	return (
		<TooltipProvider delayDuration={200}>
			<header className="h-12 flex items-center flex-shrink-0 bg-[color:var(--color-surface)] border-b border-[color:var(--color-border)] px-6 pr-4 gap-4">
				{/* Route label */}
				<div className="flex-1 min-w-0">
					{isNowPlaying ? (
						<span className="font-display italic text-2xl leading-none">Now playing</span>
					) : (
						<span className="font-sans text-sm tracking-[0.18em] uppercase text-[color:var(--color-fg-muted)]">
							{routeName}
						</span>
					)}
				</div>

				{/* Right chips */}
				<div className="flex items-center gap-3">
					{/* Status pill */}
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[color:var(--color-surface-2)] border border-[color:var(--color-border)] cursor-default">
								{connected ? (
									<>
										<span
											className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-live)] pulse-live flex-shrink-0"
											aria-hidden
										/>
										<span className="font-mono-tight text-[10px] tracking-[0.16em] text-[color:var(--color-fg-muted)]">
											connected
										</span>
									</>
								) : (
									<>
										<span
											className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-danger)] flex-shrink-0"
											aria-hidden
										/>
										<span className="font-mono-tight text-[10px] tracking-[0.16em] text-[color:var(--color-fg-muted)]">
											offline
										</span>
									</>
								)}
							</div>
						</TooltipTrigger>
						<TooltipContent side="bottom" sideOffset={6}>
							{connected
								? `Connected${guildInfo ? ` · ${guildInfo}` : ''}`
								: 'Bot not connected to voice'}
						</TooltipContent>
					</Tooltip>

					{/* Command palette trigger */}
					<button
						className="flex items-center gap-1 px-2 py-1 rounded bg-[color:var(--color-surface-2)] border border-[color:var(--color-border)] hover:border-[color:var(--color-border-strong)] transition-colors cursor-pointer"
						onClick={() => setPaletteOpen(true)}
						aria-label="Open command palette"
					>
						<span className="font-mono-tight text-[10px] text-[color:var(--color-fg-muted)] select-none">
							⌘ K
						</span>
					</button>
				</div>
			</header>

			<CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
		</TooltipProvider>
	);
}
