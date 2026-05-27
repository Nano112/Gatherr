import { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLibrary } from '@/lib/hooks';
import { LibraryGrid } from '@/components/library/library-grid';
import { UploadDialog } from '@/components/library/upload-dialog';
import { RemoteUploadDialog } from '@/components/library/remote-upload-dialog';

export default function Library() {
	const [uploadOpen, setUploadOpen] = useState(false);
	const [remoteOpen, setRemoteOpen] = useState(false);
	const { data, isLoading } = useLibrary();

	return (
		<motion.div
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className="flex flex-col gap-8"
		>
			{/* Header */}
			<div className="flex items-start justify-between gap-4 flex-wrap">
				<div>
					<h1 className="font-display italic text-5xl tracking-tight text-[color:var(--color-fg)]">Library</h1>
					<p className="mt-2 text-sm text-[color:var(--color-fg-muted)]">
						Local videos in <span className="font-mono">your videos folder</span>
					</p>
				</div>
				<div className="flex items-center gap-2 mt-1">
					<Button
						size="sm"
						className="h-8 gap-1.5 bg-[color:var(--color-accent)] text-[color:var(--color-bg)] hover:bg-[color:var(--color-accent)]/90 cursor-pointer"
						onClick={() => setUploadOpen(true)}
					>
						<Upload size={13} strokeWidth={1.5} />
						Upload file
					</Button>
					<Button
						variant="secondary"
						size="sm"
						className="h-8 gap-1.5 bg-[color:var(--color-surface)] border border-[color:var(--color-border)] text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)] hover:border-[color:var(--color-border-strong)] cursor-pointer"
						onClick={() => setRemoteOpen(true)}
					>
						<Link2 size={13} strokeWidth={1.5} />
						From URL
					</Button>
				</div>
			</div>

			{/* Grid */}
			<LibraryGrid items={data?.items} isLoading={isLoading} />

			{/* Dialogs */}
			<UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} />
			<RemoteUploadDialog open={remoteOpen} onOpenChange={setRemoteOpen} />
		</motion.div>
	);
}
