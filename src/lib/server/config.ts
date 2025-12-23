import { db } from '$lib';
import { appConfig } from '$lib/auth/auth-schema';
import { eq } from 'drizzle-orm';

/**
 * Fetches a configuration value from the database.
 * @param key The configuration key to look up.
 * @returns The value associated with the key, or null if not found.
 */
export async function getConfigValue(key: string): Promise<string | null> {
	try {
		const [config] = await db.select().from(appConfig).where(eq(appConfig.key, key)).limit(1);
		return config?.value ?? null;
	} catch (error) {
		console.error(`Error fetching config value for key "${key}":`, error);
		return null;
	}
}

/**
 * Fetches multiple configuration values from the database.
 * @returns An object containing all configuration key-value pairs.
 */
export async function getAllConfig(): Promise<Record<string, string>> {
	try {
		const configs = await db.select().from(appConfig);
		return configs.reduce(
			(acc, curr) => {
				acc[curr.key] = curr.value;
				return acc;
			},
			{} as Record<string, string>
		);
	} catch (error) {
		console.error('Error fetching all config values:', error);
		return {};
	}
}