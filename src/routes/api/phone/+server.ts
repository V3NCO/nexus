import { env } from '$env/dynamic/private';
import { getConfigValue } from '$lib/server/config';
import { json, type RequestEvent } from '@sveltejs/kit';
import { cache } from '$lib/server/cache';

export async function GET({ url, locals, params }: RequestEvent): Promise<Response> {
	try {
		const battery_lvl_entity = await getConfigValue('HASS_PHONE_BATTERY_LEVEL');
		if (!battery_lvl_entity) {
			throw new Error('HASS_PHONE_BATTERY_LEVEL not found in config');
		}
		const battery_state_entity = await getConfigValue('HASS_PHONE_BATTERY_STATE');
		if (!battery_state_entity) {
			throw new Error('HASS_PHONE_BATTERY_STATE not found in config');
    }
    const dnd_entity = await getConfigValue('HASS_PHONE_DND_SENSOR');
		if (!dnd_entity) {
			throw new Error('HASS_PHONE_DND_SENSOR not found in config');
		}
		const hotspot_entity = await getConfigValue('HASS_PHONE_HOTSPOT_STATE');
		if (!hotspot_entity) {
		  throw new Error('HASS_PHONE_HOTSPOT_STATE not found in config');
		}
		const locked_entity = await getConfigValue('HASS_PHONE_LOCKED_STATUS');
		if (!locked_entity) {
		  throw new Error('HASS_PHONE_LOCKED_STATUS not found in config');
    }
    const tailscale_enable = await getConfigValue('TAILSCALE_PHONE_SHOW');
		if (!tailscale_enable) {
		  throw new Error('TAILSCALE_PHONE_SHOW not found in config');
    }
		const tailscale_id = await getConfigValue('TAILSCALE_PHONE_ID')
		if (!tailscale_id) {
		  throw new Error('TAILSCALE_PHONE_ID not found in config');
    }

		const data_battery_lvl_entity = await cache.get(
			`hass-entity-${battery_lvl_entity}`, async () => {
				const response = await fetch(`${env.HASS_URL}/api/states/${battery_lvl_entity}`, {
					method: 'GET',
          headers: { Authorization: `Bearer ${env.HASS_TOKEN}`, 'Content-Type': 'application/json' }
        });
				const data = await response.json();
        if (data.errors) { throw new Error(data.errors[0].message); };
				return data;
			}, 20000
    );

		const data_battery_state_entity = await cache.get(
			`hass-entity-${battery_state_entity}`, async () => {
				const response = await fetch(`${env.HASS_URL}/api/states/${battery_state_entity}`, {
					method: 'GET',
          headers: { Authorization: `Bearer ${env.HASS_TOKEN}`, 'Content-Type': 'application/json' }
        });
				const data = await response.json();
        if (data.errors) { throw new Error(data.errors[0].message); };
				return data;
			}, 20000
    );

		const data_dnd_entity = await cache.get(
			`hass-entity-${dnd_entity}`, async () => {
				const response = await fetch(`${env.HASS_URL}/api/states/${dnd_entity}`, {
					method: 'GET',
          headers: { Authorization: `Bearer ${env.HASS_TOKEN}`, 'Content-Type': 'application/json' }
        });
				const data = await response.json();
        if (data.errors) { throw new Error(data.errors[0].message); };
				return data;
			}, 20000
    );

		const data_hotspot_entity = await cache.get(
			`hass-entity-${hotspot_entity}`, async () => {
				const response = await fetch(`${env.HASS_URL}/api/states/${hotspot_entity}`, {
					method: 'GET',
          headers: { Authorization: `Bearer ${env.HASS_TOKEN}`, 'Content-Type': 'application/json' }
        });
				const data = await response.json();
        if (data.errors) { throw new Error(data.errors[0].message); };
				return data;
			}, 20000
    );

		const data_locked_entity = await cache.get(
			`hass-entity-${locked_entity}`, async () => {
				const response = await fetch(`${env.HASS_URL}/api/states/${locked_entity}`, {
					method: 'GET',
          headers: { Authorization: `Bearer ${env.HASS_TOKEN}`, 'Content-Type': 'application/json' }
        });
				const data = await response.json();
        if (data.errors) { throw new Error(data.errors[0].message); };
				return data;
			}, 20000
    );
    let dnd_on;
    let hotspot_on;
    let locked_on;
    if (data_dnd_entity.state == "off") { dnd_on = false; } else { dnd_on = true; }
    if (data_hotspot_entity.state == "on") { hotspot_on = true; } else { hotspot_on = false; }
    if (data_locked_entity.state == "on") { locked_on = true; } else { locked_on = false; }

    if (tailscale_enable == "true") {
      const tailscale_device = await cache.get(
        `tailscale_${tailscale_id}`, async () => {
          const response = await fetch(`https://api.tailscale.com/api/v2/device/${tailscale_id}`, {
            method: 'GET',
              headers: { Authorization: `Bearer ${env.TAILSCALE_KEY}`, 'Content-Type': 'application/json' }
            });
          const data = await response.json();
            if (data.errors) { throw new Error(data.errors[0].message); };
          return data;
        }, 20000
      );

      return json(
        {
          battery: {
            level: {
              state: data_battery_lvl_entity.state, // %
              time: data_battery_lvl_entity.last_updated
            },
            state: {
              state: data_battery_state_entity.state, // Charging, discharging, full, not_charging
              state_time: data_battery_state_entity.last_updated
            }
          },
          dnd: {
            state: dnd_on,
            time: data_dnd_entity.last_updated
          },
          hotspot: {
            state: hotspot_on,
            time: data_hotspot_entity.last_updated
          },
          locked: {
            state: locked_on,
            time: data_locked_entity.last_updated
          },
          tailscale: {
            enabled: true,
            connected: tailscale_device.connectedToControl,
            time: tailscale_device.lastSeen
          }
        }
      );
    } else {
      return json(
        {
          battery: {
            level: {
              state: data_battery_lvl_entity.state, // %
              time: data_battery_lvl_entity.last_updated
            },
            state: {
              state: data_battery_state_entity.state, // Charging, discharging, full, not_charging
              state_time: data_battery_state_entity.last_updated
            }
          },
          dnd: {
            state: dnd_on,
            time: data_dnd_entity.last_updated
          },
          hotspot: {
            state: hotspot_on,
            time: data_hotspot_entity.last_updated
          },
          locked: {
            state: locked_on,
            time: data_locked_entity.last_updated
          },
          tailscale: {
            enabled: false
          }
        }
      );
    }
	} catch (error: any) {
		return json({ error: error.message }, { status: 500 });
	}
}
