<!-- JS Part -->
<script lang="ts">
  import Git from "$lib/tiles/git.svelte"
  import UserWidget from "$lib/tiles/user.svelte"
  import LocationWidget from "$lib/tiles/location.svelte"
  import LastFmWidget from "$lib/tiles/lastfm.svelte"
  import TimeWidget from "$lib/tiles/time.svelte"
  import LastMsgWidget from "$lib/tiles/slacklastmsg.svelte"

  import { authClient } from "$lib/auth/auth-client";
  const session = authClient.useSession();
  // import TemplateSmall from "$lib/tiles/template_small.svelte"
  // import TemplateWide from "$lib/tiles/template_wide.svelte"
  let canReadLocation = $state<Boolean | undefined>(undefined)
  let loading = $state(true)
  $effect(() => {
    if (($session as any).data) {
      (async () => {
        const canReadLocationLocal = await authClient.admin.hasPermission({
            userId: ($session as any).data?.user.id,
            permission: { "location": ["read"] } as any
        });
        canReadLocation = canReadLocationLocal.data?.success
        console.log(canReadLocation)
        loading = false;
      })();
    } else {
      console.log("Nopee")
      canReadLocation = false
      loading = false;
    }
  });
</script>

<!-- HTML Part -->
<div class="mainermain">
    <div class="main">
        <div class="item item-wide"><Git/></div>
        {#if loading}<p>Checking permissions...</p>{:else}{#if canReadLocation} <div class="item"><LocationWidget/></div> {/if}{/if}
        <div class="item"><UserWidget/></div>
        <div class="item"><LastFmWidget/></div>
        <div class="item"><LastMsgWidget/></div>
        <div class="item"><TimeWidget/></div>
        <!-- <div class="item"><TemplateSmall/></div> -->
        <!-- <div class="item item-wide"><TemplateWide/></div> -->
    </div>
</div>
<!-- CSS Part -->
<style>
    .main {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
      grid-auto-rows: 20vw;
      grid-auto-flow: dense;
      width: 100%;
      min-height: 100%;
    }
    .mainermain {
        margin: 20px;
    }
    .item {
        position: relative;
    }

    .item-wide {
        grid-column: span 2;
    }

    @media (max-width: 800px) {
        .main {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-auto-rows: 33vw;
            grid-auto-flow: dense;
            width: 100%;
            min-height: 100%;
        }
    }

    @media (max-width: 450px) {
        .main {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-auto-rows: 50vw;
            grid-auto-flow: dense;
            width: 100%;
            min-height: 100%;
        }
    }
</style>
