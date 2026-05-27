import { useState } from 'react';
import { Link2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useBotQueueAdd, useBotPlay } from '@/lib/hooks';

export function UrlPanel() {
	const [value, setValue] = useState('');
	const queueMut = useBotQueueAdd();
	const playMut = useBotPlay();

	function getLines(): string[] {
		return value.split('\n').map((l) => l.trim()).filter(Boolean);
	}

	async function handleQueueAll() {
		const lines = getLines();
		if (!lines.length) return;

		let queued = 0;
		for (const url of lines) {
			try {
				await new Promise<void>((resolve, reject) => {
					queueMut.mutate({ url }, {
						onSuccess: () => { queued++; resolve(); },
						onError: (e) => reject(e),
					});
				});
				if (lines.length > 1) {
					toast.info(`Queued ${queued} of ${lines.length}…`);
				}
			} catch {
				// individual error already toasted by mutation
			}
		}
		toast.success(`Queued ${queued} item${queued !== 1 ? 's' : ''}`);
		setValue('');
	}

	async function handlePlayFirst() {
		const lines = getLines();
		if (!lines.length) return;

		const [first, ...rest] = lines;

		try {
			await new Promise<void>((resolve, reject) => {
				playMut.mutate({ url: first }, {
					onSuccess: () => resolve(),
					onError: (e) => reject(e),
				});
			});
		} catch {
			return;
		}

		for (const url of rest) {
			queueMut.mutate({ url });
		}

		toast.success('Playing now' + (rest.length ? `, queued ${rest.length} more` : ''));
		setValue('');
	}

	const isPending = queueMut.isPending || playMut.isPending;

	return (
		<div className="max-w-xl mx-auto space-y-5">
			<div className="flex items-center gap-2">
				<Link2 size={14} strokeWidth={1.5} className="text-[color:var(--color-fg-dim)]" />
				<p className="text-[10px] font-mono tracking-[0.18em] uppercase text-[color:var(--color-fg-muted)]">
					Queue from URL
				</p>
			</div>

			<Textarea
				value={value}
				onChange={(e) => setValue(e.target.value)}
				placeholder={`https://www.youtube.com/watch?v=...\nhttps://www.twitch.tv/streamer\nplex:12345\n/local/path/to/file.mp4`}
				className="min-h-[140px] font-mono text-sm bg-[color:var(--color-surface-2)] border-[color:var(--color-border)] resize-y placeholder:text-[color:var(--color-fg-dim)] placeholder:text-xs"
			/>

			<div className="flex items-center gap-3">
				<Button
					className="bg-[color:var(--color-accent)] text-[color:var(--color-bg)] hover:bg-[color:var(--color-accent)]/90 cursor-pointer"
					onClick={handleQueueAll}
					disabled={isPending || !value.trim()}
				>
					Queue all
				</Button>
				<Button
					variant="secondary"
					className="cursor-pointer"
					onClick={handlePlayFirst}
					disabled={isPending || !value.trim()}
				>
					<Play size={13} strokeWidth={1.5} className="mr-2" />
					Play first now
				</Button>
			</div>
		</div>
	);
}
