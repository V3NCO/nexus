import { createAuthClient } from 'better-auth/svelte'; // make sure to import from better-auth/svelte

export const authClient = createAuthClient({
	// you can pass client configuration here
});
// example usage at https://www.better-auth.com/docs/integrations/svelte-kit