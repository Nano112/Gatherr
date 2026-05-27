import { motion } from 'motion/react';
import { usePlayback } from '@/lib/hooks';
import { StatusPill } from '@/components/now-playing/status-pill';
import { ConnectionButtons } from '@/components/now-playing/connection-buttons';
import { HeroCard } from '@/components/now-playing/hero-card';
import { QueueCard } from '@/components/now-playing/queue-card';
import { CommandBar } from '@/components/now-playing/command-bar';
import { OverlayCard } from '@/components/now-playing/overlay-card';

export default function NowPlaying() {
	const { data: status } = usePlayback();

	return (
		<motion.div
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className="space-y-4"
		>
			{/* Page header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<span className="text-[10px] tracking-[0.22em] uppercase text-[color:var(--color-fg-dim)]">
						Broadcast
					</span>
					<span className="text-[color:var(--color-fg-dim)] select-none">·</span>
					<StatusPill status={status} />
				</div>
				<ConnectionButtons status={status} />
			</div>

			{/* Main grid: hero + queue */}
			<div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-4">
				<HeroCard />
				<QueueCard />
			</div>

			{/* Command bar */}
			<CommandBar />

			{/* Overlay controls */}
			<OverlayCard />
		</motion.div>
	);
}
