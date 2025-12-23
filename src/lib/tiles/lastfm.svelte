<!-- JS Part -->
<script lang="ts">
    import { onMount, onDestroy } from "svelte";

	let lastfm_res = $state<any | undefined>(undefined);
	let loading = $state<boolean>(true);
	let error
    let intervalId: ReturnType<typeof setInterval> | undefined;

    async function fetchLastfm(initial = false) {
      if (initial) {
        loading = true;
      }
      try {
        const res = await fetch(`/api/lastfm`);
        const data = await res.json();
        lastfm_res = data
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
        fetchLastfm(true);
        intervalId = setInterval(() => fetchLastfm(false), 30_000);
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
        {#if lastfm_res.nowplaying === true}
            <div class="box" style="background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url({lastfm_res.track.image[lastfm_res.track.image.length-1]["#text"]})">
                <div class="actions">
                    <p style="color:white; font-weight: 500; text-justify: center; text-align: center; font-size: 0.75rem;">Listening to...</p>
                    <p style="color:white; font-weight: 500; text-justify: center; text-align: center; font-size: 1.5rem;">{lastfm_res.track.name}</p>
                    <p style="color:white; font-weight: 500; text-justify: center; text-align: center; font-size: 1rem;">Artist: {lastfm_res.track.artist["#text"]}</p>
                    <p style="color:white; font-weight: 500; text-justify: center; text-align: center; font-size: 1rem;">Album: {lastfm_res.track.album["#text"]}</p>
                </div>
            </div>
        {:else}
            <div class="box">
                <p style="color:black; font-weight: 500; text-justify: center; text-align: center; font-size: 1.5rem;">I'm not listening to anything currently :c</p>
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
