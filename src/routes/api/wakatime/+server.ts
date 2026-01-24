import { env } from '$env/dynamic/private';
import { getConfigValue } from '$lib/server/config';
import { json, type RequestEvent } from '@sveltejs/kit';
import { cache } from '$lib/server/cache';

export async function GET({ url }: RequestEvent): Promise<Response> {
	try {
		const url = await getConfigValue('WAKATIME_URL');
		const username = await getConfigValue('WAKATIME_USERNAME')

		if (!url) {
			throw new Error('WAKATIME_URL not found in config');
    }

    if (!username) {
      throw new Error('WAKATIME_USERNAME not found in config');
    }
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const startDate = today.toISOString().split('T')[0];
    const endDate = tomorrow.toISOString().split('T')[0];


		const data = await cache.get(
			'wakatime-stats',
			async () => {
				const response = await fetch(`${url}/users/${username}/stats?start_date=${startDate}&end_date=${endDate}&features=projects`, {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${env.WAKATIME_API_KEY}`
					}
        });

				if (!response.ok) {
					throw new Error('Failed to fetch stats');
        }

        return await response.json()
			},
			10000
    );

		const last_hb = await cache.get(
			'wakatime-heartbeat',
			async () => {
				const response = await fetch(`${url}/my/heartbeats/most_recent`, {
				  method: 'GET',
				  headers: {
					  Authorization: `Bearer ${env.WAKATIME_API_KEY}`
				  }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch latest heartbeat');
        }
        return await response.json()
			},
			10000
    );
		let currentlyHacking = false;
    if (last_hb?.has_heartbeat) {
      const hbtime = last_hb?.heartbeat?.time
      const seconds = (Date.now() - hbtime * 1000) / 1000;

      if (seconds < 60) {
        currentlyHacking = true;
      }
    } else { currentlyHacking = false; }

    const todayTime = data?.data?.human_readable_total
    const projects = data?.data?.projects
    return json(
      {
        currentlyHacking,
        todayTime,
        projects
      }
    )
	} catch (error: any) {
		return json({ error: error.message }, { status: 500 });
	}
}
