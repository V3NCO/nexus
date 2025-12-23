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
