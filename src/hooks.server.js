import { auth } from '$lib/auth/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';
import { db } from '$lib';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

let migrated = false;

export async function handle({ event, resolve }) {
	if (!migrated && !building) {
		console.log('Running database migrations...');
		await migrate(db, { migrationsFolder: 'drizzle' });
		migrated = true;
		console.log('Database migrations completed.');
	}

	// Fetch current session from Better Auth
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	// Make session and user available on server
	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	return svelteKitHandler({ event, resolve, auth, building });
}
