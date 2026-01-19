import { db } from '$lib';
import { calendars } from '$lib/auth/auth-schema';
import { auth } from '$lib/auth/auth';
import { json, type RequestEvent } from '@sveltejs/kit';

export async function GET({ locals }: RequestEvent): Promise<Response> {
	const user = locals.user;
	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const allCalendars = await db.select().from(calendars);
		return json(allCalendars);
	} catch (error: any) {
		return json({ error: error.message }, { status: 500 });
	}
}

export async function POST({ locals, request }: RequestEvent): Promise<Response> {
	const user = locals.user;
	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const canWriteCalendar = await auth.api.userHasPermission({
		body: {
			userId: user.id,
			permission: { calendar: ['write'] } as any
		}
	});

	if (!canWriteCalendar.success) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	try {
		const body = await request.json();
		const { id, url, color, name } = body;

		if (!id || !url || !color || !name) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		const [newCalendar] = await db
			.insert(calendars)
			.values({
				id,
				url,
				color,
				name
			})
			.returning();

		return json(newCalendar);
	} catch (error: any) {
		return json({ error: error.message }, { status: 500 });
	}
}
