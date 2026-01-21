<!-- JS Part -->
<script lang="ts">
    import { writable } from 'svelte/store';
    import { type Calendar } from '$lib/config';
    import { onMount } from 'svelte';

    type CalendarEvent = {
      summary: string;
      color: string | null;
      start: {
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
        second: number;
        isDate: boolean;
        timezone: string;
      };
      end: {
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
        second: number;
        isDate: boolean;
        timezone: string;
      };
    };

    type CalendarData = Calendar & {
      events: CalendarEvent[];
    };

    const calendars = writable<CalendarData[]>([]);
    const events = writable<CalendarEvent[]>([]);
    const time = writable(new Date());
    const eventOngoing = writable(false);
    const currentColor = writable("rgb(66, 133, 244)")
    const selectedEvent = writable<CalendarEvent | null>(null);
    let progress = 0;

    const fetchCalendars = async () => {
      const res = await fetch('/api/calendars');
      const cals: Calendar[] = await res.json();

      const calendarPromises = cals.map(async (cal) => {
        const response = await fetch(`/api/calendar/${cal.id}`);
        const calEvents: CalendarEvent[] = await response.json();
        return { ...cal, events: calEvents };
      });

      const fetchedCalendars = await Promise.all(calendarPromises);
      calendars.set(fetchedCalendars);

      const allEvents = fetchedCalendars.flatMap((cal) => cal.events);
      events.set(allEvents);
    };

    function getCurrentEvent(events: CalendarEvent[], currentTime: Date): CalendarEvent | null {
      const timeUTC = new Date();

      for (const event of events) {
        const start = new Date(Date.UTC(
            event.start.year,
            event.start.month - 1,
            event.start.day,
            event.start.hour,
            event.start.minute,
            event.start.second
        ));

        const end = new Date(Date.UTC(
            event.end.year,
            event.end.month - 1,
            event.end.day,
            event.end.hour,
            event.end.minute,
            event.end.second
        ));
        if (timeUTC >= start && timeUTC <= end) {
          return event;
        }
      }
      return null;
    }

    function getNextEvent(events: CalendarEvent[], currentTime: Date): CalendarEvent | null {
      const timeUTC = new Date(currentTime.getTime() + currentTime.getTimezoneOffset() * 60000);

      const futureEvents = events
        .map(event => ({
          ...event,
          startDate: new Date(Date.UTC(
            event.start.year,
            event.start.month - 1,
            event.start.day,
            event.start.hour,
            event.start.minute,
            event.start.second
          ))
        }))
        .filter(event => event.startDate > timeUTC);

      if (futureEvents.length > 0) {
        const nextEvent = futureEvents.reduce((earliest, current) => {
          return current.startDate < earliest.startDate ? current : earliest;
        });
        return nextEvent;
      }
      return null;
    }

    onMount(() => {
        fetchCalendars();
        const clockInterval = setInterval(() => {
            time.set(new Date());
        }, 1000);

        const checkCurrent = setInterval(() => {
            let currentTime: Date;
            let allEvents: CalendarEvent[];

            time.subscribe(value => currentTime = value)();
            events.subscribe(value => allEvents = value)();

            const currentEvent = getCurrentEvent(allEvents, currentTime);
            if (currentEvent) {
              console.log(`Event Ongoing: ${currentEvent.summary}`);
              selectedEvent.set(currentEvent);
              const startDate = new Date(Date.UTC(
                $selectedEvent?.start.year,
                $selectedEvent?.start.month - 1,
                $selectedEvent?.start.day,
                $selectedEvent?.start.hour,
                $selectedEvent?.start.minute,
                $selectedEvent?.start.second
              ))
              const endDate = new Date(Date.UTC(
                $selectedEvent?.end.year,
                $selectedEvent?.end.month - 1,
                $selectedEvent?.end.day,
                $selectedEvent?.end.hour,
                $selectedEvent?.end.minute,
                $selectedEvent?.end.second
              ))
              const timeElapsed = currentTime.getTime() -startDate?.getTime();
              const totalTime = endDate.getTime()-startDate.getTime();
              progress = (timeElapsed/totalTime)*100
              currentColor.set($selectedEvent.color || "rgb(66, 133, 244)");
              console.log($currentColor)
              eventOngoing.set(true);
            } else {
              eventOngoing.set(false);
              const nextEvent = getNextEvent(allEvents, currentTime);
              console.log(`Next Event: ${nextEvent ? nextEvent.summary : 'No upcoming events'}`);
              selectedEvent.set(nextEvent);
            }
        }, 1000);

        return () => {
            clearInterval(clockInterval);
            clearInterval(checkCurrent);
        };
    });
    $: progressAngle = `${progress / 100 * 360}deg`;
</script>
<!-- HTML Part -->
<div class="item">
    <div class="box">
        <section>
            <div class="item left">
                {#if $eventOngoing}
                    <p>Currently in: {$selectedEvent?.summary}</p>
                {:else if $selectedEvent}
                    <p>Next event: {$selectedEvent.summary}</p>
                {:else}
                    <p>No upcoming events</p>
                {/if}
                <div
                    class="circular-bar"
                    style="background: conic-gradient({$currentColor} {progressAngle}, rgb(232, 240, 247) 0deg);">
                </div>
            </div>
            <div class="item">

            </div>
        </section>
    </div>
</div>

<!-- CSS Part -->
<style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

    .box {
        background-color: #EFEFEF;
        border-radius: 2rem;
        position: absolute;
        inset: 10px;
        font-family: "Montserrat", sans-serif;
        font-optical-sizing: auto;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .item {
      flex-basis: 0;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-top: 2em;
      padding-bottom: 2em;
    }

    section {
        display: flex;
        flex: 1;
        min-height: 0;
        overflow: hidden;
    }

    .left {
        padding-left: 1vmax;
    }


    .circular-bar{
        width: 60%;
        aspect-ratio: 1/1;
        background: conic-gradient(#4285f4 1.5deg, #e8f0f7 0deg);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 6px 6px 10px -1px rgba(0,0,0,0.15),
        -6px -6px 10px -1px rgba(255,255,255,0.7);
        margin-bottom: 40px;
        position: relative;
    }

    .circular-bar::before{
        content: "";
        position: absolute;
        width: 60%;
        aspect-ratio: 1/1;
        background: #e8f0f7;
        border-radius: 50%;
        box-shadow: inset 6px 6px 10px -1px rgba(0,0,0,0.15),
        inset -6px -6px 10px -1px rgba(255,255,255,0.7);
    }
</style>
