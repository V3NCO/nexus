<!-- JS Part -->
<script lang="ts">
    import { authClient } from "$lib/auth/auth-client";
    import { onMount } from "svelte";
    //const session = authClient.useSession();
    onMount(async () => {
      const response = await fetch(`/api/location`);
      console.log(await response.json());
    });
</script>
<!-- HTML Part -->
<div class="item">
    <div class="box">

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
