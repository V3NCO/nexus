import { GITHUB_TOKEN } from '$env/static/private';
import { GITHUB_USERNAME } from '$lib/config';
import { json, type RequestEvent } from '@sveltejs/kit';

export async function GET({ url }: RequestEvent): Promise<Response> {
	const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events`, {
		method: 'GET',
		headers: {
			access_token: GITHUB_TOKEN
		}
	});

	if (!response.ok) {
		return json({ error: 'failed to fetch activity' }, { status: response.status });
	}

	const events_json = await response.json();
	const events_push = events_json.filter((event: any) => event.type === 'PushEvent');
	const last_push = events_push[0];
	const commit_res = await fetch(
		`https://api.github.com/repos/${last_push.repo.name}/commits/${last_push.payload.head}`,
		{
			method: 'GET',
			headers: {
				access_token: GITHUB_TOKEN
			}
		}
	);
	const commit = await commit_res.json();
	return json(commit);
}
