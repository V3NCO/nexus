<!-- JS Part -->
<script lang="ts">
    import { authClient } from "$lib/auth/auth-client";
    import { onMount } from "svelte";
    import { MapLibre, NavigationControl, ScaleControl, GlobeControl } from 'svelte-maplibre-gl';


    //const session = authClient.useSession();
    onMount(async () => {
      const response = await fetch(`/api/location`);
    });
</script>
<!-- HTML Part -->
<div class="item">
    <div class="box">
        <MapLibre
          class="h-[55vh] min-h-[300px]"
          style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
          zoom={3.5}
          center={{ lng: 137, lat: 36 }}
        >
        </MapLibre>
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
