import { SLACK_TOKEN } from '$env/static/private';
import { SLACK_ID } from '$lib/config';
import { json, type RequestEvent } from '@sveltejs/kit';
import { cache } from '$lib/server/cache';

type SlackSearchResponse = {
	ok: boolean;
	messages: {
		matches: Array<{
			channel: {
        id: string;
        name: string;
				is_private: boolean;
				is_channel?: boolean;
			};
			text: string;
      user: string;
      username: string;
			permalink: string;
			ts: string;
		}>;
		paging: {
			page: number;
			pages: number;
			per_page: number;
		};
	};
};

async function findLastPublicMessage() {
	let page = 1;
	const perPage = 20;

	while (true) {
		const url = new URL('https://slack.com/api/search.messages');
		url.searchParams.set('query', `from:<@${SLACK_ID}>`);
		url.searchParams.set('sort', 'timestamp');
		url.searchParams.set('sort_dir', 'desc');
		url.searchParams.set('count', String(perPage));
		url.searchParams.set('page', String(page));

		const response = await fetch(url.toString(), {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${SLACK_TOKEN}`
			}
		});

		if (!response.ok) {
			throw new Error('Failed to fetch activity');
		}

		const res = (await response.json()) as SlackSearchResponse;

		const matches = res.messages?.matches ?? [];

		const publicMsg = matches.find((msg) => msg.channel && !msg.channel.is_private);

		if (publicMsg) {
      const usrurl = new URL('https://slack.com/api/users.profile.get');
      usrurl.searchParams.set('user', `${SLACK_ID}`);
      const usrresponse = await fetch(usrurl.toString(), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${SLACK_TOKEN}`
        }
      });

      if (!usrresponse.ok) {
        throw new Error('Failed to fetch user');
      }
      const usr = await usrresponse.json()

      return {message: publicMsg, user: usr};
		}

		const totalPages = res.messages?.paging?.pages ?? page;
		if (page >= totalPages) {
			return null;
		}

		page += 1;
	}
}

export async function GET({}: RequestEvent): Promise<Response> {
	try {
		const data = await cache.get(
			'lastslackmessage',
			async () => {
				return await findLastPublicMessage();
			},
			90000 // Cache for 90 seconds because omfg this takes time to loop through
		);

		return json(data);
	} catch (error: any) {
		return json({ error: error.message }, { status: 500 });
	}
}
