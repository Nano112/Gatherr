import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function NotFound() {
	const navigate = useNavigate();
	return (
		<div className="rise min-h-screen flex flex-col items-center justify-center gap-4 bg-[color:var(--color-bg)]">
			<span className="font-mono-tight text-[10px] tracking-[0.22em] uppercase text-[color:var(--color-fg-muted)]">
				404
			</span>
			<p className="font-display italic text-5xl text-[color:var(--color-fg)]">
				Page not found
			</p>
			<Button
				variant="ghost"
				className="mt-2 font-mono-tight text-xs tracking-[0.14em] uppercase text-[color:var(--color-fg-muted)]"
				onClick={() => navigate('/')}
			>
				Go home
			</Button>
		</div>
	);
}
