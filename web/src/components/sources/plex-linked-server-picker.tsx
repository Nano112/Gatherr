import { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { useSelectPlexServer } from '@/lib/hooks';
import type { PlexAuthStatus } from '@/lib/types';

interface Props {
	servers: NonNullable<PlexAuthStatus['servers']>;
}

function ConnectionChip({ label }: { label: string }) {
	return (
		<span className="inline-flex items-center px-1.5 py-0 rounded-sm border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] text-[9px] font-mono tracking-[0.14em] uppercase text-[color:var(--color-fg-muted)]">
			{label}
		</span>
	);
}

export function PlexLinkedServerPicker({ servers }: Props) {
	const selectMut = useSelectPlexServer();
	const qc = useQueryClient();
	const [expanded, setExpanded] = useState<string | null>(null);

	function handleServerClick(server: Props['servers'][0]) {
		if (server.connections.length === 1) {
			selectMut.mutate({ id: server.id, connectionUri: server.connections[0].uri });
		} else {
			setExpanded((prev) => (prev === server.id ? null : server.id));
		}
	}

	function handleConnectionClick(serverId: string, uri: string) {
		selectMut.mutate({ id: serverId, connectionUri: uri });
	}

	return (
		<div className="max-w-2xl mx-auto">
			<div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-lg p-6">
				<div className="flex items-center gap-2 mb-5">
					<CheckCircle2 size={14} strokeWidth={1.5} className="text-[color:var(--color-accent)]" />
					<p className="text-[10px] font-mono tracking-[0.18em] uppercase text-[color:var(--color-fg-muted)]">
						Select a server
					</p>
				</div>

				{servers.length === 0 ? (
					<div className="text-center py-8 space-y-4">
						<p className="text-sm text-[color:var(--color-fg-muted)]">No servers found.</p>
						<Button
							variant="secondary"
							size="sm"
							className="cursor-pointer"
							onClick={() => qc.invalidateQueries({ queryKey: ['plex', 'auth', 'status'] })}
						>
							<RefreshCw size={13} strokeWidth={1.5} className="mr-2" />
							Retry
						</Button>
					</div>
				) : (
					<div className="space-y-2">
						{servers.map((server) => {
							const isExpanded = expanded === server.id;
							return (
								<div key={server.id}>
									<div
										className="flex items-center gap-3 p-4 rounded-md border border-[color:var(--color-border)] cursor-pointer hover:bg-[color:var(--color-surface-2)] transition-colors group"
										onClick={() => handleServerClick(server)}
									>
										<div className="flex-1 min-w-0">
											<p className="font-display italic text-xl leading-tight truncate">{server.name}</p>
											<p className="text-[10px] font-mono tracking-[0.14em] uppercase text-[color:var(--color-fg-muted)] mt-1">
												{server.owned ? 'Owned' : 'Shared'} · {server.connections.length} connection{server.connections.length !== 1 ? 's' : ''}
											</p>
										</div>
										{server.connections.length > 1 && (
											<div className="text-[color:var(--color-fg-dim)] group-hover:text-[color:var(--color-fg)] transition-colors">
												{isExpanded
													? <ChevronDown size={14} strokeWidth={1.5} />
													: <ChevronRight size={14} strokeWidth={1.5} />}
											</div>
										)}
									</div>

									{/* Connections sub-list */}
									{isExpanded && (
										<div className="mt-1 ml-4 space-y-1">
											{server.connections.map((conn) => (
												<div
													key={conn.uri}
													className="flex items-center gap-3 px-3 py-2 rounded-md border border-[color:var(--color-border)]/50 cursor-pointer hover:bg-[color:var(--color-surface-2)] transition-colors"
													onClick={() => handleConnectionClick(server.id, conn.uri)}
												>
													<p className="font-mono text-xs text-[color:var(--color-fg-muted)] truncate flex-1">{conn.uri}</p>
													<div className="flex items-center gap-1 flex-shrink-0">
														{conn.local && <ConnectionChip label="local" />}
														{conn.relay && <ConnectionChip label="relay" />}
														{conn.https && <ConnectionChip label="https" />}
													</div>
												</div>
											))}
										</div>
									)}
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
