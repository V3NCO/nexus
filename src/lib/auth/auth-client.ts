import { createAuthClient } from 'better-auth/svelte'; // make sure to import from better-auth/svelte
import { genericOAuthClient } from 'better-auth/client/plugins';
import { adminClient } from "better-auth/client/plugins"
import { ac, locationAccess, admin, user } from "$lib/auth/permissions"


export const authClient = createAuthClient({
	plugins: [
	  genericOAuthClient(),
		adminClient({
      ac,
      roles: {
          user,
          admin,
          locationAccess
      }
    })
	]
});
