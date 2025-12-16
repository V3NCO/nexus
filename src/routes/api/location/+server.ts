import { HASS_TOKEN } from '$env/static/private';
import { HASS_URL } from '$env/static/private';
import { HASS_LOCATION_ENTITY } from '$lib/config';

import { json, type RequestEvent } from '@sveltejs/kit';
import { cache } from '$lib/server/cache';

export async function GET({ url }: RequestEvent): Promise<Response> {
	try {
		const data = await cache.get(
			'hass-location',
			async () => {
				const response = await fetch(`${HASS_URL}/api/states/${HASS_LOCATION_ENTITY}`, {
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

				return json({ latitude: data.attributes.latitude, longitude: data.attributes.longitude });
			},
			60000
		);
		return data;
	} catch (error: any) {
		return json({ error: error.message }, { status: 500 });
	}
}
