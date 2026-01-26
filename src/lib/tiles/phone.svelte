<!-- JS Part -->
<script lang="ts">
    import { onMount } from "svelte";
    import { Canvas, T } from '@threlte/core'
    import { ContactShadows, Float, OrbitControls } from '@threlte/extras'

    import P8P from "../components/models/P8P.svelte";
    import Nothing3aCommunity from "$lib/components/models/Nothing3aCommunity.svelte";

    import Battery from "svelte-material-icons/Battery.svelte";
    import Battery60 from "svelte-material-icons/Battery60.svelte";
    import BatteryCharging from "svelte-material-icons/BatteryCharging.svelte";
    import MinusCircle from "svelte-material-icons/MinusCircle.svelte";
    import AccessPointNetwork from "svelte-material-icons/AccessPointNetwork.svelte";
    import Cellphone from "svelte-material-icons/Cellphone.svelte";
    import Time from "svelte-time";
	import { DirectionalLight } from "three";


	let phone_res = $state<any | undefined>(undefined);
	let loading = $state<boolean>(true);
	let error
    onMount(async () => {
      try {
        let res = await fetch(`/api/phone`);
        phone_res = await res.json();
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
        <section>
            <div class="item left">
                <Canvas autoRender={true}>
                    <T.PerspectiveCamera
                        makeDefault
                        position={[0, 0, 10]}
                        fov={60}
                    >
                        <OrbitControls
                            autoRotate
                            minPolarAngle={1.5}
                            maxPolarAngle={1.5}
                            enableZoom={false}
                            enableDamping
                        />
                    </T.PerspectiveCamera>
                    {#if phone_res?.model == "P8P"}
                        <T.DirectionalLight
                            position={[0, -7, 0]}
                            intensity={2}
                        />
                    {:else if phone_res?.model == "Nothing3aCommunity"}
                        <T.DirectionalLight
                            position={[3, 10, 10]}
                            intensity={1}
                        />
                    {/if}
                    <T.AmbientLight intensity={0.2} />

                    <Float
                        floatIntensity={1}
                        floatingRange={[-0.5, 0.5]}
                    >
                        {#if phone_res?.model == "P8P"}
                            <P8P rotation={[-0.60, 0.3, 0.6]} scale={60} position={[2, -3, 0]} />
                        {:else if phone_res?.model == "Nothing3aCommunity"}
                            <Nothing3aCommunity rotation={[-0.60, 0.3, 0.6]} scale={0.65} position={[2, -3, 0]} />
                        {/if}
                    </Float>


                </Canvas>
            </div>
            <div class="item right">
                {#if loading}
                    <div class="top">
                        <h1>Phone</h1>
                        <div class="indicator loading" title="Loading phone data..."></div>
                    </div>
                {:else}
                    <div class="top">
                        <h1>Phone</h1>
                        {#if phone_res?.tailscale.enabled}
                            {#if phone_res?.tailscale.connected}
                                <div class="indicator hacking" title="Connected to Tailscale!"></div>
                            {:else}
                                <div class="indicator slacking" title="Not connected to Tailscale..."></div>
                            {/if}
                        {/if}
                    </div>
                    <hr/>
                    {#if phone_res?.battery.state.state == "charging"} <!-- Charging, discharging, full, not_charging -->
                        <span class="statusline"><BatteryCharging/> <strong style="margin-left: 0.2rem;">Battery:</strong> <p style="padding-left: 0.5ch;">{phone_res?.battery.level.state}% -  </p><Time relative timestamp={phone_res?.battery.level.time} style="padding-left:0.5rem; ; color: #59636e; font-weight: 300; font-size: 12px;"/></span>
                    {:else if phone_res?.battery.state.state == "discharging"}
                        <span class="statusline"><Battery60/> <strong style="margin-left: 0.2rem;">Battery:</strong> <p style="padding-left: 0.5ch;">{phone_res?.battery.level.state}% - </p><Time relative timestamp={phone_res?.battery.level.time} style="padding-left:0.5rem; ; color: #59636e; font-weight: 300; font-size: 12px;"/></span>
                    {:else if phone_res?.battery.state.state == "full"}
                        <span class="statusline"><Battery/> <strong style="margin-left: 0.2rem;">Battery:</strong> <p style="padding-left: 0.5ch;">{phone_res?.battery.level.state}% -  </p><Time relative timestamp={phone_res?.battery.level.time} style="padding-left:0.5rem; ; color: #59636e; font-weight: 300; font-size: 12px;"/></span>
                    {:else}
                        <span class="statusline"><Battery60/> <strong style="margin-left: 0.2rem;">Battery:</strong> <p style="padding-left: 0.5ch;">{phone_res?.battery.level.state}% -  </p><Time relative timestamp={phone_res?.battery.level.time} style="padding-left:0.5rem; ; color: #59636e; font-weight: 300; font-size: 12px;"/></span>
                    {/if}
                    <span class="statusline"><MinusCircle/> <strong style="margin-left: 0.2rem;">DND:</strong> <p style="padding-left: 0.5ch;">{phone_res?.dnd.state} -  </p><Time relative timestamp={phone_res?.dnd.time} style="padding-left:0.5rem; ; color: #59636e; font-weight: 300; font-size: 12px;"/></span>
                    <span class="statusline"><AccessPointNetwork/> <strong style="margin-left: 0.2rem;">Hotspot:</strong> <p style="padding-left: 0.5ch;">{phone_res?.hotspot.state} -  </p><Time relative timestamp={phone_res?.hotspot.time} style="padding-left:0.5rem; ; color: #59636e; font-weight: 300; font-size: 12px;"/></span>
                    <span class="statusline"><Cellphone/> <strong style="margin-left: 0.2rem;">Using:</strong> <p style="padding-left: 0.5ch;">{!phone_res?.locked.state} -  </p><Time relative timestamp={phone_res?.locked.time} style="padding-left:0.5rem; ; color: #59636e; font-weight: 300; font-size: 12px;"/></span>
                {/if}
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
    }

    section {
        display: flex;
        flex: 1;
        min-height: 0;
        overflow: scroll;
    }

    .right {
        padding-left: 2vmax;
        padding-right: 1vmax;
        padding-top: 1.5em;
        padding-bottom: 2em;
    }
    .left {
        height: 100%
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
        margin-bottom: 0.7em;
    }

    hr {
        color: lightgray;
        margin-bottom: 0.3em;
    }

    .statusline {
        margin-top: 0.5em;
        height: 1em;
        display: inline-flex;
        align-items: center;
    }
</style>
