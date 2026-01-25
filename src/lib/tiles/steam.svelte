<!-- JS Part -->
<script lang="ts">
    import { onMount, onDestroy } from "svelte";

	let steam_res = $state<any | undefined>(undefined);
	let loading = $state<boolean>(true);
	let error
    let intervalId: ReturnType<typeof setInterval> | undefined;

    async function fetchSteam(initial = false) {
      if (initial) {
        loading = true;
      }
      try {
        const res = await fetch(`/api/steam `);
        const data = await res.json();
        steam_res = data
        error = undefined;
      } catch (err: any) {
        error = err.message ?? String(err);
      } finally {
        if (initial) {
          loading = false;
        }
      }
    }

    onMount(() => {
        fetchSteam(true);
        intervalId = setInterval(() => fetchSteam(false), 30_000);
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    });

    onDestroy(() => {
        if (intervalId) clearInterval(intervalId);
    });
</script>
<!-- HTML Part -->
<div class="item">
    {#if loading}
        <div class="box">
            Loading..
        </div>
    {:else}
        {#if steam_res.nowplaying === true}
            <div class="box" style="background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url({steam_res.bgimage}); background-size: cover; background-position: top;">
                <div class="actions">
                    <p style="color:white; font-weight: 500; text-justify: center; text-align: center; font-size: 0.75rem;">{steam_res.username} is currently playing...</p>
                    <p style="color:white; font-weight: 500; text-justify: center; text-align: center; font-size: 1.5rem;">{steam_res.gamename}</p>
                </div>
            </div>
        {:else}
            <div class="box">
                <div class="actions">
                    <p style="color:gray; font-weight: 500; text-justify: center; text-align: center; font-size: 0.75rem; margin-bottom: 1rem;">{steam_res.username} isn't playing anything right now</p>
                    <svg fill="gray" width="9rem" height="9rem" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.102 12.129c0-0 0-0 0-0.001 0-1.564 1.268-2.831 2.831-2.831s2.831 1.268 2.831 2.831c0 1.564-1.267 2.831-2.831 2.831-0 0-0 0-0.001 0h0c-0 0-0 0-0.001 0-1.563 0-2.83-1.267-2.83-2.83 0-0 0-0 0-0.001v0zM24.691 12.135c0-2.081-1.687-3.768-3.768-3.768s-3.768 1.687-3.768 3.768c0 2.081 1.687 3.768 3.768 3.768v0c2.080-0.003 3.765-1.688 3.768-3.767v-0zM10.427 23.76l-1.841-0.762c0.524 1.078 1.611 1.808 2.868 1.808 1.317 0 2.448-0.801 2.93-1.943l0.008-0.021c0.155-0.362 0.246-0.784 0.246-1.226 0-1.757-1.424-3.181-3.181-3.181-0.405 0-0.792 0.076-1.148 0.213l0.022-0.007 1.903 0.787c0.852 0.364 1.439 1.196 1.439 2.164 0 1.296-1.051 2.347-2.347 2.347-0.324 0-0.632-0.066-0.913-0.184l0.015 0.006zM15.974 1.004c-7.857 0.001-14.301 6.046-14.938 13.738l-0.004 0.054 8.038 3.322c0.668-0.462 1.495-0.737 2.387-0.737 0.001 0 0.002 0 0.002 0h-0c0.079 0 0.156 0.005 0.235 0.008l3.575-5.176v-0.074c0.003-3.12 2.533-5.648 5.653-5.648 3.122 0 5.653 2.531 5.653 5.653s-2.531 5.653-5.653 5.653h-0.131l-5.094 3.638c0 0.065 0.005 0.131 0.005 0.199 0 0.001 0 0.002 0 0.003 0 2.342-1.899 4.241-4.241 4.241-2.047 0-3.756-1.451-4.153-3.38l-0.005-0.027-5.755-2.383c1.841 6.345 7.601 10.905 14.425 10.905 8.281 0 14.994-6.713 14.994-14.994s-6.713-14.994-14.994-14.994c-0 0-0.001 0-0.001 0h0z"/>
                    </svg>
                </div>
            </div>
        {/if}
    {/if}
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
