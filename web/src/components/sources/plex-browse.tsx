import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { usePlexBrowse, usePlexQueueAdd } from '@/lib/hooks';
import { PlexRow, PlexRowSkeleton } from './plex-row';

export function PlexBrowse() {
	const [pathStack, setPathStack] = useState<string[]>([]);
	const currentPath = pathStack[pathStack.length - 1];
	const queueMut = usePlexQueueAdd();

	const { data, isLoading } = usePlexBrowse(currentPath);

	function pushPath(path: string) {
		setPathStack((prev) => [...prev, path]);
	}

	function popPath() {
		setPathStack((prev) => prev.slice(0, -1));
	}

	function handleQueue(itemId: string) {
		queueMut.mutate({ itemId }, {
			onSuccess: () => toast.success('Added to queue'),
		});
	}

	const items = data?.items ?? [];

	return (
		<div className="flex flex-col h-full">
			{/* Header row */}
			<div className="flex items-center gap-2 mb-3">
				{pathStack.length > 0 && (
					<Button
						variant="ghost"
						size="icon"
						className="w-7 h-7 text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)] cursor-pointer flex-shrink-0"
						onClick={popPath}
						aria-label="Back"
					>
						<ChevronLeft size={15} strokeWidth={1.5} />
					</Button>
				)}
				<div className="flex items-center gap-1 text-[10px] font-mono tracking-[0.18em] uppercase text-[color:var(--color-fg-muted)] truncate">
					{pathStack.length === 0 ? (
						<span>Libraries</span>
					) : (
						pathStack.map((seg, i) => (
							<span key={i} className="flex items-center gap-1">
								{i > 0 && <span className="text-[color:var(--color-fg-dim)]">/</span>}
								<span className={i === pathStack.length - 1 ? 'text-[color:var(--color-fg)]' : ''}>
									{seg.split('/').filter(Boolean).pop() ?? seg}
								</span>
							</span>
						))
					)}
				</div>
			</div>

			{/* List */}
			<ScrollArea className="flex-1 h-[55vh]">
				{isLoading ? (
					<div className="space-y-0.5">
						{Array.from({ length: 6 }).map((_, i) => <PlexRowSkeleton key={i} />)}
					</div>
				) : items.length === 0 ? (
					<div className="flex items-center justify-center h-32">
						<p className="text-sm text-[color:var(--color-fg-dim)] font-mono">Nothing here</p>
					</div>
				) : (
					<div className="space-y-0.5 pr-2">
						{items.map((item) => (
							<PlexRow
								key={item.id}
								title={item.title}
								type={item.type}
								duration={item.duration}
								year={item.year}
								thumbnailUrl={item.thumbnailUrl}
								onQueue={item.type === 'media' ? () => handleQueue(item.id) : undefined}
								onNavigate={item.type !== 'media' ? () => pushPath(item.id) : undefined}
							/>
						))}
					</div>
				)}
			</ScrollArea>
		</div>
	);
}
