export function formatDuration(seconds: number | null | undefined): string {
	if (seconds == null || seconds <= 0) return '--:--';
	const s = Math.floor(seconds);
	const h = Math.floor(s / 3600);
	const m = Math.floor((s % 3600) / 60);
	const sec = s % 60;
	if (h > 0) {
		return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
	}
	return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

export function formatRelativeTime(timestamp: number | undefined): string {
	if (!timestamp) return '';
	const diffMs = Date.now() - timestamp;
	const diffSec = Math.floor(diffMs / 1000);
	if (diffSec < 60) return `${diffSec}s ago`;
	const diffMin = Math.floor(diffSec / 60);
	if (diffMin < 60) return `${diffMin}m ago`;
	const diffHr = Math.floor(diffMin / 60);
	if (diffHr < 24) return `${diffHr}h ago`;
	return `${Math.floor(diffHr / 24)}d ago`;
}

export function formatTotalDuration(items: Array<{ duration: number | null }>): string {
	const total = items.reduce((acc, i) => acc + (i.duration ?? 0), 0);
	return formatDuration(total);
}

export function formatBytes(bytes: number): string {
	if (bytes === 0) return '0 B';
	const units = ['B', 'KB', 'MB', 'GB'];
	const i = Math.min(Math.floor(Math.log2(bytes) / 10), units.length - 1);
	const val = bytes / Math.pow(1024, i);
	return `${val % 1 === 0 ? val : val.toFixed(1)} ${units[i]}`;
}
