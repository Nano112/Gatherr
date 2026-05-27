import { Info } from 'lucide-react';
import { useBotStatus } from '@/lib/hooks';

export function PlaceholderCard() {
	const { data: status } = useBotStatus();

	return (
		<div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-lg p-5 flex flex-col gap-4">
			{/* Banner */}
			<div className="flex items-start gap-3 p-3 bg-[color:var(--color-accent)]/8 border border-[color:var(--color-accent)]/20 rounded-md">
				<Info size={15} strokeWidth={1.5} className="text-[color:var(--color-accent)] mt-0.5 shrink-0" />
				<p className="text-xs text-[color:var(--color-fg-muted)] leading-relaxed">
					Runtime config endpoint not yet wired — coming soon. Showing read-only values from bot status.
				</p>
			</div>

			{/* Read-only status values */}
			<div className="flex flex-col gap-1">
				<span className="text-[10px] tracking-[0.18em] uppercase text-[color:var(--color-fg-muted)] mb-2">Stream</span>

				<ReadOnlyRow label="Status" value={status?.playing ? 'playing' : status?.paused ? 'paused' : 'idle'} />
				<ReadOnlyRow label="Connected" value={status?.joined ? 'yes' : 'no'} />
				{status?.currentTrack && (
					<>
						<ReadOnlyRow label="Current track" value={status.currentTrack.title ?? '—'} />
						<ReadOnlyRow label="Track type" value={status.currentTrack.type ?? '—'} />
					</>
				)}
				<ReadOnlyRow label="Queue length" value={String(status?.queueLength ?? 0)} />
			</div>

			<div className="flex flex-col gap-1 pt-2 border-t border-[color:var(--color-border)]">
				<span className="text-[10px] tracking-[0.18em] uppercase text-[color:var(--color-fg-muted)] mb-2">Planned settings</span>
				<PlannedRow label="Stream resolution" hint="e.g. 1920×1080" />
				<PlannedRow label="Framerate" hint="e.g. 30 fps" />
				<PlannedRow label="Bitrate (kbps)" hint="e.g. 2500" />
				<PlannedRow label="Video codec" hint="H264 / VP8 / VP9" />
				<PlannedRow label="Hardware accel" hint="toggle" />
				<PlannedRow label="Audio bitrate" hint="e.g. 128 kbps" />
				<PlannedRow label="Queue on stop" hint="toggle" />
			</div>
		</div>
	);
}

function ReadOnlyRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex items-center justify-between py-1.5 border-b border-[color:var(--color-border)]/50 last:border-0">
			<span className="text-xs text-[color:var(--color-fg-muted)]">{label}</span>
			<span className="font-mono text-xs text-[color:var(--color-fg)]">{value}</span>
		</div>
	);
}

function PlannedRow({ label, hint }: { label: string; hint: string }) {
	return (
		<div className="flex items-center justify-between py-1.5 border-b border-[color:var(--color-border)]/50 last:border-0 opacity-40">
			<span className="text-xs text-[color:var(--color-fg-muted)]">{label}</span>
			<span className="font-mono text-[10px] text-[color:var(--color-fg-dim)] italic">{hint}</span>
		</div>
	);
}
