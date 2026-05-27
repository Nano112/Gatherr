import { usePlexAuthStatus } from '@/lib/hooks';
import { PlexIdle } from './plex-idle';
import { PlexAwaitingPin } from './plex-awaiting-pin';
import { PlexLinkedServerPicker } from './plex-linked-server-picker';
import { PlexReady } from './plex-ready';
import { Skeleton } from '@/components/ui/skeleton';

export function PlexPanel() {
	const status = usePlexAuthStatus();

	// Still loading (no data yet)
	if (!status) {
		return (
			<div className="space-y-4 py-8 max-w-md mx-auto">
				<Skeleton className="h-8 w-1/2 mx-auto" />
				<Skeleton className="h-4 w-3/4 mx-auto" />
				<Skeleton className="h-10 w-full" />
			</div>
		);
	}

	switch (status.state) {
		case 'idle':
			return <PlexIdle />;

		case 'pin-expired':
			return <PlexIdle expired />;

		case 'awaiting-pin':
			return (
				<PlexAwaitingPin
					code={status.code ?? '----'}
					codeExpiresAt={status.codeExpiresAt ?? Date.now() + 60_000}
				/>
			);

		case 'linked':
			return <PlexLinkedServerPicker servers={status.servers ?? []} />;

		case 'ready':
			return (
				<PlexReady
					accountUser={status.accountUser}
					serverName={status.serverName}
				/>
			);

		default:
			return <PlexIdle />;
	}
}
