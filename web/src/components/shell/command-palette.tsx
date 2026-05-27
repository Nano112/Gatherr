import { useNavigate } from 'react-router-dom';
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from '@/components/ui/command';
import { Radio, Film, Compass, Terminal, Settings2 } from 'lucide-react';

interface CommandPaletteProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
	const navigate = useNavigate();

	function go(path: string) {
		navigate(path);
		onOpenChange(false);
	}

	return (
		<CommandDialog open={open} onOpenChange={onOpenChange}>
			<CommandInput placeholder="Type a command or search..." />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>

				<CommandGroup heading="Navigation">
					<CommandItem onSelect={() => go('/')}>
						<Radio size={14} strokeWidth={1.5} className="mr-2 opacity-60" />
						Now Playing
					</CommandItem>
					<CommandItem onSelect={() => go('/library')}>
						<Film size={14} strokeWidth={1.5} className="mr-2 opacity-60" />
						Library
					</CommandItem>
					<CommandItem onSelect={() => go('/sources')}>
						<Compass size={14} strokeWidth={1.5} className="mr-2 opacity-60" />
						Sources
					</CommandItem>
					<CommandItem onSelect={() => go('/logs')}>
						<Terminal size={14} strokeWidth={1.5} className="mr-2 opacity-60" />
						Logs
					</CommandItem>
					<CommandItem onSelect={() => go('/settings')}>
						<Settings2 size={14} strokeWidth={1.5} className="mr-2 opacity-60" />
						Settings
					</CommandItem>
				</CommandGroup>

				<CommandSeparator />

				<CommandGroup heading="Bot">
					{/* Stubbed — implementations deferred to later tasks */}
					<CommandItem disabled>
						<span className="opacity-40">Play / Pause — coming soon</span>
					</CommandItem>
					<CommandItem disabled>
						<span className="opacity-40">Skip — coming soon</span>
					</CommandItem>
				</CommandGroup>

				<CommandSeparator />

				<CommandGroup heading="Sources">
					<CommandItem disabled>
						<span className="opacity-40">Add YouTube URL — coming soon</span>
					</CommandItem>
					<CommandItem disabled>
						<span className="opacity-40">Browse Plex — coming soon</span>
					</CommandItem>
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	);
}
