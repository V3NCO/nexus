<!-- JS Part -->
<script lang="ts">

    import { MapLibre, Marker } from 'svelte-maplibre-gl';
    import { LOCATIONS, type Location } from '$lib/config';
    import { authClient } from "$lib/auth/auth-client";

    type LocationData = Location & {
      lnglat: { lng: number; lat: number };
    };

    let locations = $state<LocationData[]>([]);
    const session = authClient.useSession();

    const fetchLocations = async () => {
      for (const loc of LOCATIONS) {
        const response = await fetch(`/api/location/${loc.id}`);
        const data = await response.json();
        locations.push({ ...loc, lnglat: { lng: data.lng, lat: data.lat } });
      }
    };

    $effect(() => {
      if (session) {
        fetchLocations();
      }
    });
</script>

<!-- HTML Part -->
<div class="item">
    <div class="box">
        <MapLibre
            class="h-[55vh] min-h-[300px]"
            style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
            zoom={12}
            center={locations[0]?.lnglat || {lng: 0, lat: 0}}
        >
            {#each locations as location}
                <Marker lnglat={location.lnglat}>
                    {#snippet content()}
                        <div class="text-center leading-none">
                            <div class="text-3xl">{location.emoji}</div>
                        </div>
                    {/snippet}
                </Marker>
            {/each}
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
