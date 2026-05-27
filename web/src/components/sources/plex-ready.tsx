import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlexLogout } from '@/lib/hooks';
import { PlexBrowse } from './plex-browse';
import { PlexSearch } from './plex-search';

interface PlexReadyProps {
	accountUser?: string;
	serverName?: string;
}

export function PlexReady({ accountUser, serverName }: PlexReadyProps) {
	const logoutMut = usePlexLogout();

	return (
		<div>
			{/* Status strip */}
			<div className="flex items-center justify-between mb-5 pb-4 border-b border-[color:var(--color-border)]">
				<div className="flex items-center gap-3">
					<CheckCircle2 className="h-4 w-4 text-[color:var(--color-live)]" />
					<span className="text-sm">
						Signed in as{' '}
						<span className="font-mono text-[color:var(--color-fg)]">{accountUser}</span>
					</span>
					<span className="text-[color:var(--color-fg-dim)]">·</span>
					<span className="font-mono text-sm text-[color:var(--color-fg-muted)]">{serverName}</span>
				</div>
				<Button
					variant="ghost"
					size="sm"
					className="text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-danger)] cursor-pointer h-7 text-xs"
					onClick={() => logoutMut.mutate()}
				>
					Sign out
				</Button>
			</div>

			{/* Split layout */}
			<div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6">
				{/* Browse panel */}
				<div>
					<p className="text-[10px] font-mono tracking-[0.18em] uppercase text-[color:var(--color-fg-muted)] mb-3">
						Browse
					</p>
					<PlexBrowse />
				</div>

				{/* Search panel */}
				<div className="lg:border-l lg:border-[color:var(--color-border)] lg:pl-6">
					<p className="text-[10px] font-mono tracking-[0.18em] uppercase text-[color:var(--color-fg-muted)] mb-3">
						Search
					</p>
					<PlexSearch onNavigate={() => {}} />
				</div>
			</div>
		</div>
	);
}
