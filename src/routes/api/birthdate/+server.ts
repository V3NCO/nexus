import { getConfigValue } from '$lib/server/config';
import { json, type RequestEvent } from '@sveltejs/kit';

export async function GET({ url }: RequestEvent): Promise<Response> {
	try {
		const birthdate = await getConfigValue('BIRTHDATE');

		if (!birthdate) {
			throw new Error('BIRTHDATE not found in config');
    }

    return json(
      {
        birthdate
      }
    )
	} catch (error: any) {
		return json({ error: error.message }, { status: 500 });
	}
}
