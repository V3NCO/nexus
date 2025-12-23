import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/index';
// import { captcha } from "better-auth/plugins";
import { env } from '$env/dynamic/private';
import { genericOAuth } from 'better-auth/plugins';
import * as schema from '$lib/auth/auth-schema';
import { admin as adminPlugin } from "better-auth/plugins"
import { ac, locationAccess, admin, user } from "$lib/auth/permissions"


export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema
	}),
  // Provide a fallback secret for build-time analysis to prevent BetterAuth from crashing
  secret: env.BETTER_AUTH_SECRET || 'secret-key-only-used-during-build-analysis',
  user: {
    deleteUser: {
      enabled: true
    }
  },
	emailAndPassword: {
		enabled: true
	},
	socialProviders: {
	  discord: {
      clientId: env.DISCORD_AUTH_CLIENT_ID as string,
      clientSecret: env.DISCORD_AUTH_CLIENT_SECRET as string,
    },
	},
	baseURL: env.BETTER_AUTH_URL || 'http://localhost:5173',
	plugins: [
		sveltekitCookies(getRequestEvent),
		genericOAuth({
			config: [
				{
					providerId: 'hackclub',
					clientId: env.HACKCLUB_AUTH_CLIENT_ID || 'dummy-id',
					clientSecret: env.HACKCLUB_AUTH_CLIENT_SECRET || 'dummy-secret',
					discoveryUrl: 'https://auth.hackclub.com/.well-known/openid-configuration',
					authorizationUrl: 'https://auth.hackclub.com/oauth/authorize',
					scopes: ['openid', 'email', 'profile', 'slack_id']
				}
			]
		}),
		// captcha({
    //   provider: "hcaptcha",
    //   siteKey: env.HCAPTCHA_SITE_KEY,
    //   secretKey: env.HCAPTCHA_SECRET_KEY,
    // }),
		adminPlugin({
      ac,
      roles: {
          user,
          admin,
          locationAccess
      },
      defaultRole: "user"
    }),
	]
});

// todo https://www.better-auth.com/docs/plugins/admin#permissions