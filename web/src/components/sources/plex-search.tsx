import { useState, useRef } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { usePlexSearch, usePlexQueueAdd } from '@/lib/hooks';
import { PlexRow, PlexRowSkeleton } from './plex-row';

interface PlexSearchProps {
	onNavigate: (path: string) => void;
}

export function PlexSearch({ onNavigate }: PlexSearchProps) {
	const [inputVal, setInputVal] = useState('');
	const [submittedQuery, setSubmittedQuery] = useState('');
	const inputRef = useRef<HTMLInputElement>(null);
	const queueMut = usePlexQueueAdd();

	const { data, isLoading } = usePlexSearch(submittedQuery);

	function handleSearch() {
		const q = inputVal.trim();
		if (!q) return;
		setSubmittedQuery(q);
	}

	function handleQueue(itemId: string) {
		queueMut.mutate({ itemId }, {
			onSuccess: () => toast.success('Added to queue'),
		});
	}

	const results = data?.results ?? [];

	return (
		<div className="flex flex-col h-full">
			{/* Search input */}
			<div className="flex gap-2 mb-3">
				<Input
					ref={inputRef}
					value={inputVal}
					onChange={(e) => setInputVal(e.target.value)}
					onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
					placeholder="Search Plex..."
					className="flex-1 bg-[color:var(--color-surface-2)] border-[color:var(--color-border)] text-sm h-8"
				/>
				<Button
					size="sm"
					variant="secondary"
					onClick={handleSearch}
					className="h-8 px-3 cursor-pointer"
					disabled={isLoading}
				>
					<Search size={13} strokeWidth={1.5} />
				</Button>
			</div>

			{/* Results */}
			<ScrollArea className="flex-1 h-[55vh]">
				{submittedQuery === '' ? (
					<div className="flex items-center justify-center h-32">
						<p className="text-[10px] font-mono tracking-[0.12em] uppercase text-[color:var(--color-fg-dim)]">
							Type a query above.
						</p>
					</div>
				) : isLoading ? (
					<div className="space-y-0.5">
						{Array.from({ length: 4 }).map((_, i) => <PlexRowSkeleton key={i} />)}
					</div>
				) : results.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-32 gap-1">
						<p className="text-sm text-[color:var(--color-fg-muted)]">Nothing matched.</p>
						<p className="text-[10px] font-mono text-[color:var(--color-fg-dim)] tracking-[0.1em]">
							QUERY: {submittedQuery}
						</p>
					</div>
				) : (
					<div className="space-y-0.5 pr-2">
						{results.map((result, i) => {
							const isBrowsable = result.url.startsWith('plex-browse:');
							const isMedia = result.url.startsWith('plex:');
							const itemId = isMedia
								? result.url.replace('plex:', '')
								: result.url.replace('plex-browse:', '');

							return (
								<PlexRow
									key={i}
									title={result.title}
									type={isBrowsable ? 'folder' : 'result'}
									duration={result.duration}
									thumbnailUrl={result.thumbnailUrl}
									navigable={isBrowsable}
									onQueue={isMedia ? () => handleQueue(itemId) : undefined}
									onNavigate={isBrowsable ? () => onNavigate(itemId) : undefined}
								/>
							);
						})}
					</div>
				)}
			</ScrollArea>
		</div>
	);
}
