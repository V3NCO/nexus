// place files you want to import through the `$lib` alias in this folder.
import { env } from '$env/dynamic/private';
import { drizzle } from 'drizzle-orm/postgres-js';

export const db = drizzle(env.DATABASE_URL!);