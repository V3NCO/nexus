// place files you want to import through the `$lib` alias in this folder.
import { DATABASE_URL } from '$env/dynamic/private';
import { drizzle } from 'drizzle-orm/postgres-js';

export const db = drizzle(DATABASE_URL);
