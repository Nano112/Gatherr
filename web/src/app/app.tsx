import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';

import { Shell } from '@/components/shell/layout';

import NowPlaying from '@/routes/now-playing';
import Library from '@/routes/library';
import Sources from '@/routes/sources';
import Logs from '@/routes/logs';
import Settings from '@/routes/settings';
import Login from '@/routes/login';
import NotFound from '@/routes/not-found';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 10_000,
			refetchOnWindowFocus: false,
		},
	},
});

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<Routes>
					{/* Auth routes — no shell */}
					<Route path="/login" element={<Login />} />

					{/* Shell-wrapped routes */}
					<Route element={<Shell />}>
						<Route path="/" element={<NowPlaying />} />
						<Route path="/library" element={<Library />} />
						<Route path="/sources" element={<Sources />} />
						<Route path="/logs" element={<Logs />} />
						<Route path="/settings" element={<Settings />} />
					</Route>

					{/* 404 — no shell */}
					<Route path="*" element={<NotFound />} />
				</Routes>
			</BrowserRouter>
			<Toaster richColors position="bottom-right" />
		</QueryClientProvider>
	);
}
