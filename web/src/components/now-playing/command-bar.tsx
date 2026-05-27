import { useState, useRef } from 'react';
import { Search, Plus } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { usePlayback } from '@/lib/hooks';
import { api } from '@/lib/api';

export function CommandBar() {
	const { data: status } = usePlayback();
	const qc = useQueryClient();
	const [value, setValue] = useState('');
	const [searchOpen, setSearchOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [rawResults, setRawResults] = useState<string[]>([]);
	const [searching, setSearching] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const queue = status?.queue ?? [];
	const isPlaying = status?.playing ?? false;

	const playMut = useMutation({
		mutationFn: (url: string) =>
			api('/api/bot/play', { method: 'POST', body: JSON.stringify({ url }) }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['bot', 'status'] });
			toast.success('Playing');
			setValue('');
		},
		onError: (e: Error) => toast.error(`Play failed: ${e.message}`),
	});

	const queueAddMut = useMutation({
		mutationFn: (url: string) =>
			api('/api/bot/queue/add', { method: 'POST', body: JSON.stringify({ url }) }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['bot', 'status'] });
			toast.success('Queued');
			setValue('');
		},
		onError: (e: Error) => toast.error(`Queue failed: ${e.message}`),
	});

	const queueAddFromSearchMut = useMutation({
		mutationFn: (url: string) =>
			api('/api/bot/queue/add', { method: 'POST', body: JSON.stringify({ url }) }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['bot', 'status'] });
			toast.success('Added to queue');
		},
		onError: (e: Error) => toast.error(`Queue failed: ${e.message}`),
	});

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const v = value.trim();
		if (!v) return;
		if (!isPlaying && queue.length === 0) {
			playMut.mutate(v);
		} else {
			queueAddMut.mutate(v);
		}
	}

	async function handleSearch() {
		const q = searchQuery.trim();
		if (!q) return;
		setSearching(true);
		setRawResults([]);
		try {
			const data = await api<{ results: string[] }>(`/api/bot/search?q=${encodeURIComponent(q)}`);
			setRawResults(data.results ?? []);
		} catch (e: any) {
			toast.error(`Search failed: ${e.message}`);
		} finally {
			setSearching(false);
		}
	}

	const pending = playMut.isPending || queueAddMut.isPending;

	return (
		<>
			<div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-lg p-4">
				<form onSubmit={handleSubmit} className="flex items-center gap-3">
					<Input
						ref={inputRef}
						value={value}
						onChange={(e) => setValue(e.target.value)}
						placeholder="Play or queue anything — title, URL, plex:id, ytsearch query…"
						className="flex-1 h-10 font-mono text-sm bg-[color:var(--color-bg)] border-[color:var(--color-border)] focus-visible:ring-[color:var(--color-accent)] placeholder:text-[color:var(--color-fg-dim)] placeholder:text-xs"
						disabled={pending}
					/>
					<Button
						type="submit"
						size="sm"
						className="h-10 px-4 bg-[color:var(--color-accent)] text-[color:var(--color-bg)] hover:bg-[color:var(--color-accent)]/90 cursor-pointer font-mono text-xs tracking-wider disabled:opacity-40"
						disabled={!value.trim() || pending}
					>
						{pending ? '…' : (!isPlaying && queue.length === 0 ? 'PLAY' : 'QUEUE')}
					</Button>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="h-10 w-10 text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)] cursor-pointer flex-shrink-0"
						onClick={() => setSearchOpen(true)}
						aria-label="Search"
					>
						<Search size={16} strokeWidth={1.5} />
					</Button>
				</form>
				<p className="mt-2 font-mono text-[10px] tracking-[0.14em] uppercase text-[color:var(--color-fg-dim)]">
					{!isPlaying && queue.length === 0
						? 'Enter to play immediately'
						: `Enter to add to queue · ${queue.length} item${queue.length !== 1 ? 's' : ''} queued`}
				</p>
			</div>

			<Dialog open={searchOpen} onOpenChange={setSearchOpen}>
				<DialogContent className="bg-[color:var(--color-surface)] border-[color:var(--color-border)] max-w-lg">
					<DialogHeader>
						<DialogTitle className="font-sans text-sm tracking-[0.18em] uppercase text-[color:var(--color-fg-muted)]">
							Search
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div className="flex gap-2">
							<Input
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="Search YouTube…"
								className="flex-1 font-mono text-sm"
								onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
							/>
							<Button
								onClick={handleSearch}
								disabled={searching || !searchQuery.trim()}
								className="bg-[color:var(--color-accent)] text-[color:var(--color-bg)] hover:bg-[color:var(--color-accent)]/90 cursor-pointer"
							>
								{searching ? '…' : 'Search'}
							</Button>
						</div>

						{rawResults.length > 0 && (
							<ul className="space-y-1 max-h-72 overflow-y-auto">
								{rawResults.map((r, i) => (
									<li
										key={i}
										className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-md bg-[color:var(--color-bg)] border border-[color:var(--color-border)]/50 hover:border-[color:var(--color-border)] group transition-colors"
									>
										<span className="text-sm truncate flex-1 text-[color:var(--color-fg-muted)]">{r}</span>
										<Button
											variant="ghost"
											size="icon"
											className="w-7 h-7 text-[color:var(--color-fg-dim)] hover:text-[color:var(--color-accent)] flex-shrink-0 cursor-pointer"
											onClick={() => queueAddFromSearchMut.mutate(r)}
											aria-label="Add to queue"
										>
											<Plus size={14} strokeWidth={1.5} />
										</Button>
									</li>
								))}
							</ul>
						)}

						{rawResults.length === 0 && !searching && searchQuery && (
							<p className="text-center font-mono text-[11px] tracking-[0.14em] uppercase text-[color:var(--color-fg-dim)] py-4">
								No results
							</p>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
