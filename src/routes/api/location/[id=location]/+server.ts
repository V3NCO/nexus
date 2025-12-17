import { HASS_TOKEN } from '$env/static/private';
import { HASS_URL } from '$env/static/private';
import { HASS_LOCATION_ENTITY, LOCATIONS } from '$lib/config';
import { auth } from '$lib/auth/auth';
import { json, type RequestEvent } from '@sveltejs/kit';
import { cache } from '$lib/server/cache';


export async function GET({ url, locals, params }: RequestEvent): Promise<Response> {
  const user = locals.user;
  const item = await LOCATIONS.find(({ id }) => id.toString() === params.id)
  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 })
  }

  const canReadLocation = await auth.api.userHasPermission({
    body: {
      userId: user.id,
      permission: {"location": ["read"]}
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
