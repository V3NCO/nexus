<!-- JS Part -->
<script lang="ts">
    import { onMount } from "svelte";
    import Time from "svelte-time";

	let slack_res = $state<any | undefined>(undefined);
	let loading = $state<boolean>(true);
	let error
    onMount(async () => {
      try {
        let res = await fetch(`/api/slack/lastmessage`);
        slack_res = await res.json();
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
            <p>Loading Slack...</p>
        {:else}
            <a href="{slack_res.message.permalink}">
                <div style="display: flex; align-items: center; gap: 4px;">
                    <img src={slack_res.user.profile.image_24} alt="{slack_res.user.profile.display_name_normalized}" width="20" height="20" style="border-radius: 20px;">
                    <span style="font-weight: 700;">{slack_res.user.profile.display_name_normalized}</span>
                    <span><Time relative timestamp={Number(slack_res.message.ts) * 1000} style="color: #59636e; font-weight: 300; font-size: 12px;"/></span>
                </div>
                <div style="display: flex; align-items: center; gap: 4px;">
                    <p  style="color: #59636e; font-weight: 300; font-size: 14px;">said in #{slack_res.message.channel.name}</p>
                </div>
                <div style="display: flex; align-items: center; gap: 4px;">
                    <p  style="color: #59636e; font-weight: 400; font-size: 16px;">{slack_res.message.text}</p>
                </div>
            </a>
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
        padding: 1rem;
        overflow: scroll;
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
