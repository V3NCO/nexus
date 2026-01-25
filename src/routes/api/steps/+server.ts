import { env } from '$env/dynamic/private';
import { getConfigValue } from '$lib/server/config';
import { auth } from '$lib/auth/auth';
import { json, type RequestEvent } from '@sveltejs/kit';
import { cache } from '$lib/server/cache';

export async function GET({ url, locals, params }: RequestEvent): Promise<Response> {
	try {
		const stepsEntity = await getConfigValue('HASS_STEPS_ENTITY');
		if (!stepsEntity) {
			throw new Error('HASS_STEPS_ENTITY not found in config');
		}

		const data = await cache.get(
			`hass-timezone-${stepsEntity}`,
			async () => {
				const response = await fetch(`${env.HASS_URL}/api/states/${stepsEntity}`, {
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

				return data.state;
			},
			20000
		);
		return json(data);
	} catch (error: any) {
		return json({ error: error.message }, { status: 500 });
	}
}
