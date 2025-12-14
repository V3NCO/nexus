import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/index';
import {
	HACKCLUB_AUTH_CLIENT_ID,
	HACKCLUB_AUTH_CLIENT_SECRET,
	BETTER_AUTH_URL
} from '$env/static/private';
import { genericOAuth } from 'better-auth/plugins';
import * as schema from '$lib/auth-schema';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema
	}),
	emailAndPassword: {
		enabled: true
	},
	baseURL: BETTER_AUTH_URL || 'http://localhost:5173',
	plugins: [
		sveltekitCookies(getRequestEvent),
		genericOAuth({
			config: [
				{
					providerId: 'hackclub',
					clientId: HACKCLUB_AUTH_CLIENT_ID,
					clientSecret: HACKCLUB_AUTH_CLIENT_SECRET,
					discoveryUrl: 'https://auth.hackclub.com/.well-known/openid-configuration',
					authorizationUrl: 'https://auth.hackclub.com/oauth/authorize',
					scopes: ['openid', 'email', 'profile', 'slack_id']
				}
			]
		})
	]
});
