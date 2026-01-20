import {env} from '$env/dynamic/private';
import {auth} from '$lib/auth/auth';
import {json, type RequestEvent} from '@sveltejs/kit';
import {cache} from '$lib/server/cache';
import {db} from '$lib';
import {calendars} from '$lib/auth/auth-schema';
import {eq} from 'drizzle-orm';
import ICAL from 'ical.js';

export async function GET({url, locals, params}: RequestEvent): Promise<Response> {
    const [item] = await db.select().from(calendars).where(eq(calendars.id, params.id!)).limit(1);
    if (!item) {
        return json({error: 'Calendar not found'}, {status: 404});
    }

    try {
        const data = await cache.get(
            `calendar-${item.id}`,
            async () => {
                const variableName = item.username;
                const variablePass = item.password;
                const name = env[variableName];
                const pass = env[variablePass];

                const response = await fetch(`${item.url}`, {
                    method: 'GET',
                    headers:
                    {'Authorization': "Basic " + Buffer.from(`${name}:${pass}`).toString('base64')}
                });

                const data = await response.text();

                let jcalData = await ICAL.parse(data);
                var comp = new ICAL.Component(jcalData);
                let events = [];

                const now = new Date();
                const today = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
                const tomorrow = new Date(today);
                tomorrow.setUTCDate(today.getUTCDate() + 1);
                const dayAfterTomorrow = new Date(today);
                dayAfterTomorrow.setUTCDate(today.getUTCDate() + 2);

                for (const event of comp.getAllSubcomponents("vevent")) {
                  let ievent = new ICAL.Event(event);
                  const eventStart = ievent.startDate.toJSDate();
                  const eventEnd = ievent.endDate.toJSDate();

                  if (
                    (eventStart >= today && eventStart < dayAfterTomorrow) ||
                    (eventEnd >= today && eventEnd < dayAfterTomorrow)
                  ) {
                    events.push({
                      "summary": ievent.summary,
                      "color": ievent.color,
                      //"location": ievent.location,
                      "start": {
                        year: eventStart.getUTCFullYear(),
                        month: eventStart.getUTCMonth() + 1,
                        day: eventStart.getUTCDate(),
                        hour: eventStart.getUTCHours(),
                        minute: eventStart.getUTCMinutes(),
                        second: eventStart.getUTCSeconds(),
                        isDate: ievent.startDate.isDate,
                        timezone: "UTC"
                      },
                      "end": {
                        year: eventEnd.getUTCFullYear(),
                        month: eventEnd.getUTCMonth() + 1,
                        day: eventEnd.getUTCDate(),
                        hour: eventEnd.getUTCHours(),
                        minute: eventEnd.getUTCMinutes(),
                        second: eventEnd.getUTCSeconds(),
                        isDate: ievent.endDate.isDate,
                        timezone: "UTC"
                      }
                    });
                  }
                };

                events.sort((a, b) => {
                  const startA = new Date(Date.UTC(a.start.year, a.start.month - 1, a.start.day, a.start.hour, a.start.minute, a.start.second));
                  const startB = new Date(Date.UTC(b.start.year, b.start.month - 1, b.start.day, b.start.hour, b.start.minute, b.start.second));
                  return startA.getTime() - startB.getTime();
                });

                return events;
            },
            60000
        );
        return json(data);
    } catch (error: any) {
        return json({error: error.message}, {status: 500});
    }
}
