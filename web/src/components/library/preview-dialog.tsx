import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Props { open: boolean; onOpenChange: (v: boolean) => void; filename: string }

function ThumbCell({ filename, id }: { filename: string; id: number }) {
	return (
		<div className="aspect-video bg-[color:var(--color-surface-2)] rounded overflow-hidden">
			<img
				src={`/api/preview/${encodeURIComponent(filename)}/${id}`}
				alt={`Preview ${id + 1}`}
				className="w-full h-full object-cover"
				loading="lazy"
				onError={(e) => {
					const el = e.currentTarget;
					el.style.display = 'none';
					const parent = el.parentElement;
					if (parent) {
						const sk = document.createElement('div');
						sk.className = 'w-full h-full bg-[color:var(--color-surface-2)]';
						parent.appendChild(sk);
					}
				}}
			/>
		</div>
	);
}

export function PreviewDialog({ open, onOpenChange, filename }: Props) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="bg-[color:var(--color-surface)] border-[color:var(--color-border)] max-w-lg">
				<DialogHeader>
					<DialogTitle className="font-mono text-xs text-[color:var(--color-fg-muted)] truncate">{filename}</DialogTitle>
				</DialogHeader>
				{filename && (
					<div className="grid grid-cols-2 gap-2 mt-1">
						{[0, 1, 2, 3].map((id) => (
							<ThumbCell key={id} filename={filename} id={id} />
						))}
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
