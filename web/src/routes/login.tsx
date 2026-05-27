import { useState, type FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export default function Login() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const body = new URLSearchParams();
			body.set('username', username);
			body.set('password', password);

			const res = await fetch('/login', {
				method: 'POST',
				credentials: 'same-origin',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: body.toString(),
				redirect: 'manual',
			});

			// Express redirects on success (3xx) and redirects with ?error=1 on failure
			if (res.type === 'opaqueredirect' || res.status === 0) {
				// Opaque redirect — assume success and navigate home
				window.location.href = '/';
				return;
			}
			if (res.redirected) {
				if (res.url.includes('error=1')) {
					setError('Invalid username or password.');
				} else {
					window.location.href = '/';
				}
				return;
			}
			if (res.status >= 200 && res.status < 300) {
				window.location.href = '/';
				return;
			}

			// Attempt JSON error message
			let msg = 'Login failed.';
			const ct = res.headers.get('content-type') || '';
			if (ct.includes('application/json')) {
				try {
					const data = await res.json();
					msg = data.error || msg;
				} catch {}
			}
			setError(msg);
		} catch (err: unknown) {
			const e = err as Error;
			setError(e.message || 'Network error.');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="relative grain min-h-screen flex items-center justify-center bg-[color:var(--color-bg)]">
			<div className="rise flex flex-col items-center gap-6 w-full max-w-sm px-4">
				{/* Brand */}
				<div className="flex flex-col items-center gap-1 select-none">
					<h1 className="font-display italic text-5xl text-[color:var(--color-fg)]">
						Gathe
						<span className="text-[color:var(--color-accent)]">rr</span>
					</h1>
					<p className="font-mono-tight text-[10px] tracking-[0.22em] uppercase text-[color:var(--color-fg-muted)]">
						BROADCAST CONTROL · SIGN IN
					</p>
				</div>

				{/* Card */}
				<form
					onSubmit={handleSubmit}
					className="w-full bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-xl p-8 flex flex-col gap-5"
				>
					<div className="flex flex-col gap-1.5">
						<Label
							htmlFor="username"
							className="font-mono-tight text-[10px] tracking-[0.18em] uppercase text-[color:var(--color-fg-muted)]"
						>
							Username
						</Label>
						<Input
							id="username"
							type="text"
							autoComplete="username"
							autoFocus
							required
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="bg-[color:var(--color-surface-2)] border-[color:var(--color-border)] focus:border-[color:var(--color-border-strong)]"
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label
							htmlFor="password"
							className="font-mono-tight text-[10px] tracking-[0.18em] uppercase text-[color:var(--color-fg-muted)]"
						>
							Password
						</Label>
						<Input
							id="password"
							type="password"
							autoComplete="current-password"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="bg-[color:var(--color-surface-2)] border-[color:var(--color-border)] focus:border-[color:var(--color-border-strong)]"
						/>
					</div>

					<Button
						type="submit"
						disabled={loading}
						className="w-full bg-[color:var(--color-accent)] text-[color:var(--color-bg)] hover:bg-[color:var(--color-accent)]/90 font-sans font-medium mt-1 cursor-pointer"
					>
						{loading ? (
							<>
								<Loader2 size={14} strokeWidth={1.5} className="mr-2 animate-spin" />
								Signing in…
							</>
						) : (
							'Sign in'
						)}
					</Button>
				</form>

				{error && (
					<p className="text-[color:var(--color-danger)] font-mono-tight text-xs text-center">
						{error}
					</p>
				)}
			</div>
		</div>
	);
}
