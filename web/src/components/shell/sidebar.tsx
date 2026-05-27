import { NavLink } from 'react-router-dom';
import { Radio, Film, Compass, Terminal, Settings2 } from 'lucide-react';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const NAV_ITEMS = [
	{ label: 'Now Playing', to: '/', icon: Radio },
	{ label: 'Library', to: '/library', icon: Film },
	{ label: 'Sources', to: '/sources', icon: Compass },
	{ label: 'Logs', to: '/logs', icon: Terminal },
	{ label: 'Settings', to: '/settings', icon: Settings2 },
];

export function Sidebar() {
	async function handleSignOut() {
		try {
			await fetch('/logout', { credentials: 'same-origin' });
		} catch {}
		window.location.href = '/login';
	}

	return (
		<TooltipProvider delayDuration={200}>
			<nav
				className="flex flex-col items-center w-14 h-full bg-[color:var(--color-surface)] border-r border-[color:var(--color-border)] flex-shrink-0"
				aria-label="Main navigation"
			>
				{/* Brand mark */}
				<div className="flex flex-col items-center w-full pt-3 pb-1 select-none">
					<span
						className="font-display italic text-2xl leading-none text-[color:var(--color-accent)]"
						aria-label="Gatherr"
					>
						G
					</span>
					<div className="mt-1.5 w-full h-[2px] bg-[color:var(--color-accent)]" />
				</div>

				{/* Nav items */}
				<div className="flex flex-col items-center w-full flex-1 mt-2">
					{NAV_ITEMS.map(({ label, to, icon: Icon }) => (
						<Tooltip key={to}>
							<TooltipTrigger asChild>
								<NavLink
									to={to}
									end={to === '/'}
									className={({ isActive }) =>
										[
											'relative flex items-center justify-center w-full h-14 transition-colors',
											isActive
												? 'text-[color:var(--color-accent)] bg-[color:var(--color-accent)]/5'
												: 'text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)] hover:bg-[color:var(--color-surface-2)]',
										].join(' ')
									}
									aria-label={label}
								>
									{({ isActive }) => (
										<>
											{isActive && (
												<span className="absolute left-0 top-0 h-full w-[2px] bg-[color:var(--color-accent)] rounded-r-full" />
											)}
											<Icon size={16} strokeWidth={1.5} />
										</>
									)}
								</NavLink>
							</TooltipTrigger>
							<TooltipContent side="right" sideOffset={8}>
								{label}
							</TooltipContent>
						</Tooltip>
					))}
				</div>

				{/* Avatar / user menu */}
				<div className="mb-3">
					<DropdownMenu>
						<Tooltip>
							<TooltipTrigger asChild>
								<DropdownMenuTrigger asChild>
									<button
										className="w-8 h-8 rounded-full bg-[color:var(--color-surface-2)] border border-[color:var(--color-border)] flex items-center justify-center text-xs font-mono uppercase text-[color:var(--color-fg-muted)] hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-fg)] transition-colors cursor-pointer"
										aria-label="User menu"
									>
										A
									</button>
								</DropdownMenuTrigger>
							</TooltipTrigger>
							<TooltipContent side="right" sideOffset={8}>
								Account
							</TooltipContent>
						</Tooltip>
						<DropdownMenuContent side="right" align="end" sideOffset={8}>
							<DropdownMenuItem
								className="cursor-pointer text-[color:var(--color-danger)]"
								onClick={handleSignOut}
							>
								Sign out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</nav>
		</TooltipProvider>
	);
}
