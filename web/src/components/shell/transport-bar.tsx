import { useState } from 'react';
import {
	Music2,
	SkipBack,
	SkipForward,
	Play,
	Pause,
	Headphones,
	ListMusic,
	X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { usePlayback, usePause, useResume, useSkip, useSeek, useAudioTrack, useQueueRemove } from '@/lib/hooks';

function fmtTime(secs: number): string {
	const s = Math.floor(secs);
	const m = Math.floor(s / 60);
	const h = Math.floor(m / 60);
	if (h > 0) {
		return `${h}:${String(m % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
	}
	return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

export function TransportBar() {
	const { data: status, isLoading } = usePlayback();
	const pauseMut = usePause();
	const resumeMut = useResume();
	const skipMut = useSkip();
	const seekMut = useSeek();
	const audioTrackMut = useAudioTrack();
	const queueRemoveMut = useQueueRemove();

	const [scrubbing, setScrubbing] = useState(false);
	const [scrubValue, setScrubValue] = useState(0);

	const current = status?.currentTrack ?? null;
	const playback = status?.playback;
	const queue = status?.queue ?? [];
	const isPlaying = (status?.playing ?? false) && !(status?.paused ?? false);
	const isIdle = !current;

	const position = scrubbing ? scrubValue : (playback?.position ?? 0);
	const duration = playback?.duration ?? 0;
	const seekable = playback?.seekable ?? false;
	const audioTracks = playback?.audioTracks ?? [];

	const barOpacity = isIdle && queue.length === 0 ? 'opacity-60' : 'opacity-100';

	return (
		<footer
			className={`h-20 flex items-center bg-[color:var(--color-surface)] border-t border-[color:var(--color-border)] px-6 gap-6 flex-shrink-0 transition-opacity ${barOpacity}`}
		>
			{/* ── Left: current item (320px) ─────────────────────────────────── */}
			<div className="flex items-center gap-3 w-80 min-w-0">
				{/* Thumbnail */}
				<div className="relative flex-shrink-0 w-12 h-12 rounded-md overflow-hidden ring-1 ring-inset ring-[color:var(--color-border)] bg-[color:var(--color-surface-2)] flex items-center justify-center">
					{current?.thumbnailUrl ? (
						<img
							src={current.thumbnailUrl}
							alt=""
							className="w-full h-full object-cover"
							onError={(e) => {
								(e.target as HTMLImageElement).style.display = 'none';
							}}
						/>
					) : (
						<Music2 size={16} strokeWidth={1.5} className="text-[color:var(--color-fg-dim)]" />
					)}
				</div>

				{/* Title + meta */}
				<div className="min-w-0 flex-1">
					{isLoading ? (
						<>
							<Skeleton className="h-4 w-32 mb-1" />
							<Skeleton className="h-3 w-20" />
						</>
					) : current ? (
						<>
							<p className="font-display italic text-lg leading-tight truncate">
								{current.title}
							</p>
							<p className="font-mono-tight text-[10px] tracking-[0.18em] uppercase text-[color:var(--color-fg-muted)] truncate">
								{current.type}
								{current.duration != null
									? ` · ${fmtTime(current.duration)}`
									: ''}
							</p>
						</>
					) : (
						<>
							<p className="font-display italic text-lg leading-tight text-[color:var(--color-fg-dim)]">
								—
							</p>
							<p className="font-mono-tight text-[10px] tracking-[0.18em] uppercase text-[color:var(--color-fg-muted)]">
								idle
							</p>
						</>
					)}
				</div>
			</div>

			{/* ── Center: controls + scrub ──────────────────────────────────── */}
			<div className="flex-1 flex flex-col items-center justify-center gap-1.5 max-w-[700px] mx-auto">
				{/* Buttons */}
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="icon"
						className="w-8 h-8 text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)] cursor-pointer"
						onClick={() => {
							if (seekable && duration > 0) {
								seekMut.mutate(Math.max(0, position - 10));
							}
						}}
						aria-label="Skip back 10s"
					>
						<SkipBack size={16} strokeWidth={1.5} />
					</Button>

					<Button
						size="icon"
						disabled={isIdle && queue.length === 0}
						className="w-9 h-9 rounded-full bg-[color:var(--color-accent)] text-[color:var(--color-bg)] hover:bg-[color:var(--color-accent)]/90 disabled:opacity-40 cursor-pointer"
						onClick={() => {
							if (isPlaying) pauseMut.mutate();
							else resumeMut.mutate();
						}}
						aria-label={isPlaying ? 'Pause' : 'Play'}
					>
						{isPlaying ? (
							<Pause size={18} strokeWidth={1.5} />
						) : (
							<Play size={18} strokeWidth={1.5} />
						)}
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
				</div>

				{/* Scrub / live indicator */}
				{current && !seekable ? (
					<div className="flex items-center gap-1.5">
						<span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-danger)] pulse-live" />
						<span className="font-mono-tight text-[10px] tracking-[0.16em] uppercase text-[color:var(--color-danger)]">
							LIVE
						</span>
					</div>
				) : (
					<div className="flex items-center gap-2 w-full">
						<span
							className="font-mono-tight text-[10px] text-[color:var(--color-fg-muted)] tabular-nums w-10 text-right flex-shrink-0"
							style={{ fontVariantNumeric: 'tabular-nums' }}
						>
							{fmtTime(position)}
						</span>
						<Slider
							className="flex-1"
							min={0}
							max={duration > 0 ? duration : 100}
							step={1}
							value={[position]}
							disabled={!current || !seekable || duration === 0}
							onValueChange={([v]) => {
								setScrubbing(true);
								setScrubValue(v);
							}}
							onValueCommit={([v]) => {
								setScrubbing(false);
								seekMut.mutate(v);
							}}
						/>
						<span
							className="font-mono-tight text-[10px] text-[color:var(--color-fg-muted)] tabular-nums w-10 flex-shrink-0"
							style={{ fontVariantNumeric: 'tabular-nums' }}
						>
							{fmtTime(duration)}
						</span>
					</div>
				)}
			</div>

			{/* ── Right: auxiliary (320px) ──────────────────────────────────── */}
			<div className="flex items-center justify-end gap-2 w-80 flex-shrink-0">
				{/* Audio track selector */}
				{audioTracks.length > 0 && (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="w-8 h-8 text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)] cursor-pointer"
								aria-label="Audio track"
							>
								<Headphones size={16} strokeWidth={1.5} />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="min-w-[180px]">
							{audioTracks.map((track) => (
								<DropdownMenuItem
									key={track.index}
									className={`cursor-pointer font-mono-tight text-xs ${track.selected ? 'text-[color:var(--color-accent)]' : ''}`}
									onClick={() => audioTrackMut.mutate(track.index)}
								>
									{track.title || track.language || `Track ${track.index}`}
									{track.codec ? ` · ${track.codec}` : ''}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				)}

				{/* Queue sheet */}
				<Sheet>
					<SheetTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="relative w-8 h-8 text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)] cursor-pointer"
							aria-label="Queue"
						>
							<ListMusic size={16} strokeWidth={1.5} />
							{queue.length > 0 && (
								<Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-0.5 flex items-center justify-center text-[9px] font-mono bg-[color:var(--color-accent)] text-[color:var(--color-bg)] border-0 rounded-full">
									{queue.length > 99 ? '99+' : queue.length}
								</Badge>
							)}
						</Button>
					</SheetTrigger>
					<SheetContent side="right" className="w-96 bg-[color:var(--color-surface)] border-l border-[color:var(--color-border)] p-0">
						<SheetHeader className="px-6 py-4 border-b border-[color:var(--color-border)]">
							<SheetTitle className="font-sans text-sm tracking-[0.18em] uppercase text-[color:var(--color-fg-muted)]">
								Queue · {queue.length} items
							</SheetTitle>
						</SheetHeader>
						<div className="overflow-y-auto h-full pb-20">
							{queue.length === 0 ? (
								<p className="px-6 py-8 text-center font-mono-tight text-[11px] text-[color:var(--color-fg-dim)] tracking-[0.12em] uppercase">
									Queue empty
								</p>
							) : (
								<ul className="py-2">
									{queue.map((item, idx) => (
										<li
											key={item.id}
											className="flex items-center gap-3 px-4 py-2.5 hover:bg-[color:var(--color-surface-2)] group transition-colors"
										>
											{/* Thumbnail or index */}
											<div className="w-10 h-10 rounded flex-shrink-0 overflow-hidden bg-[color:var(--color-bg)] flex items-center justify-center">
												{item.thumbnailUrl ? (
													<img
														src={item.thumbnailUrl}
														alt=""
														className="w-full h-full object-cover"
													/>
												) : (
													<span
														className="font-mono-tight text-[10px] text-[color:var(--color-fg-dim)]"
														style={{ fontVariantNumeric: 'tabular-nums' }}
													>
														{idx + 1}
													</span>
												)}
											</div>

											{/* Info */}
											<div className="flex-1 min-w-0">
												<p className="text-sm leading-snug truncate">{item.title}</p>
												<p className="font-mono-tight text-[10px] text-[color:var(--color-fg-muted)] uppercase tracking-[0.14em] truncate">
													{item.type}
													{item.duration != null ? ` · ${fmtTime(item.duration)}` : ''}
												</p>
											</div>

											{/* Remove */}
											<button
												className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 flex items-center justify-center rounded text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-danger)] hover:bg-[color:var(--color-danger)]/10 cursor-pointer"
												onClick={() => queueRemoveMut.mutate(item.id)}
												aria-label={`Remove ${item.title}`}
											>
												<X size={12} strokeWidth={1.5} />
											</button>
										</li>
									))}
								</ul>
							)}
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</footer>
	);
}
