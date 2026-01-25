<!-- JS Part -->
<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    let now = Date.now()
    const birthTimestamp = new Date('2010-01-30T02:00:00Z').getTime();
    $: age = (now - birthTimestamp) / (1000 * 60 * 60 * 24 * 365.25);

    let interval: NodeJS.Timeout;
    onMount(() => {
      interval = setInterval(() => {
        now = Date.now()
      }, 50);
    });

    onDestroy(() => {
        clearInterval(interval);
    });
</script>
<!-- HTML Part -->
<div class="item">
    <div class="box">
        <div class="actions">
            <p style="color:black; font-weight: 500; text-justify: center; text-align: center; font-size: 0.75rem;">I am currently:</p>
            <p style="color:black; font-weight: 900; text-justify: center; text-align: center; font-size: 2rem;">{age.toString().slice(0, 11)}</p>
            <p style="color:black; font-weight: 500; text-justify: center; text-align: center; font-size: 0.75rem;">years old.</p>
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
