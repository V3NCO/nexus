import { env } from '$env/dynamic/private';
import { auth } from '$lib/auth/auth';
import { json, type RequestEvent } from '@sveltejs/kit';
import { cache } from '$lib/server/cache';
import { db } from '$lib';
import { calendars } from '$lib/auth/auth-schema';
import { eq } from 'drizzle-orm';


export async function GET({ url, locals, params }: RequestEvent): Promise<Response> {
  const user = locals.user;
  const [item] = await db.select().from(calendars).where(eq(calendars.id, params.id!)).limit(1);

  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!item) {
    return json({ error: 'Calendar not found' }, { status: 404 });
  }

	try {
		const data = await cache.get(
      `calendar-${item.name}`,
			async () => {
				const response = await fetch(`${env.HASS_URL}/api/states/${item.name}`, {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${env.HASS_TOKEN}`,
						'Content-Type': 'application/json'
					}
				});
				const data = await response.json();

			if (data.errors) {
				throw new Error(data.errors[0].message);
			}

			return { lng: data.attributes.longitude, lat: data.attributes.latitude };
		},
		60000
	);
	return json(data);
	} catch (error: any) {
		return json({ error: error.message }, { status: 500 });
	}
}

export async function PATCH({ locals, params, request }: RequestEvent): Promise<Response> {
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
		const { url, color, name } = body;

		const [updatedCalendar] = await db
			.update(calendars)
			.set({
				...(url && { url }),
				...(color && { color }),
				...(name && { name })
			})
			.where(eq(calendars.id, params.id!))
			.returning();

		if (!updatedCalendar) {
			return json({ error: 'Calendar not found' }, { status: 404 });
		}

		return json(updatedCalendar);
	} catch (error: any) {
		return json({ error: error.message }, { status: 500 });
	}
}

export async function DELETE({ locals, params }: RequestEvent): Promise<Response> {
	const user = locals.user;
	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const canDeleteCalendar = await auth.api.userHasPermission({
		body: {
			userId: user.id,
			permission: { calendar: ['delete'] } as any
		}
	});

	if (!canDeleteCalendar.success) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	try {
		const [deletedCalendar] = await db
			.delete(calendars)
			.where(eq(calendars.id, params.id!))
			.returning();

		if (!deletedCalendar) {
			return json({ error: 'Calendar not found' }, { status: 404 });
		}

		return json({ message: 'Calendar deleted successfully' });
	} catch (error: any) {
		return json({ error: error.message }, { status: 500 });
	}
}
