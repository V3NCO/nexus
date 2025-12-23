// place files you want to import through the `$lib` alias in this folder.
import { env } from '$env/dynamic/private';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Use a dummy URL during build analysis to prevent the 'options' of undefined error
const client = postgres(env.DATABASE_URL || 'postgres://localhost:5432/nexus');
export const db = drizzle(client);
