import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function SignOutRow() {
	const navigate = useNavigate();

	async function handleSignOut() {
		try {
			await fetch('/logout', { method: 'POST', credentials: 'same-origin' });
		} catch {}
		navigate('/login');
	}

	return (
		<div className="flex flex-col gap-4 pt-2">
			<Separator className="bg-[color:var(--color-border)]" />
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm text-[color:var(--color-fg-muted)]">Sign out</p>
					<p className="text-[10px] tracking-[0.12em] uppercase text-[color:var(--color-fg-dim)] mt-0.5">End your session on this device</p>
				</div>
				<Button
					variant="ghost"
					size="sm"
					className="text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-danger)] gap-1.5 cursor-pointer"
					onClick={handleSignOut}
				>
					<LogOut size={13} strokeWidth={1.5} />
					Sign out
				</Button>
			</div>
		</div>
	);
}
