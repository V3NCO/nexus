<script lang="ts">
	import { page } from '$app/state';
</script>
<div class="container">
    <p>{page.status} {page.error?.message}</p>

	{#if page.status == 404}
	    <img src="/404ArtByMagentaSnail.png" alt="i forgor | By @MagentaSnail on tumblr check them out!"/>
		<p>Art by Magenta Snail! Go check it out!</p>
	{:else}
	    <img src="/ErrorArtByMagentaSnail.png" alt="AAAA | By @MagentaSnail on tumblr check them out!">
		<p>Art by Magenta Snail! Go check it out!</p>
	{/if}
</div>

<style>
    p {
        background-color: white;
        width: fit-content;
        height: 5rem;
        padding: 1rem;
        font-size: 2rem;
        font-weight: 800;
        border-radius: 0.5rem;
    }
    img {
        width: 30rem;
        height: 30rem;
    }
    .container {
        display: grid;
        place-items: center;
        height: 100vh;
    }
</style>
