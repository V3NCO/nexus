<!-- JS Part -->
<script lang="ts">
	import { onMount } from "svelte";

	let lastfm_res = $state<any | undefined>(undefined);
	let loading = $state<boolean>(true);
	let error
    onMount(async () => {
        try {
          let res = await fetch(`/api/lastfm`);
          lastfm_res = await res.json();
          loading = false;
        } catch (err:  any) {
          error = err.message;
          loading = false;
      }
      }
    )
</script>
<!-- HTML Part -->
<div class="item">
    <div class="box">
        {#if loading}
            Loading..
        {:else}
            {console.log(lastfm_res)}
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
</style>
