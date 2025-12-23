import { HASS_TOKEN } from '$env/static/private';
import { HASS_URL } from '$env/static/private';
import { auth } from '$lib/auth/auth';
import { json, type RequestEvent } from '@sveltejs/kit';
import { cache } from '$lib/server/cache';
import { db } from '$lib';
import { locations } from '$lib/auth/auth-schema';
import { eq } from 'drizzle-orm';


export async function GET({ url, locals, params }: RequestEvent): Promise<Response> {
  const user = locals.user;
  const [item] = await db.select().from(locations).where(eq(locations.id, params.id!)).limit(1);

  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!item) {
    return json({ error: 'Location not found' }, { status: 404 });
  }

  const canReadLocation = await auth.api.userHasPermission({
    body: {
      userId: user.id,
      permission: {"location": ["read"]} as any
    }
  });
  if (!canReadLocation.success) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}
	try {
		const data = await cache.get(
      `hass-location-${item.hassid}`,
			async () => {
				const response = await fetch(`${HASS_URL}/api/states/${item.hassid}`, {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${HASS_TOKEN}`,
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
		const { hassid, emoji, label } = body;

		const [updatedLocation] = await db
			.update(locations)
			.set({
				...(hassid && { hassid }),
				...(emoji && { emoji }),
				...(label && { label })
			})
			.where(eq(locations.id, params.id!))
			.returning();

		if (!updatedLocation) {
			return json({ error: 'Location not found' }, { status: 404 });
		}

		return json(updatedLocation);
	} catch (error: any) {
		return json({ error: error.message }, { status: 500 });
	}
}

export async function DELETE({ locals, params }: RequestEvent): Promise<Response> {
	const user = locals.user;
	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const canDeleteLocation = await auth.api.userHasPermission({
		body: {
			userId: user.id,
			permission: { location: ['delete'] } as any
		}
	});

	if (!canDeleteLocation.success) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	try {
		const [deletedLocation] = await db
			.delete(locations)
			.where(eq(locations.id, params.id!))
			.returning();

		if (!deletedLocation) {
			return json({ error: 'Location not found' }, { status: 404 });
		}

		return json({ message: 'Location deleted successfully' });
	} catch (error: any) {
		return json({ error: error.message }, { status: 500 });
	}
}
