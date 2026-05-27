import { useState } from 'react';
import { Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useRemoteUpload } from '@/lib/hooks';

interface Props { open: boolean; onOpenChange: (v: boolean) => void }

export function RemoteUploadDialog({ open, onOpenChange }: Props) {
	const [url, setUrl] = useState('');
	const upload = useRemoteUpload();

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!url.trim()) return;
		await upload.mutateAsync(url.trim());
		setUrl('');
		onOpenChange(false);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="bg-[color:var(--color-surface)] border-[color:var(--color-border)] max-w-md">
				<DialogHeader>
					<DialogTitle className="font-sans text-sm font-medium tracking-wide">Download from URL</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-3">
					<div className="relative">
						<Link2 size={14} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--color-fg-dim)]" />
						<Input
							type="url"
							placeholder="https://example.com/video.mp4"
							value={url}
							onChange={(e) => setUrl(e.target.value)}
							className="pl-9 bg-[color:var(--color-surface-2)] border-[color:var(--color-border)] text-sm"
							autoFocus
						/>
					</div>
					<p className="text-[10px] tracking-[0.12em] uppercase text-[color:var(--color-fg-dim)]">
						Direct video URL — yt-dlp supported links accepted
					</p>
					<div className="flex justify-end gap-2">
						<Button type="button" variant="ghost" size="sm" onClick={() => { setUrl(''); onOpenChange(false); }}>Cancel</Button>
						<Button
							type="submit"
							size="sm"
							disabled={!url.trim() || upload.isPending}
							className="bg-[color:var(--color-accent)] text-[color:var(--color-bg)] hover:bg-[color:var(--color-accent)]/90"
						>
							{upload.isPending ? 'Downloading…' : 'Download'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
