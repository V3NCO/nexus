<!-- JS Part -->
<script lang="ts">
    import { onMount } from "svelte";
    let timezone = $state<string | undefined>(undefined);
    let time = $state(new Date());

    let timeString = $derived.by(() => {
      if (!timezone) return "--:--:--";
      try {
        return new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: timezone,
        }).format(time);
      } catch (e) {
        return time.toLocaleTimeString();
      }
    });

    onMount(async () => {
      try {
        let res = await fetch("/api/timezone");
        let jsonres = await res.json();
        timezone = jsonres;
      } catch (e) {
        console.error("Failed to fetch timezone", e);
        timezone = "Europe/Paris";
      }
      const interval = setInterval(() => {
        time = new Date();
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    });

</script>
<!-- HTML Part -->
<div class="item">
    <div class="box">
        <div class="actions">
            <p style="color:black; font-weight: 500; text-justify: center; text-align: center; font-size: 0.75rem;">My current time is:</p>
            <p style="color:black; font-weight: 900; text-justify: center; text-align: center; font-size: 3rem;">{timeString}</p>
        </div>
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

    .actions {
        display: flex;
        flex-direction: column;
        padding: 1rem;
        height: 100%;
        justify-content: center;
        align-items: center;
        text-align: center;
    }
</style>
