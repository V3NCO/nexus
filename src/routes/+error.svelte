<script lang="ts">
	import { page } from '$app/state';
</script>
<div style="font-size: 10em">
    <p>{page.status} {page.error.message}</p>

	{#if page.status == 404}
	    <img src="/404ArtByMagentaSnail.png" alt="i forgor | By @MagentaSnail on tumblr check them out!"/>
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
    }
    div {
        display: flex;
        justify-content: center;

    }
</style>
