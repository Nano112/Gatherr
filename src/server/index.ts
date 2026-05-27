import express from "express";
import session from "express-session";
import expressLayouts from "express-ejs-layouts";
import path from "path";
import fs from "fs";
import config from "../config.js";
import logger from "../utils/logger.js";
import { stringify, prettySize } from "./utils/helpers.js";

// Import middleware
import { requireAuth } from "./middleware/auth.js";

// Import route handlers
import authRoutes from "./routes/auth.js";
import uploadRoutes from "./routes/upload.js";
import previewRoutes from "./routes/preview.js";
import apiRoutes from "./routes/api.js";

const WEB_DIST = path.join(process.cwd(), 'web/dist');
const WEB_INDEX = path.join(WEB_DIST, 'index.html');

const app = express();

// EJS retained for legacy preview.ejs (unused by new dashboard but harmless)
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'src/server/views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
	secret: 'gatherr-secret-change-me',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Serve legacy /static/* assets first, then the built SPA bundle
app.use(express.static(path.join(process.cwd(), 'src/server/public')));
if (fs.existsSync(WEB_DIST)) {
	app.use(express.static(WEB_DIST, { index: false }));
} else {
	logger.warn(`web/dist not found — run \`bun run web:build\` to build the dashboard SPA. Server will return placeholders until then.`);
}

// Template helpers (still needed for preview.ejs)
app.use((req, res, next) => {
	res.locals.stringify = stringify;
	res.locals.prettySize = prettySize;
	next();
});

// Auth gate (currently a no-op pass-through, see middleware/auth.ts)
app.use(requireAuth);

// API + auth routes — these win over the SPA fallback because they're registered first
app.use('/', authRoutes);
app.use('/', apiRoutes);
app.use('/', uploadRoutes);
app.use('/', previewRoutes);

// SPA fallback: every unmatched GET that isn't an API path returns index.html
// so React Router can take over client-side.
app.get(/^\/(?!api\/|debug\/|preview\/|login\b|logout\b|delete\/).*/, (_req, res) => {
	if (fs.existsSync(WEB_INDEX)) {
		res.sendFile(WEB_INDEX);
	} else {
		res.status(503).type('text/plain').send(
			'Gatherr dashboard bundle missing.\n\nRun:\n  bun run web:build\n\nThen reload.'
		);
	}
});

// Create necessary directories
if (!fs.existsSync(config.videosDir)) {
	fs.mkdirSync(config.videosDir);
}

if (!fs.existsSync(path.dirname(config.previewCacheDir))) {
	fs.mkdirSync(path.dirname(config.previewCacheDir), { recursive: true });
}

if (!fs.existsSync(config.previewCacheDir)) {
	fs.mkdirSync(config.previewCacheDir);
}

// Start server
app.listen(config.server_port, () => {
	logger.info(`Server is running on port ${config.server_port}`);
});

export default app;