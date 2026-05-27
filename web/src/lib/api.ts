export class ApiError extends Error {
	status: number;
	constructor(status: number, message: string) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
	}
}

export async function api<T = unknown>(path: string, init?: RequestInit): Promise<T> {
	const r = await fetch(path, {
		credentials: 'same-origin',
		...init,
		headers: {
			'Content-Type': 'application/json',
			...(init?.headers || {}),
		},
	});
	if (!r.ok) {
		let msg = `${r.status}`;
		try {
			const data = await r.json();
			msg = data.error || msg;
		} catch {}
		throw new ApiError(r.status, msg);
	}
	if (r.status === 204) return undefined as T;
	const ct = r.headers.get('content-type') || '';
	return ct.includes('application/json')
		? ((await r.json()) as T)
		: ((await r.text()) as unknown as T);
}
