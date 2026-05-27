import type { BotStatus } from '@/lib/types';

interface StatusPillProps {
	status: BotStatus | undefined;
}

export function StatusPill({ status }: StatusPillProps) {
	if (!status) {
		return (
			<span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm border border-[color:var(--color-border)] bg-transparent">
				<span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-fg-dim)]" />
				<span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[color:var(--color-fg-dim)]">IDLE</span>
			</span>
		);
	}

	const { playing, paused, queue } = status;

	if (playing && !paused) {
		return (
			<span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm border border-[color:var(--color-accent)]/30 bg-[color:var(--color-accent)]/8">
				<span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-accent)] pulse-live" />
				<span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[color:var(--color-accent)]">ON AIR</span>
			</span>
		);
	}

	if (paused) {
		return (
			<span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm border border-[color:oklch(0.75_0.14_55)]/30 bg-[color:oklch(0.75_0.14_55)]/8">
				<span className="w-1.5 h-1.5 rounded-full bg-[color:oklch(0.75_0.14_55)]" />
				<span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[color:oklch(0.75_0.14_55)]">PAUSED</span>
			</span>
		);
	}

	if (queue.length > 0) {
		return (
			<span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm border border-[color:var(--color-live)]/30 bg-[color:var(--color-live)]/8">
				<span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-live)] pulse-live" />
				<span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[color:var(--color-live)]">READY</span>
			</span>
		);
	}

	return (
		<span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm border border-[color:var(--color-border)] bg-transparent">
			<span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-fg-dim)]" />
			<span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[color:var(--color-fg-dim)]">IDLE</span>
		</span>
	);
}
