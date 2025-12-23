import { db } from '$lib';
import { locations } from '$lib/auth/auth-schema';
import { auth } from '$lib/auth/auth';
import { json, type RequestEvent } from '@sveltejs/kit';

export async function GET({ locals }: RequestEvent): Promise<Response> {
	const user = locals.user;
	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const canReadLocation = await auth.api.userHasPermission({
		body: {
			userId: user.id,
			permission: { location: ['read'] } as any
		}
	});

	if (!canReadLocation.success) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	try {
		const allLocations = await db.select().from(locations);
		return json(allLocations);
	} catch (error: any) {
		return json({ error: error.message }, { status: 500 });
	}
}

export async function POST({ locals, request }: RequestEvent): Promise<Response> {
	const user = locals.user;
	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const canWriteLocation = await auth.api.userHasPermission({
		body: {
			userId: user.id,
			permission: { location: ['write'] } as any
		}
	});

	if (!canWriteLocation.success) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	try {
		const body = await request.json();
		const { id, hassid, emoji, label } = body;

		if (!id || !hassid || !emoji || !label) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		const [newLocation] = await db
			.insert(locations)
			.values({
				id,
				hassid,
				emoji,
				label
			})
			.returning();

		return json(newLocation);
	} catch (error: any) {
		return json({ error: error.message }, { status: 500 });
	}
}
