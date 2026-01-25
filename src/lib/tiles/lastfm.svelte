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
                <div class="actions">
                    <p style="color:gray; font-weight: 500; text-justify: center; text-align: center; font-size: 0.75rem; margin-bottom: 1rem;">I'm not listening to anything right now</p>
                    <svg fill="gray" width="9rem" height="9rem" xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512"><path d="M256 0c141.385 0 256 114.615 256 256S397.385 512 256 512 0 397.385 0 256 114.615 0 256 0zm-17.22 317.056l-10.725-29.064s-17.374 19.388-43.412 19.388c-23.092 0-39.444-20.057-39.444-52.135 0-41.08 20.728-55.778 41.081-55.778 29.392 0 38.744 19.037 46.787 43.421l10.725 33.387c10.72 32.418 30.781 58.465 88.546 58.465 41.426 0 69.53-12.711 69.53-46.105 0-27.059-15.388-41.08-44.112-47.803l-21.364-4.669c-14.705-3.354-19.039-9.35-19.039-19.388 0-11.344 9.008-18.07 23.713-18.07 16.06 0 24.724 6.035 26.033 20.406l33.391-3.99c-2.681-30.093-23.41-42.454-57.486-42.454-30.092 0-59.488 11.344-59.488 47.81 0 22.736 11.048 37.085 38.748 43.761l22.737 5.357c17.024 3.996 22.732 11.049 22.732 20.736 0 12.362-12.023 17.374-34.754 17.374-33.737 0-47.811-17.724-55.786-42.104l-11.048-33.385c-13.965-43.475-36.358-59.497-80.792-59.497-49.13 0-75.221 31.055-75.221 83.877 0 50.766 26.038 78.177 72.884 78.177 37.722 0 55.779-17.724 55.779-17.724l-.015.005v.002z"/></svg>
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
