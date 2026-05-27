import { Plus, Eye, Film, Folder, Library } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDuration } from '@/lib/format';
import type { BrowseItem } from '@/lib/hooks';

interface PlexRowProps {
	title: string;
	type: BrowseItem['type'] | 'result';
	duration?: number;
	year?: number;
	thumbnailUrl?: string;
	navigable?: boolean;
	onQueue?: () => void;
	onNavigate?: () => void;
	isLoading?: boolean;
}

export function PlexRowSkeleton() {
	return (
		<div className="flex items-center gap-3 py-2 px-1">
			<Skeleton className="w-8 h-12 rounded-sm flex-shrink-0" />
			<div className="flex-1 space-y-1.5">
				<Skeleton className="h-3 w-2/3" />
				<Skeleton className="h-2.5 w-1/3" />
			</div>
		</div>
	);
}

export function PlexRow({
	title,
	type,
	duration,
	year,
	thumbnailUrl,
	navigable,
	onQueue,
	onNavigate,
}: PlexRowProps) {
	const isMedia = type === 'media' || type === 'result';
	const isNav = navigable || type === 'folder' || type === 'library';

	const TypeIcon = type === 'library' ? Library : type === 'folder' ? Folder : Film;

	const chipColors: Record<string, string> = {
		library: 'text-[color:var(--color-plex)] border-[color:var(--color-plex)]/30 bg-[color:var(--color-plex)]/8',
		folder: 'text-[color:var(--color-fg-muted)] border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]',
		media: 'text-[color:var(--color-fg-muted)] border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]',
		result: 'text-[color:var(--color-fg-muted)] border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]',
	};

	return (
		<div
			className={`flex items-center gap-3 py-2 px-1 rounded-md group transition-colors ${isNav ? 'cursor-pointer hover:bg-[color:var(--color-surface-2)]' : 'hover:bg-[color:var(--color-surface-2)]/50'}`}
			onClick={isNav ? onNavigate : undefined}
		>
			{/* Thumbnail */}
			<div className="w-8 h-12 rounded-sm ring-1 ring-inset ring-[color:var(--color-border)] overflow-hidden bg-[color:var(--color-surface-2)] flex items-center justify-center flex-shrink-0">
				{thumbnailUrl ? (
					<img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
				) : (
					<TypeIcon size={14} strokeWidth={1.5} className="text-[color:var(--color-fg-dim)]" />
				)}
			</div>

			{/* Text */}
			<div className="flex-1 min-w-0">
				<p className="text-sm truncate leading-tight">{title}</p>
				<div className="flex items-center gap-2 mt-0.5">
					<span className={`inline-flex items-center px-1.5 py-0 rounded-sm border text-[9px] font-mono tracking-[0.18em] uppercase ${chipColors[type] ?? chipColors.result}`}>
						{type === 'result' ? 'media' : type}
					</span>
					{year && (
						<span className="text-[10px] font-mono text-[color:var(--color-fg-dim)]">{year}</span>
					)}
					{duration != null && (
						<span className="text-[10px] font-mono text-[color:var(--color-fg-dim)]">{formatDuration(duration)}</span>
					)}
				</div>
			</div>

			{/* Action button */}
			{isMedia && onQueue && (
				<Button
					variant="default"
					size="icon"
					className="w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 bg-[color:var(--color-accent)] text-[color:var(--color-bg)] hover:bg-[color:var(--color-accent)]/90 cursor-pointer"
					onClick={(e) => { e.stopPropagation(); onQueue(); }}
					aria-label="Add to queue"
				>
					<Plus size={13} strokeWidth={1.5} />
				</Button>
			)}
			{isNav && (
				<Eye
					size={13}
					strokeWidth={1.5}
					className="text-[color:var(--color-fg-dim)] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
				/>
			)}
		</div>
	);
}
