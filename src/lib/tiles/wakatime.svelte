<!-- JS Part -->
<script lang="ts">
    import { onMount } from "svelte";

	let wakatime_res = $state<any | undefined>(undefined);
	let loading = $state<boolean>(true);
    onMount(async () => {
      try {
        let res = await fetch(`/api/wakatime`);
        wakatime_res = await res.json();
        loading = false;
      } catch (err:  any) {
        error = err.message;
        loading = false;
      }
    })
</script>
<!-- HTML Part -->
<div class="item">
    <div class="box">
        {#if loading}
            <div class="top">
                <h1>Wakatime</h1>
                <div class="indicator loading" title="Loading wakatime data..."></div>
            </div>
        {:else}
            <div class="top">
                <h1>Wakatime</h1>
                {#if wakatime_res?.currentlyHacking}
                    <div class="indicator hacking" title="Currently Hacking!"></div>
                {:else}
                    <div class="indicator slacking" title="Not hacking at the moment..."></div>
                {/if}
            </div>
        {/if}
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
        padding: 1.5em
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

    h1 {
        font-weight: bold;
    }

    .indicator {
        border-radius: 50%;
        aspect-ratio: 1/1;
        height: 1rem;
    }

    .loading {
        background-color: #FFDE21;
    }

    .hacking {
        background-color: #00FF00;
    }

    .slacking {
        background-color: #FF0000;
    }

    .top {
        height: 1em;
        display: inline-flex;
        justify-content: space-between;
    }
</style>
