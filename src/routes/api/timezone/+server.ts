import { HASS_TOKEN } from '$env/static/private';
import { HASS_URL } from '$env/static/private';
import { getConfigValue } from '$lib/server/config';
import { auth } from '$lib/auth/auth';
import { json, type RequestEvent } from '@sveltejs/kit';
import { cache } from '$lib/server/cache';


export async function GET({ url, locals, params }: RequestEvent): Promise<Response> {
	try {
		const timezoneEntity = await getConfigValue('HASS_TIMEZONE_ENTITY');
		if (!timezoneEntity) {
			throw new Error('HASS_TIMEZONE_ENTITY not found in config');
		}

		const data = await cache.get(
			`hass-timezone-${timezoneEntity}`,
			async () => {
				const response = await fetch(`${HASS_URL}/api/states/${timezoneEntity}`, {
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
