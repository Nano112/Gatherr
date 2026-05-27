import { ArrowDown, GripVertical, X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { usePlayback } from '@/lib/hooks';
import { api } from '@/lib/api';
import { formatDuration, formatTotalDuration } from '@/lib/format';

export function QueueCard() {
	const { data: status, isLoading } = usePlayback();
	const qc = useQueryClient();
	const queue = status?.queue ?? [];

	const removeMut = useMutation({
		mutationFn: (id: string) =>
			api(`/api/bot/queue/${encodeURIComponent(id)}`, { method: 'DELETE' }),
		onSuccess: () => qc.invalidateQueries({ queryKey: ['bot', 'status'] }),
		onError: (e: Error) => toast.error(`Remove failed: ${e.message}`),
	});

	const clearMut = useMutation({
		mutationFn: () => api('/api/bot/queue/clear', { method: 'POST' }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['bot', 'status'] });
			toast.success('Queue cleared');
		},
		onError: (e: Error) => toast.error(`Clear failed: ${e.message}`),
	});

	return (
		<div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-lg p-6 flex flex-col">
			{/* Header */}
			<div className="flex items-start justify-between mb-4">
				<div>
					<h3 className="font-display italic text-3xl leading-tight text-[color:var(--color-fg)]">Up next</h3>
					<p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[color:var(--color-fg-dim)] mt-0.5">
						{isLoading ? '— items' : `${queue.length} ITEMS · ${formatTotalDuration(queue)}`}
					</p>
				</div>
				{queue.length > 0 && (
					<Button
						variant="ghost"
						size="sm"
						className="text-[color:var(--color-fg-dim)] hover:text-[color:var(--color-danger)] text-xs cursor-pointer"
						onClick={() => clearMut.mutate()}
						disabled={clearMut.isPending}
					>
						Clear
					</Button>
				)}
			</div>

			{/* List */}
			<div className="flex-1 overflow-y-auto">
				{isLoading ? (
					<ul className="space-y-px">
						{[...Array(4)].map((_, i) => (
							<li key={i} className="flex items-center gap-3 py-3">
								<Skeleton className="w-6 h-3 rounded" />
								<div className="flex-1 space-y-1.5">
									<Skeleton className="h-3 w-4/5 rounded" />
									<Skeleton className="h-2 w-1/2 rounded" />
								</div>
							</li>
						))}
					</ul>
				) : queue.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
						<ArrowDown size={20} strokeWidth={1} className="text-[color:var(--color-fg-dim)]" />
						<p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[color:var(--color-fg-dim)]">
							Queue empty.<br />Add something below.
						</p>
					</div>
				) : (
					<ul>
						{queue.map((item, idx) => (
							<li
								key={item.id}
								className="flex items-center gap-3 py-3 border-b border-[color:var(--color-border)]/50 last:border-b-0 group"
							>
								{/* Index */}
								<span
									className="font-mono text-[10px] text-[color:var(--color-fg-dim)] w-6 flex-shrink-0 tabular-nums text-right"
									style={{ fontVariantNumeric: 'tabular-nums' }}
								>
									{String(idx + 1).padStart(2, '0')}
								</span>

								{/* Thumbnail or type icon */}
								<div className="w-8 h-8 rounded flex-shrink-0 overflow-hidden bg-[color:var(--color-bg)] flex items-center justify-center ring-1 ring-inset ring-[color:var(--color-border)]/40">
									{item.thumbnailUrl ? (
										<img src={item.thumbnailUrl} alt="" className="w-full h-full object-cover" />
									) : (
										<span className="font-mono text-[8px] text-[color:var(--color-fg-dim)] uppercase">{item.type.slice(0, 2)}</span>
									)}
								</div>

								{/* Info */}
								<div className="flex-1 min-w-0">
									<p className="text-sm leading-snug truncate text-[color:var(--color-fg)]">{item.title}</p>
									<p className="font-mono text-[10px] tracking-[0.12em] uppercase text-[color:var(--color-fg-dim)] mt-0.5">
										{item.type}
										{item.duration ? ` · ${formatDuration(item.duration)}` : ''}
									</p>
								</div>

								{/* Actions */}
								<div className="flex items-center gap-1 flex-shrink-0">
									<GripVertical
										size={14}
										strokeWidth={1.5}
										className="text-[color:var(--color-fg-dim)] cursor-grab opacity-40 group-hover:opacity-70 transition-opacity"
									/>
									<Button
										variant="ghost"
										size="icon"
										className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-danger)] hover:bg-[color:var(--color-danger)]/10 cursor-pointer"
										onClick={() => removeMut.mutate(item.id)}
										aria-label={`Remove ${item.title}`}
									>
										<X size={12} strokeWidth={1.5} />
									</Button>
								</div>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}
