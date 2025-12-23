import { GITHUB_TOKEN } from '$env/dynamic/private';
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
			'github-graph',
			async () => {
				const query = `
          query($username: String!) {
            user(login: $username){
              contributionsCollection {
                contributionCalendar {
                  totalContributions
                  weeks {
                    contributionDays {
                      contributionCount
                      date
                    }
                  }
                }
              }
            }
          }
         `;
				const response = await fetch(`https://api.github.com/graphql`, {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${GITHUB_TOKEN}`,
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						query,
						variables: { username }
					})
				});
				const data = await response.json();

				if (data.errors) {
					throw new Error(data.errors[0].message);
				}

				return data.data.user.contributionsCollection.contributionCalendar;
			},
			300000
		);
		return json(data);
	} catch (error: any) {
		return json({ error: error.message }, { status: 500 });
	}
}
