<!-- JS Part -->
<script>
    const fetchGitHub = async () => {
      const response = await fetch(`/api/github/lastCommit`);
      return response.json();
    };
</script>
<!-- HTML Part -->
<div class="git item-wide">
    <div class="box">
        <section>
            <div class="item last-commit">
                {#await fetchGitHub()}
                    <p>Waiting for repo</p>
                    {:then response}
                    <a href="{response.author.html_url}">
                        <div style="display: flex; align-items: center; gap: 4px;">
                            <img src={response.author.avatar_url} alt="{response.author.login}" width="20" height="20" style="border-radius: 20px;">
                            <span style="font-weight: 700;">{response.commit.author.name}</span>
                            <span></span>
                        </div>
                    </a>
                    {/await}
            </div>
            <div class="item activty-graph">
                <p>Help</p>
            </div>
        </section>
    </div>
</div>

<!-- CSS Part -->
<style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

    .box {
        background-color: #CCCCCC;
        border-radius: 50px;
        position: absolute;
        inset: 10px;
        font-family: "Montserrat", sans-serif;
        font-optical-sizing: auto;
    }

    .item {
      flex-basis: 0;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 2em;
    }

    section {
        display: flex
    }

</style>
