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
