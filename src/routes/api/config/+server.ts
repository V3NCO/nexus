import { db } from '$lib';
import { appConfig } from '$lib/auth/auth-schema';
import { auth } from '$lib/auth/auth';
import { json, type RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

/**
 * GET /api/config
 * Returns all configuration keys and values.
 * Requires authentication.
 */
export async function GET({ locals }: RequestEvent): Promise<Response> {
	const user = locals.user;
	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const configs = await db.select().from(appConfig);
		const configMap = configs.reduce(
			(acc, curr) => {
				acc[curr.key] = curr.value;
				return acc;
			},
			{} as Record<string, string>
		);
		return json(configMap);
	} catch (error: any) {
		return json({ error: error.message }, { status: 500 });
	}
}

/**
 * POST /api/config
 * Sets or updates configuration values.
 * Expects a JSON object of key-value pairs.
 * Requires admin role.
 */
export async function POST({ locals, request }: RequestEvent): Promise<Response> {
	const user = locals.user;
	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	// Check if user is admin (using better-auth admin plugin check)
	const isAdmin = await auth.api.userHasPermission({
		body: {
			userId: user.id,
			permission: { user: ['update'] } as any // Admins typically have user update perms
		}
	});

	if (!isAdmin.success && user.role !== 'admin') {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	try {
		const body = await request.json();
		const entries = Object.entries(body);

		if (entries.length === 0) {
			return json({ error: 'No configuration provided' }, { status: 400 });
		}

		const results = [];
		for (const [key, value] of entries) {
			if (typeof value !== 'string') continue;

			const result = await db
				.insert(appConfig)
				.values({ key, value })
				.onConflictDoUpdate({
					target: appConfig.key,
					set: { value }
				})
				.returning();
			results.push(result[0]);
		}

		return json({ success: true, updated: results });
	} catch (error: any) {
		return json({ error: error.message }, { status: 500 });
	}
}