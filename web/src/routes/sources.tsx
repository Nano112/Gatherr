import { motion } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlexPanel } from '@/components/sources/plex-panel';
import { YouTubePanel } from '@/components/sources/youtube-panel';
import { UrlPanel } from '@/components/sources/url-panel';

const triggerCls =
	'text-[10px] font-mono tracking-[0.18em] uppercase px-4 py-2 ' +
	'text-[color:var(--color-fg-muted)] cursor-pointer transition-colors ' +
	'data-active:text-[color:var(--color-fg)] ' +
	'data-active:border-b-2 data-active:border-[color:var(--color-accent)] ' +
	'data-active:bg-transparent data-active:shadow-none ' +
	'rounded-none bg-transparent hover:text-[color:var(--color-fg)]';

export default function Sources() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className="p-6 max-w-5xl mx-auto"
		>
			{/* Page header */}
			<div className="flex items-center justify-between mb-6">
				<div>
					<h1 className="font-display italic text-5xl tracking-tight">Sources</h1>
					<p className="mt-2 text-sm text-[color:var(--color-fg-muted)]">
						Browse Plex, search YouTube, queue anything by URL.
					</p>
				</div>
			</div>

			{/* Tabs */}
			<Tabs defaultValue="plex">
				<TabsList
					className="bg-[color:var(--color-surface-2)] border border-[color:var(--color-border)] rounded-md p-0 h-auto mb-6 inline-flex"
				>
					<TabsTrigger value="plex" className={triggerCls}>
						Plex
					</TabsTrigger>
					<TabsTrigger value="youtube" className={triggerCls}>
						YouTube
					</TabsTrigger>
					<TabsTrigger value="url" className={triggerCls}>
						Direct URL
					</TabsTrigger>
				</TabsList>

				<TabsContent value="plex" className="mt-0">
					<PlexPanel />
				</TabsContent>

				<TabsContent value="youtube" className="mt-0">
					<div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-lg p-6">
						<YouTubePanel />
					</div>
				</TabsContent>

				<TabsContent value="url" className="mt-0">
					<div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-lg p-6">
						<UrlPanel />
					</div>
				</TabsContent>
			</Tabs>
		</motion.div>
	);
}
