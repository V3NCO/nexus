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
	
	
}
