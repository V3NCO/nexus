import { json } from '@sveltejs/kit';
import { db } from '$lib';
import { auth } from '$lib/auth/auth';
import { appConfig, locations, user } from '$lib/auth/auth-schema';
import { eq } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async ({ request }) => {
	if (env.DANGER_INITAL_RUN_THIS_CAN_GIVE_ADMIN_TO_ANYONE_WHEN_TRUE === 'y') {
		try {
			// Run migrations
			console.log('Running migrations...');
			try {
				await migrate(db, { migrationsFolder: 'drizzle' });
				console.log('Migrations completed.');
			} catch (migrationError) {
				console.error('Migration failed or already applied:', migrationError);
			}

			const adminEmail = 'admin@admin.nexus';
			const adminPassword = 'Admin123!';
			const adminName = 'admin';

			const existingUsers = await db.select().from(user).where(eq(user.email, adminEmail)).limit(1);

			if (existingUsers.length === 0) {
				// Create user via Better Auth API to handle password hashing correctly
				await auth.api.signUpEmail({
					body: {
						email: adminEmail,
						password: adminPassword,
						name: adminName
					},
					headers: request.headers
				});
			}

			const [adminUser] = await db.select().from(user).where(eq(user.email, adminEmail)).limit(1);

			if (adminUser) {
				await db
					.update(user)
					.set({
						role: 'admin',
						emailVerified: true
					})
					.where(eq(user.id, adminUser.id));
			}

			const configs = [
				{ key: 'GITHUB_USERNAME', value: 'v3nco' },
				{ key: 'HASS_TIMEZONE_ENTITY', value: 'sensor.pixel_8_pro_current_time_zone' },
				{ key: 'LASTFM_USERNAME', value: 'v3nco' },
        { key: 'SLACK_ID', value: 'U08L7671TDG' },
        { key: 'WAKATIME_URL', value: 'https://hackatime.hackclub.com/api/v1' },
        { key: 'WAKATIME_USERNAME', value: 'Esther' },
        { key: 'BIRTHDATE', value: '2010-01-30T02:00:00Z' },
        { key: 'HASS_STEPS_ENTITY', value: 'sensor.pixel_8_pro_daily_steps' },
        { key: 'STEPS_OBJECTIVE', value: '10000' }
			];

			for (const config of configs) {
				await db
					.insert(appConfig)
					.values(config)
					.onConflictDoUpdate({
						target: appConfig.key,
						set: { value: config.value }
					});
			}

			// 3. Insert Locations
			const defaultLocations = [
				{ id: '1', hassid: 'device_tracker.pixel_8_pro', emoji: '📱', label: 'My Phone :3' },
				{ id: '2', hassid: 'device_tracker.stardust', emoji: '💻', label: 'Stardust - my mac!' }
			];

			for (const loc of defaultLocations) {
				await db
					.insert(locations)
					.values(loc)
					.onConflictDoUpdate({
						target: locations.id,
						set: { hassid: loc.hassid, emoji: loc.emoji, label: loc.label }
					});
			}

			return json({
				success: true,
				message: 'Setup completed successfully',
				adminEmail,
				adminPassword: adminPassword
			});
		} catch (error) {
			console.error('Setup error:', error);
			return json(
				{
					success: false,
					error: 'Setup failed',
					details: error instanceof Error ? error.message : String(error)
				},
				{ status: 500 }
			);
		}
	} else {
		return json(
			{
				success: false,
				error: 'This endpoint is only available on initial run!'
			},
			{ status: 401 }
		);
	}
};
