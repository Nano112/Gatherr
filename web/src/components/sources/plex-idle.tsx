import { Button } from '@/components/ui/button';
import { useStartPlexLogin } from '@/lib/hooks';

interface PlexIdleProps {
	expired?: boolean;
}

export function PlexIdle({ expired }: PlexIdleProps) {
	const loginMut = useStartPlexLogin();

	return (
		<div className="flex items-center justify-center py-12">
			<div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-lg p-8 max-w-md w-full mx-auto text-center space-y-6">
				{/* Logo-ish wordmark */}
				<div>
					<span className="text-[10px] font-mono tracking-[0.28em] uppercase text-[color:var(--color-plex)]">
						PLEX
					</span>
				</div>

				<p className="text-sm text-[color:var(--color-fg-muted)] leading-relaxed">
					Sign in to your Plex Media Server to browse and queue movies, episodes, and live channels.
				</p>

				{expired && (
					<p className="text-[10px] font-mono tracking-[0.14em] uppercase text-[color:var(--color-danger)]">
						Last code expired. Try again.
					</p>
				)}

				<Button
					size="lg"
					className="bg-[color:var(--color-accent)] text-[color:var(--color-bg)] hover:bg-[color:var(--color-accent)]/90 cursor-pointer w-full"
					onClick={() => loginMut.mutate()}
					disabled={loginMut.isPending}
				>
					{loginMut.isPending ? 'Starting...' : 'Sign in to Plex'}
				</Button>
			</div>
		</div>
	);
}
