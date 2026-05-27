import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDeleteFile } from '@/lib/hooks';

interface Props { open: boolean; onOpenChange: (v: boolean) => void; filename: string }

export function DeleteDialog({ open, onOpenChange, filename }: Props) {
	const del = useDeleteFile();

	async function handleDelete() {
		await del.mutateAsync(filename);
		onOpenChange(false);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="bg-[color:var(--color-surface)] border-[color:var(--color-border)] max-w-sm">
				<DialogHeader>
					<DialogTitle className="font-sans text-sm font-medium">Delete file</DialogTitle>
				</DialogHeader>
				<p className="text-sm text-[color:var(--color-fg-muted)] mt-1">
					Delete <span className="font-mono text-[color:var(--color-fg)] break-all">{filename}</span>?
					<br />
					<span className="text-[10px] tracking-[0.14em] uppercase text-[color:var(--color-fg-dim)]">This cannot be undone.</span>
				</p>
				<div className="flex justify-end gap-2 mt-3">
					<Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
					<Button
						size="sm"
						disabled={del.isPending}
						className="bg-[color:var(--color-danger)] text-white hover:bg-[color:var(--color-danger)]/90"
						onClick={handleDelete}
					>
						{del.isPending ? 'Deleting…' : 'Delete'}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
