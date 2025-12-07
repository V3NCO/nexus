<!-- JS Part -->
<script lang="ts">
    import Time from "svelte-time";

    const fetchGitHub = async () => {
      const response = await fetch(`/api/github/lastCommit`);
      return response.json();
    };

    async function TrimCommitMessage(({ message }: string): string => {
      return "str";
	});
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
                            <span style="font-weight: 450;"></span>
                            <span><Time relative timestamp="{response.commit.committer.date}" style="color: #59636e; font-weight: 300; font-size: 12px;"/></span>
                        </div>
                    </a>
                    <a style="font-weight: 700; font-size: 16px;" href="{response.html_url}">{response.commit.message}</a>
                    {/await}
            </div>
            <div class="item activity-graph">
                <p>Help</p>
            </div>
        </section>
    </div>
</div>

<!-- CSS Part -->
<style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

    .box {
        background-color: #EFEFEF;
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
      padding-top: 2em;
      padding-bottom: 2em;
    }
    .last-commit {
        padding-left: 2em;
        padding-right: 0.5em;
    }
    .activity-graph {
        padding-left: 0.5em;
        padding-right: 2em;
    }

    section {
        display: flex
    }

</style>
