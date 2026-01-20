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

    type Events = CalendarEvent[];

    let calendars = writable<CalendarData[]>([]);
    let events = writable<Events>([]);
    let time = writable(new Date());
    let eventOngoing = writable(false);
    let selectedEvent = writable<CalendarEvent | null>(null);

    const fetchCalendars = async () => {
      const res = await fetch('/api/calendars');
      const cals: Calendar[] = await res.json();

      for (const cal of cals) {
        const response = await fetch(`/api/calendar/${cal.id}`);
        const calEvents: CalendarEvent[] = await response.json();
        calendars.update((c) => [...c, { ...cal, events: calEvents }]);
        console.log("Pushed calendar");
        events.update((evts) => [...evts, ...calEvents]);
      }
    };

    function getCurrentEvent(events: Events) {
      const timeUTC = new Date($time.toISOString());

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

    function getNextEvent(events: Events) {
      const timeUTC = new Date($time.toISOString());

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
        const clockinterval = setInterval(() => {
            time.set(new Date());
        }, 1000);

        const checkCurrent = setInterval(() => {
            console.log("Checking!");
            console.log($events);
            const currentevent = getCurrentEvent($events);
            if (currentevent != null) {
              console.log(`Event Ongoing! ${currentevent}`);
              selectedEvent.set(currentevent);
              eventOngoing.set(true);
            } else {
              eventOngoing.set(false);
              const nextevent = getNextEvent($events);
              console.log(`Next Event! ${nextevent}`);
              selectedEvent.set(nextevent);
              if (nextevent == null) {
                console.log(`No event :c`);
              }
            }
        }, 20000);

        return () => {
            clearInterval(clockinterval);
            clearInterval(checkCurrent);
        };
    });

    let progress = 70;
</script>
<!-- HTML Part -->
<div class="item">
    <div class="box">
        <section>
            <div class="item left">
                Currently in:
                <div class="circular-bar" style="background: conic-gradient(rgb(66, 133, 244) {progress/100*360}deg, rgb(232, 240, 247) 0deg);">                </div>
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
    }

    .circular-bar::before{
        content: "";
        position: absolute;
        width: 20%;
        aspect-ratio: 1/1;
        background: #e8f0f7;
        border-radius: 50%;
        box-shadow: inset 6px 6px 10px -1px rgba(0,0,0,0.15),
        inset -6px -6px 10px -1px rgba(255,255,255,0.7);
    }
</style>
