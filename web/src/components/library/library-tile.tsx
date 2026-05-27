import { useState } from 'react';
import { Film, Play, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useBotPlay } from '@/lib/hooks';
import { formatBytes, formatRelativeTime } from '@/lib/format';
import { PreviewDialog } from './preview-dialog';
import { DeleteDialog } from './delete-dialog';
import type { LibraryItem } from '@/lib/hooks';

interface Props { item: LibraryItem }

export function LibraryTile({ item }: Props) {
	const [thumbErr, setThumbErr] = useState(false);
	const [previewOpen, setPreviewOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const play = useBotPlay();

	return (
		<>
			<div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-lg overflow-hidden hover:border-[color:var(--color-border-strong)] transition-colors group">
				{/* Thumbnail */}
				<div className="aspect-video bg-[color:var(--color-surface-2)] relative overflow-hidden">
					{thumbErr ? (
						<div className="w-full h-full flex items-center justify-center">
							<Film size={28} strokeWidth={1} className="text-[color:var(--color-fg-dim)]" />
						</div>
					) : (
						<img
							src={`/api/preview/${encodeURIComponent(item.name)}/0`}
							alt={item.name}
							loading="lazy"
							className="w-full h-full object-cover"
							onError={() => setThumbErr(true)}
						/>
					)}
				</div>

				{/* Info */}
				<div className="p-3 flex flex-col gap-2">
					<p className="text-sm font-sans text-[color:var(--color-fg)] truncate" title={item.name}>{item.name}</p>
					<p className="font-mono text-[10px] tracking-[0.12em] uppercase text-[color:var(--color-fg-dim)]">
						{formatBytes(item.size)} · {formatRelativeTime(item.modified)}
					</p>

					{/* Actions */}
					<div className="flex items-center gap-1 mt-0.5">
						<Button
							variant="ghost"
							size="icon"
							className="w-7 h-7 text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-accent)] cursor-pointer"
							title="Play"
							onClick={() => play.mutate({ url: item.name })}
						>
							<Play size={13} strokeWidth={1.5} />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="w-7 h-7 text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)] cursor-pointer"
							title="Preview"
							onClick={() => setPreviewOpen(true)}
						>
							<Eye size={13} strokeWidth={1.5} />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="w-7 h-7 text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-danger)] cursor-pointer ml-auto"
							title="Delete"
							onClick={() => setDeleteOpen(true)}
						>
							<Trash2 size={13} strokeWidth={1.5} />
						</Button>
					</div>
				</div>
			</div>

			<PreviewDialog open={previewOpen} onOpenChange={setPreviewOpen} filename={item.name} />
			<DeleteDialog open={deleteOpen} onOpenChange={setDeleteOpen} filename={item.name} />
		</>
	);
}

export function LibraryTileSkeleton() {
	return (
		<div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-lg overflow-hidden">
			<Skeleton className="aspect-video w-full rounded-none" />
			<div className="p-3 flex flex-col gap-2">
				<Skeleton className="h-4 w-3/4 rounded" />
				<Skeleton className="h-3 w-1/2 rounded" />
				<div className="flex gap-1 mt-0.5">
					<Skeleton className="w-7 h-7 rounded" />
					<Skeleton className="w-7 h-7 rounded" />
					<Skeleton className="w-7 h-7 rounded ml-auto" />
				</div>
			</div>
		</div>
	);
}
