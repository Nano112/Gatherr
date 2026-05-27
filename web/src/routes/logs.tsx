import { motion } from 'motion/react';
import { LogViewer } from '@/components/logs/log-viewer';

export default function Logs() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className="flex flex-col gap-6"
		>
			{/* Header */}
			<div>
				<h1 className="font-display italic text-5xl tracking-tight text-[color:var(--color-fg)]">Logs</h1>
				<p className="mt-2 text-sm text-[color:var(--color-fg-muted)]">Live tail of the bot process</p>
			</div>

			<LogViewer />
		</motion.div>
	);
}
