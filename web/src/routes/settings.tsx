import { motion } from 'motion/react';
import { PlaceholderCard } from '@/components/settings/placeholder-card';
import { SignOutRow } from '@/components/settings/sign-out-row';

export default function Settings() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className="flex flex-col gap-8 max-w-2xl"
		>
			{/* Header */}
			<div>
				<h1 className="font-display italic text-5xl tracking-tight text-[color:var(--color-fg)]">Settings</h1>
				<p className="mt-2 text-sm text-[color:var(--color-fg-muted)]">Runtime configuration. Changes take effect immediately.</p>
			</div>

			{/* Config section */}
			<div className="flex flex-col gap-2">
				<span className="text-[10px] tracking-[0.18em] uppercase text-[color:var(--color-fg-muted)]">Configuration</span>
				<PlaceholderCard />
			</div>

			{/* Sign out */}
			<SignOutRow />
		</motion.div>
	);
}
