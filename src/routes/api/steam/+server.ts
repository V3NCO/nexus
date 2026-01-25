import { env } from '$env/dynamic/private';
import { getConfigValue } from '$lib/server/config';
import { json, type RequestEvent } from '@sveltejs/kit';
import { cache } from '$lib/server/cache';

export async function GET({ url }: RequestEvent): Promise<Response> {
	try {
		const steamid = await getConfigValue('STEAM_ID')


    if (!steamid) {
      throw new Error('STEAM_ID not found in config');
    }

		const data = await cache.get(
			'steam',
			async () => {
				const response = await fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${env.STEAM_API_KEY}&format=json&steamids=${steamid}`);

				if (!response.ok) {
					throw new Error('Failed to fetch stats');
        }

        return await response.json()
			},
			30000
    );

    if (data.response.players[0].gameid) {
      const bgimage = `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${data.response.players[0].gameid}/hero_capsule.jpg`;
      return json(
        {
          username: data.response.players[0].personaname,
          nowplaying: true,
          bgimage,
          gameid: data.response.players[0].gameid,
          gamename: data.response.players[0].gameextrainfo
        }
      )
    } else {
      return json(
        {
          username: data.response.players[0].personaname,
          nowplaying: false
        }
      )
    }

	} catch (error: any) {
		return json({ error: error.message }, { status: 500 });
	}
}
