import { useMemo, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LibraryTile, LibraryTileSkeleton } from './library-tile';
import type { LibraryItem } from '@/lib/hooks';

type SortKey = 'newest' | 'oldest' | 'name' | 'size';

interface Props {
	items: LibraryItem[] | undefined;
	isLoading: boolean;
}

export function LibraryGrid({ items, isLoading }: Props) {
	const [filter, setFilter] = useState('');
	const [sort, setSort] = useState<SortKey>('newest');

	const filtered = useMemo(() => {
		if (!items) return [];
		let list = filter.trim()
			? items.filter((i) => i.name.toLowerCase().includes(filter.toLowerCase()))
			: [...items];
		switch (sort) {
			case 'newest': list.sort((a, b) => b.modified - a.modified); break;
			case 'oldest': list.sort((a, b) => a.modified - b.modified); break;
			case 'name':   list.sort((a, b) => a.name.localeCompare(b.name)); break;
			case 'size':   list.sort((a, b) => b.size - a.size); break;
		}
		return list;
	}, [items, filter, sort]);

	return (
		<div className="flex flex-col gap-4">
			{/* Filter / sort bar */}
			<div className="flex items-center gap-3">
				<Input
					placeholder="Filter by filename…"
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
					className="h-8 text-sm bg-[color:var(--color-surface)] border-[color:var(--color-border)] flex-1 max-w-xs"
				/>
				<Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
					<SelectTrigger className="h-8 w-36 text-xs bg-[color:var(--color-surface)] border-[color:var(--color-border)]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent className="bg-[color:var(--color-surface)] border-[color:var(--color-border)]">
						<SelectItem value="newest" className="text-xs">Newest first</SelectItem>
						<SelectItem value="oldest" className="text-xs">Oldest first</SelectItem>
						<SelectItem value="name"   className="text-xs">Name A–Z</SelectItem>
						<SelectItem value="size"   className="text-xs">Largest first</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Grid */}
			{isLoading ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{Array.from({ length: 8 }).map((_, i) => <LibraryTileSkeleton key={i} />)}
				</div>
			) : filtered.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-24 gap-3">
					<ArrowUp size={28} strokeWidth={1} className="text-[color:var(--color-fg-dim)]" />
					<p className="text-sm text-[color:var(--color-fg-muted)]">
						{filter ? 'No files match your filter.' : 'Library is empty. Upload your first video above.'}
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{filtered.map((item) => <LibraryTile key={item.name} item={item} />)}
				</div>
			)}
		</div>
	);
}
