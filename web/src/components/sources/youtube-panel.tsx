import { useState, useRef } from 'react';
import { Search, Play, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useBotSearch, useBotQueueAdd } from '@/lib/hooks';

export function YouTubePanel() {
	const [inputVal, setInputVal] = useState('');
	const [submittedQuery, setSubmittedQuery] = useState('');
	const inputRef = useRef<HTMLInputElement>(null);
	const queueMut = useBotQueueAdd();

	const { data, isLoading } = useBotSearch(submittedQuery);

	function handleSearch() {
		const q = inputVal.trim();
		if (!q) return;
		setSubmittedQuery(q);
	}

	function handleQueue(url: string) {
		queueMut.mutate({ url }, {
			onSuccess: () => toast.success('Added to queue'),
		});
	}

	const results = data?.results ?? [];

	return (
		<div className="space-y-5">
			<p className="text-sm text-[color:var(--color-fg-muted)]">
				Search YouTube videos and queue them.
			</p>

			{/* Search row */}
			<div className="flex gap-2">
				<Input
					ref={inputRef}
					value={inputVal}
					onChange={(e) => setInputVal(e.target.value)}
					onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
					placeholder="Search YouTube..."
					className="flex-1 bg-[color:var(--color-surface-2)] border-[color:var(--color-border)] text-sm"
				/>
				<Button
					variant="secondary"
					onClick={handleSearch}
					className="cursor-pointer"
					disabled={isLoading}
				>
					<Search size={14} strokeWidth={1.5} className="mr-2" />
					Search
				</Button>
			</div>

			{/* Results */}
			{submittedQuery === '' ? null : isLoading ? (
				<div className="space-y-2">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className="flex items-center gap-3 py-2">
							<Skeleton className="w-8 h-8 rounded-sm flex-shrink-0" />
							<Skeleton className="h-3 flex-1" />
							<Skeleton className="w-8 h-7 flex-shrink-0" />
						</div>
					))}
				</div>
			) : results.length === 0 ? (
				<div className="flex flex-col items-center justify-center h-24 gap-1">
					<p className="text-sm text-[color:var(--color-fg-muted)]">Nothing matched. Try a broader term.</p>
					<p className="text-[10px] font-mono text-[color:var(--color-fg-dim)] tracking-[0.1em]">
						QUERY: {submittedQuery}
					</p>
				</div>
			) : (
				<ScrollArea className="h-[50vh]">
					<div className="space-y-0.5 pr-2">
						{results.map((result, i) => (
							<div
								key={i}
								className="flex items-center gap-3 py-2 px-1 rounded-md hover:bg-[color:var(--color-surface-2)] group transition-colors"
							>
								<Play
									size={13}
									strokeWidth={1.5}
									className="text-[color:var(--color-youtube)] flex-shrink-0"
								/>
								<span className="text-sm flex-1 truncate">{result}</span>
								<Button
									variant="default"
									size="icon"
									className="w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 bg-[color:var(--color-accent)] text-[color:var(--color-bg)] hover:bg-[color:var(--color-accent)]/90 cursor-pointer"
									onClick={() => handleQueue(result)}
									aria-label="Add to queue"
								>
									<Plus size={13} strokeWidth={1.5} />
								</Button>
							</div>
						))}
					</div>
				</ScrollArea>
			)}
		</div>
	);
}
