import { Disc3, Headphones, Play, Pause, SkipForward, XSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePlayback, usePause, useResume, useSkip, useStop, useAudioTrack } from '@/lib/hooks';
import { formatDuration } from '@/lib/format';

function ProviderChip({ type }: { type: string }) {
	const colorMap: Record<string, string> = {
		plex: 'text-[color:var(--color-plex)] border-[color:var(--color-plex)]/30 bg-[color:var(--color-plex)]/8',
		youtube: 'text-[color:var(--color-youtube)] border-[color:var(--color-youtube)]/30 bg-[color:var(--color-youtube)]/8',
		twitch: 'text-[color:var(--color-twitch)] border-[color:var(--color-twitch)]/30 bg-[color:var(--color-twitch)]/8',
	};
	const key = type.toLowerCase();
	const cls = colorMap[key] ?? 'text-[color:var(--color-fg-muted)] border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]';
	return (
		<span className={`inline-flex items-center px-2 py-0.5 rounded-sm border text-[10px] font-mono tracking-[0.18em] uppercase ${cls}`}>
			{type.toUpperCase()}
		</span>
	);
}

export function HeroCard() {
	const { data: status, isLoading } = usePlayback();
	const pauseMut = usePause();
	const resumeMut = useResume();
	const skipMut = useSkip();
	const stopMut = useStop();
	const audioTrackMut = useAudioTrack();

	const track = status?.currentTrack ?? null;
	const playback = status?.playback;
	const isPlaying = (status?.playing ?? false) && !(status?.paused ?? false);
	const audioTracks = playback?.audioTracks ?? [];
	const selectedTrack = audioTracks.find((t) => t.selected);
	const isLive = track && !playback?.seekable;

	if (isLoading) {
		return (
			<div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-lg p-6">
				<div className="flex gap-6">
					<Skeleton className="w-[180px] h-[270px] rounded-md flex-shrink-0" />
					<div className="flex-1 space-y-3 pt-2">
						<Skeleton className="h-12 w-3/4" />
						<Skeleton className="h-4 w-1/3" />
						<Skeleton className="h-4 w-1/2" />
						<Skeleton className="h-4 w-2/5" />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-lg p-6">
			<div className="flex gap-6">
				{/* ── Poster ── */}
				<div className="flex-shrink-0 w-[180px]">
					<div className="w-[180px] h-[270px] rounded-md ring-1 ring-inset ring-[color:var(--color-border)] overflow-hidden bg-[color:var(--color-surface-2)] flex items-center justify-center">
						{track?.thumbnailUrl ? (
							<img
								src={track.thumbnailUrl}
								alt={track.title}
								className="w-full h-full object-cover"
							/>
						) : (
							<Disc3
								size={72}
								strokeWidth={1}
								className={`text-[color:var(--color-fg-dim)] ${track ? 'animate-[spin_8s_linear_infinite]' : ''}`}
							/>
						)}
					</div>
					<div className="mt-2 flex items-center gap-1 text-[10px] font-mono tracking-[0.18em] uppercase text-[color:var(--color-fg-dim)]">
						{track ? (
							<>
								<span>{track.type}</span>
								<span>·</span>
								{isLive ? (
									<span className="flex items-center gap-1 text-[color:var(--color-danger)]">
										<span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-danger)] pulse-live" />
										LIVE
									</span>
								) : (
									<span>{formatDuration(track.duration)}</span>
								)}
							</>
						) : (
							<span>STANDBY</span>
						)}
					</div>
				</div>

				{/* ── Meta ── */}
				<div className="flex-1 min-w-0 flex flex-col">
					{/* Title */}
					<h2 className="font-display italic text-4xl leading-[1.05] text-[color:var(--color-fg)] tracking-tight line-clamp-2">
						{track ? track.title : (
							<span className="text-[color:var(--color-fg-dim)]">Standby</span>
						)}
					</h2>

					{/* Chips row */}
					{track && (
						<div className="flex items-center gap-2 mt-3 flex-wrap">
							<ProviderChip type={track.type} />
							{track.seekable && (
								<span className="inline-flex items-center px-2 py-0.5 rounded-sm border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] text-[10px] font-mono tracking-[0.18em] uppercase text-[color:var(--color-fg-muted)]">
									SEEKABLE
								</span>
							)}
							{selectedTrack && (
								<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] text-[10px] font-mono tracking-[0.18em] uppercase text-[color:var(--color-fg-muted)]">
									<Headphones size={10} strokeWidth={1.5} />
									{selectedTrack.language || selectedTrack.codec || `Track ${selectedTrack.index}`}
								</span>
							)}
						</div>
					)}

					{/* Detail table */}
					{track && (
						<dl className="mt-4 grid grid-cols-[110px_1fr] gap-y-2 text-sm">
							<dt className="text-[10px] tracking-[0.18em] uppercase text-[color:var(--color-fg-dim)] self-center">Requested by</dt>
							<dd className="font-mono text-xs text-[color:var(--color-fg-muted)] truncate">{track.requestedBy}</dd>

							{track.duration && (
								<>
									<dt className="text-[10px] tracking-[0.18em] uppercase text-[color:var(--color-fg-dim)] self-center">Duration</dt>
									<dd className="font-mono text-xs text-[color:var(--color-fg-muted)] tabular-nums">{formatDuration(track.duration)}</dd>
								</>
							)}

							{audioTracks.length > 0 && (
								<>
									<dt className="text-[10px] tracking-[0.18em] uppercase text-[color:var(--color-fg-dim)] self-center">Audio tracks</dt>
									<dd className="font-mono text-xs text-[color:var(--color-fg-muted)]">
										{audioTracks.map((t) => t.title || t.language || `Track ${t.index}`).join(' · ')}
									</dd>
								</>
							)}

							{status?.currentTrack?.id && (
								<>
									<dt className="text-[10px] tracking-[0.18em] uppercase text-[color:var(--color-fg-dim)] self-center">ID</dt>
									<dd className="font-mono text-xs text-[color:var(--color-fg-dim)] truncate">{status.currentTrack.id}</dd>
								</>
							)}
						</dl>
					)}

					{/* Spacer */}
					<div className="flex-1" />

					{/* Mini transport */}
					<div className="flex items-center gap-2 mt-4 pt-4 border-t border-[color:var(--color-border)]/50">
						<Button
							size="icon"
							disabled={!track && (status?.queue.length ?? 0) === 0}
							className="w-9 h-9 rounded-full bg-[color:var(--color-accent)] text-[color:var(--color-bg)] hover:bg-[color:var(--color-accent)]/90 disabled:opacity-30 cursor-pointer"
							onClick={() => { isPlaying ? pauseMut.mutate() : resumeMut.mutate(); }}
							aria-label={isPlaying ? 'Pause' : 'Play'}
						>
							{isPlaying ? <Pause size={16} strokeWidth={1.5} /> : <Play size={16} strokeWidth={1.5} />}
						</Button>

						<Button
							variant="ghost"
							size="icon"
							className="w-8 h-8 text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)] cursor-pointer"
							onClick={() => skipMut.mutate()}
							aria-label="Skip"
						>
							<SkipForward size={16} strokeWidth={1.5} />
						</Button>

						{/* Audio track picker */}
						{audioTracks.length > 1 && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className="w-8 h-8 text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)] cursor-pointer"
										aria-label="Audio track"
									>
										<Headphones size={15} strokeWidth={1.5} />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start" className="min-w-[180px]">
									{audioTracks.map((t) => (
										<DropdownMenuItem
											key={t.index}
											className={`cursor-pointer font-mono text-xs ${t.selected ? 'text-[color:var(--color-accent)]' : ''}`}
											onClick={() => audioTrackMut.mutate(t.index)}
										>
											{t.title || t.language || `Track ${t.index}`}
											{t.codec ? ` · ${t.codec}` : ''}
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						)}

						<div className="flex-1" />

						<Button
							variant="ghost"
							size="icon"
							className="w-8 h-8 text-[color:var(--color-fg-dim)] hover:text-[color:var(--color-danger)] cursor-pointer"
							onClick={() => stopMut.mutate()}
							aria-label="Stop"
						>
							<XSquare size={15} strokeWidth={1.5} />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
