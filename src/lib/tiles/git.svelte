<!-- JS Part -->
<script>
    const fetchGitHub = async () => {
      const response = await fetch(`/api/github/lastCommit`);
      console.log(response.json())
      return await response.json();
    };
</script>
<!-- HTML Part -->
<div class="git item-wide">
    <div class="box">
        <div class="last-commit">
            {#await fetchGitHub()}
                <p>Waiting for repo</p>
            {:then response}
                <p>{response}</p>
            {/await}
        </div>
        <div class="activty-graph">
        </div>
    </div>
</div>

<!-- CSS Part -->
<style>
.box {
    background-color: #CCCCCC;
    border-radius: 5px;
    position: absolute;
    inset: 10px;
}


</style>
