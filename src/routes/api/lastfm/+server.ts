import { LASTFM_KEY, LASTFM_SHARED_SECRET } from '$env/static/private';
import { getConfigValue } from '$lib/server/config';
import { json, type RequestEvent } from '@sveltejs/kit';
import { cache } from '$lib/server/cache';

export async function GET({ url }: RequestEvent): Promise<Response> {
	try {
		const username = await getConfigValue('LASTFM_USERNAME');
		if (!username) {
			throw new Error('LASTFM_USERNAME not found in config');
		}

		const data = await cache.get(
			'lastfm',
			async () => {
				const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=${username}&api_key=${LASTFM_KEY}&format=json`,{method: 'GET'});

				if (!response.ok) {
					throw new Error('Failed to fetch activity');
				}

				return await response.json();
			},
			10000 // Cache for 10 seconds
		);
		let current
		const track = data?.recenttracks?.track

		if (track.length > 0) {
      const trarray = track[0];
      if (trarray['@attr'] && trarray['@attr']['nowplaying']) {
        current = { nowplaying: true, track: trarray };
      } else {
          current = { nowplaying: false, track: null };
		}
		}

		return json(current);
	} catch (error: any) {
		return json({ error: error.message }, { status: 500 });
	}
}
