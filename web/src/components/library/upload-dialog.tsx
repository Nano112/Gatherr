import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useUploadFile } from '@/lib/hooks';

interface Props { open: boolean; onOpenChange: (v: boolean) => void }

export function UploadDialog({ open, onOpenChange }: Props) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [dragging, setDragging] = useState(false);
	const [file, setFile] = useState<File | null>(null);
	const upload = useUploadFile();

	function handleFile(f: File) { setFile(f); }

	function handleDrop(e: React.DragEvent) {
		e.preventDefault();
		setDragging(false);
		const f = e.dataTransfer.files[0];
		if (f) handleFile(f);
	}

	async function handleSubmit() {
		if (!file) return;
		await upload.mutateAsync(file);
		setFile(null);
		onOpenChange(false);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="bg-[color:var(--color-surface)] border-[color:var(--color-border)] max-w-md">
				<DialogHeader>
					<DialogTitle className="font-sans text-sm font-medium tracking-wide">Upload File</DialogTitle>
				</DialogHeader>

				<div
					className={`mt-2 border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
						dragging
							? 'border-[color:var(--color-accent)] bg-[color:var(--color-accent)]/5'
							: 'border-[color:var(--color-border)] hover:border-[color:var(--color-border-strong)]'
					}`}
					onClick={() => inputRef.current?.click()}
					onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
					onDragLeave={() => setDragging(false)}
					onDrop={handleDrop}
				>
					<Upload size={24} strokeWidth={1.5} className="mx-auto mb-3 text-[color:var(--color-fg-muted)]" />
					{file ? (
						<p className="text-sm text-[color:var(--color-fg)] truncate max-w-[260px] mx-auto">{file.name}</p>
					) : (
						<>
							<p className="text-sm text-[color:var(--color-fg-muted)]">Drop a video file here</p>
							<p className="text-[10px] tracking-[0.14em] uppercase text-[color:var(--color-fg-dim)] mt-1">or click to browse</p>
						</>
					)}
					<input ref={inputRef} type="file" accept="video/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
				</div>

				<div className="flex justify-end gap-2 mt-2">
					<Button variant="ghost" size="sm" onClick={() => { setFile(null); onOpenChange(false); }}>Cancel</Button>
					<Button
						size="sm"
						disabled={!file || upload.isPending}
						className="bg-[color:var(--color-accent)] text-[color:var(--color-bg)] hover:bg-[color:var(--color-accent)]/90"
						onClick={handleSubmit}
					>
						{upload.isPending ? 'Uploading…' : 'Upload'}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
