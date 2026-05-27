import { Outlet } from 'react-router-dom';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { TransportBar } from './transport-bar';

export function Shell() {
	return (
		<div className="flex h-full bg-[color:var(--color-bg)]">
			<Sidebar />
			<div className="flex flex-col flex-1 min-w-0 overflow-hidden">
				<Header />
				<main className="flex-1 overflow-y-auto">
					<div className="px-8 py-6 max-w-[1400px] mx-auto rise">
						<Outlet />
					</div>
				</main>
				<TransportBar />
			</div>
		</div>
	);
}
