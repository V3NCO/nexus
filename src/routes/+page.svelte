<!-- JS Part -->
<script lang="ts">
  import Git from "$lib/tiles/git.svelte"
  import TimeWidget from "$lib/tiles/time.svelte"
  // import TemplateSmall from "$lib/tiles/template_small.svelte"
  // import TemplateWide from "$lib/tiles/template_wide.svelte"
</script>

<!-- HTML Part -->
<div class="mainermain">
    <div class="main">
        <div class="item item-wide"><Git/></div>
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
