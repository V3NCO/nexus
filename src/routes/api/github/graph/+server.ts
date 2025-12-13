import { GITHUB_TOKEN } from '$env/static/private';
import { GITHUB_USERNAME } from '$lib/config';
import { json, type RequestEvent } from '@sveltejs/kit';

export async function GET({ url }: RequestEvent): Promise<Response> {
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

	try {
		const response = await fetch(`https://api.github.com/graphql`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${GITHUB_TOKEN}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				query,
				variables: { username: GITHUB_USERNAME }
			})
		});

		const data = await response.json();

		// Check for errors
		if (data.errors) {
			return json({ error: data.errors[0].message }, { status: 400 });
		}

		// Return only the calendar data
		return json(data.data.user.contributionsCollection.contributionCalendar);
	} catch (error: any) {
		return json({ error: error.message }, { status: 500 });
	}
}