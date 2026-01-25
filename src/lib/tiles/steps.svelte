<!-- JS Part -->
<script lang="ts">
    import { onMount } from "svelte";

    let steps_res = $state<any | undefined>(undefined);
	let loading = $state<boolean>(true);
	let error
	let steps=$state(0)
	let objective=$state(0)
	let progress: number
	let progressAngle = $state("0deg")
    onMount(async () => {
      try {
        let res = await fetch(`/api/steps`);
        steps_res = await res.json();
        steps = Number(steps_res.steps)
        objective = Number(steps_res.objective)
        progress = steps / objective
        progressAngle = `${progress * 360}deg`;
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
        <div
            class="circular-bar"
            style="background: conic-gradient(#f1d7c5 {progressAngle}, rgb(232, 240, 247) 0deg);">
                <p><strong>{steps}<br/>/{objective}<br/>steps</strong></p>
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
        padding-left: 0vmax;
        padding-right: 0vmax;
        align-items: center;
        justify-content: center;
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

    .circular-bar{
        width: 60%;
        aspect-ratio: 1/1;
        background: conic-gradient(#4285f4 1.5deg, #e8f0f7 0deg);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 6px 6px 10px -1px rgba(0,0,0,0.15),
        -6px -6px 10px -1px rgba(255,255,255,0.7);
        position: relative;
    }

    .circular-bar::before{
        content: "";
        position: absolute;
        width: 60%;
        aspect-ratio: 1/1;
        background: #e8f0f7;
        border-radius: 50%;
        box-shadow: inset 6px 6px 10px -1px rgba(0,0,0,0.15),
        inset -6px -6px 10px -1px rgba(255,255,255,0.7);
    }

    .circular-bar p {
           position: relative;
           text-align: center;
           z-index: 1;
    }
</style>
