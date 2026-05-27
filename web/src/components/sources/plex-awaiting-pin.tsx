import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCancelPlexLogin } from '@/lib/hooks';

interface PlexAwaitingPinProps {
	code: string;
	codeExpiresAt: number;
}

function useCountdown(expiresAt: number) {
	const [remaining, setRemaining] = useState(() => Math.max(0, expiresAt - Date.now()));

	useEffect(() => {
		const interval = setInterval(() => {
			setRemaining(Math.max(0, expiresAt - Date.now()));
		}, 1000);
		return () => clearInterval(interval);
	}, [expiresAt]);

	const totalSecs = Math.floor(remaining / 1000);
	const mm = String(Math.floor(totalSecs / 60)).padStart(2, '0');
	const ss = String(totalSecs % 60).padStart(2, '0');
	return `${mm}:${ss}`;
}

export function PlexAwaitingPin({ code, codeExpiresAt }: PlexAwaitingPinProps) {
	const cancelMut = useCancelPlexLogin();
	const countdown = useCountdown(codeExpiresAt);

	return (
		<div className="flex items-center justify-center py-12">
			<div className="max-w-md w-full mx-auto text-center space-y-6">
				<p className="text-[10px] font-mono tracking-[0.18em] uppercase text-[color:var(--color-fg-muted)]">
					Enter this code at plex.tv/link
				</p>

				<div>
					<div className="font-display italic text-[120px] leading-none text-[color:var(--color-accent)] tracking-[0.1em] select-all">
						{code}
					</div>
					<p className="mt-3 text-[10px] font-mono tracking-[0.18em] uppercase text-[color:var(--color-fg-dim)]">
						Expires in {countdown}
					</p>
				</div>

				<div className="flex items-center justify-center gap-3">
					<a href="https://plex.tv/link" target="_blank" rel="noopener noreferrer">
						<Button
							className="bg-[color:var(--color-accent)] text-[color:var(--color-bg)] hover:bg-[color:var(--color-accent)]/90 cursor-pointer"
						>
							Open plex.tv/link
							<ExternalLink className="ml-2 h-4 w-4" />
						</Button>
					</a>
					<Button
						variant="ghost"
						className="text-[color:var(--color-fg-muted)] cursor-pointer"
						onClick={() => cancelMut.mutate()}
						disabled={cancelMut.isPending}
					>
						Cancel
					</Button>
				</div>
			</div>
		</div>
	);
}
