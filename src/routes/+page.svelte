<!-- JS Part -->
<script>
  import Git from "$lib/tiles/git.svelte"
</script>

<!-- HTML Part -->
<div class="main">
    <div class="item item-wide"><Git/></div>
    <div class="item item-wide"><Git/></div>
    <div class="item"><Git/></div>
    <div class="item item-wide"><Git/></div>
    <div class="item item-wide"><Git/></div>
    <div class="item item-wide"><Git/></div>

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

    .item {
        position: relative;
    }

    .item-wide {
        grid-column: span 2;
    }

    @media (max-width: 400px) {

        .main {
            grid-template-columns: 1fr, 1fr;
        }
    }
</style>
