import { HASS_TOKEN } from '$env/static/private';
import { HASS_URL } from '$env/static/private';
import { HASS_TIMEZONE_ENTITY } from '$lib/config';
import { auth } from '$lib/auth/auth';
import { json, type RequestEvent } from '@sveltejs/kit';
import { cache } from '$lib/server/cache';


export async function GET({ url, locals, params }: RequestEvent): Promise<Response> {
	try {
		const data = await cache.get(
      `hass-timezone`,
			async () => {
				const response = await fetch(`${HASS_URL}/api/states/${HASS_TIMEZONE_ENTITY}`, {
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

      return data.attributes.time_zone_id;
		},
		3600000
	);
	return json(data);
} catch (error: any) {
	return json({ error: error.message }, { status: 500 });
}
}
