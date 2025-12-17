<!-- JS Part -->
<script lang="ts">
    import { authClient } from "$lib/auth/auth-client";
    import { onMount } from "svelte";
    import { MapLibre, NavigationControl, ScaleControl, GlobeControl, Marker } from 'svelte-maplibre-gl';


    //const session = authClient.useSession();
    const fetchLocation = async () => {
      const response = await fetch(`/api/location`);
      let loc = await response.json();
      let lnglat: any = $state({lng: loc.lng, lat: loc.lat})
      return lnglat
    };

</script>
<!-- HTML Part -->
<div class="item">
    <div class="box">
        {#await fetchLocation()}
            <p>Loading...</p>
        {:then lnglat}
            <MapLibre
                class="h-[55vh] min-h-[300px]"
                style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
                zoom={3.5}
                center={lnglat}
            >
                <Marker bind:lnglat draggable>
                    {#snippet content()}
                        <div class="text-center leading-none">
                            <div class="text-3xl">🐶</div>
                        </div>
                    {/snippet}
                </Marker>
            </MapLibre>
        {/await}

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
