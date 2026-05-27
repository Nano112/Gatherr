import { Router } from 'express';
import bcrypt from 'bcrypt';
import argon2 from 'argon2';
import config from '../../config.js';
import logger from '../../utils/logger.js';

const router = Router();

// GET /login is served by the React SPA via the SPA fallback in src/server/index.ts.

// Login route - POST
router.post("/login", async (req, res) => {
	const { username, password } = req.body;
	
	let isPasswordMatch = false;
	
	// Check if the stored password is a hash or plain text
	if (config.server_password.startsWith('$argon2')) {
		// Argon2 hash
		try {
			isPasswordMatch = await argon2.verify(config.server_password, password);
		} catch (err) {
			logger.error("Error verifying argon2 password:", err);
			isPasswordMatch = false;
		}
	} else if (config.server_password.startsWith('$2')) {
		// Bcrypt hash
		isPasswordMatch = await bcrypt.compare(password, config.server_password);
	} else {
		// Plain text (not recommended)
		isPasswordMatch = password === config.server_password;
	}
	
	if (username === config.server_username && isPasswordMatch) {
		(req.session as { user?: unknown }).user = username;
		res.json({ ok: true });
	} else {
		res.status(401).json({ ok: false, error: 'Invalid credentials' });
	}
});

// Logout route — supports both legacy GET (redirects to /login) and POST (JSON for React)
router.post("/logout", (req, res) => {
	req.session.destroy((err) => {
		if (err) logger.error("Error destroying session:", err);
		res.json({ ok: true });
	});
});
router.get("/logout", (req, res) => {
	req.session.destroy((err) => {
		if (err) logger.error("Error destroying session:", err);
		res.redirect("/login");
	});
});

export default router;