import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/index';
import { captcha } from "better-auth/plugins";
import {
	HACKCLUB_AUTH_CLIENT_ID,
	HACKCLUB_AUTH_CLIENT_SECRET,
	DISCORD_AUTH_CLIENT_ID,
	DISCORD_AUTH_CLIENT_SECRET,
	BETTER_AUTH_URL,
	HCAPTCHA_SECRET_KEY,
	HCAPTCHA_SITE_KEY
} from '$env/static/private';
import { genericOAuth } from 'better-auth/plugins';
import * as schema from '$lib/auth/auth-schema';
import { admin as adminPlugin } from "better-auth/plugins"
import { ac, locationAccess, admin, user } from "$lib/auth/permissions"


export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema
	}),
	emailAndPassword: {
		enabled: true
	},
	socialProviders: {
	  discord: {
      clientId: DISCORD_AUTH_CLIENT_ID as string,
      clientSecret: DISCORD_AUTH_CLIENT_SECRET as string,
    },
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
		}),
		captcha({
      provider: "hcaptcha",
      siteKey: HCAPTCHA_SITE_KEY,
      secretKey: HCAPTCHA_SECRET_KEY,
		}),
		adminPlugin({
      ac,
      roles: {
          user,
          admin,
          locationAccess
      }
    }),
	]
});

// todo https://www.better-auth.com/docs/plugins/admin#permissions
