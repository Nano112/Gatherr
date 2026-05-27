import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';

interface OverlayState {
	enabled: boolean;
}

export function OverlayCard() {
	const qc = useQueryClient();
	const [lines, setLines] = useState('');
	const [dirty, setDirty] = useState(false);

	const { data } = useQuery<OverlayState>({
		queryKey: ['bot', 'overlay'],
		queryFn: () => api<OverlayState>('/api/bot/overlay'),
		refetchInterval: 10000,
	});

	const overlayMut = useMutation({
		mutationFn: (payload: { enabled: boolean; lines?: string[] }) =>
			api('/api/bot/overlay', { method: 'POST', body: JSON.stringify(payload) }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['bot', 'overlay'] });
			setDirty(false);
		},
		onError: (e: Error) => toast.error(`Overlay update failed: ${e.message}`),
	});

	const enabled = data?.enabled ?? false;

	function handleToggle(val: boolean) {
		overlayMut.mutate({ enabled: val, lines: lines.split('\n').filter(Boolean) });
	}

	function handleSave() {
		overlayMut.mutate({
			enabled,
			lines: lines.split('\n').filter(Boolean),
		});
		toast.success('Overlay saved');
	}

	return (
		<div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-lg p-4">
			{/* Header row */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<span className="text-[10px] tracking-[0.22em] uppercase text-[color:var(--color-fg-dim)]">Overlay</span>
					<Switch
						checked={enabled}
						onCheckedChange={handleToggle}
						disabled={overlayMut.isPending}
						aria-label="Toggle overlay"
					/>
					{enabled && (
						<span className="inline-flex items-center gap-1 text-[10px] font-mono tracking-[0.18em] uppercase text-[color:var(--color-live)]">
							<span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-live)] pulse-live" />
							ACTIVE
						</span>
					)}
				</div>
			</div>

			{/* Expanded content when enabled */}
			{enabled && (
				<div className="mt-4 space-y-3">
					<div className="space-y-1.5">
						<Label className="text-[10px] tracking-[0.18em] uppercase text-[color:var(--color-fg-dim)]">
							Overlay Lines
						</Label>
						<Textarea
							value={lines}
							onChange={(e) => { setLines(e.target.value); setDirty(true); }}
							placeholder="One overlay line per row&#10;Line two&#10;Line three"
							className="font-mono text-sm bg-[color:var(--color-bg)] border-[color:var(--color-border)] focus-visible:ring-[color:var(--color-accent)] resize-none min-h-[80px] placeholder:text-[color:var(--color-fg-dim)] placeholder:text-xs"
							rows={3}
						/>
					</div>
					<div className="flex items-center justify-end">
						<Button
							size="sm"
							variant={dirty ? 'default' : 'ghost'}
							className={dirty
								? 'bg-[color:var(--color-accent)] text-[color:var(--color-bg)] hover:bg-[color:var(--color-accent)]/90 cursor-pointer font-mono text-xs tracking-wider'
								: 'text-[color:var(--color-fg-muted)] cursor-pointer font-mono text-xs tracking-wider'
							}
							onClick={handleSave}
							disabled={overlayMut.isPending}
						>
							{overlayMut.isPending ? 'Saving…' : 'Save'}
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
