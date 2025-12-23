import { GITHUB_TOKEN } from '$env/static/private';
import { getConfigValue } from '$lib/server/config';
import { json, type RequestEvent } from '@sveltejs/kit';
import { cache } from '$lib/server/cache';

export async function GET({ url }: RequestEvent): Promise<Response> {
	try {
		const username = await getConfigValue('GITHUB_USERNAME');
		if (!username) {
			throw new Error('GITHUB_USERNAME not found in config');
		}

		const data = await cache.get(
			'github-last-commit',
			async () => {
				const response = await fetch(`https://api.github.com/users/${username}/events`, {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${GITHUB_TOKEN}`
					}
				});

				if (!response.ok) {
					throw new Error('Failed to fetch activity');
				}

				const events_json = await response.json();
				const events_push = events_json.filter((event: any) => event.type === 'PushEvent');
				const last_push = events_push[0];

				const commit_res = await fetch(
					`https://api.github.com/repos/${last_push.repo.name}/commits/${last_push.payload.head}`,
					{
						method: 'GET',
						headers: {
							Authorization: `Bearer ${GITHUB_TOKEN}`
						}
					}
				);

				if (!commit_res.ok) {
					throw new Error('Failed to fetch commit');
				}

				return await commit_res.json();
			},
			120000 // Cache for 2 minutes
		);

		return json(data);
	} catch (error: any) {
		return json({ error: error.message }, { status: 500 });
	}
}
