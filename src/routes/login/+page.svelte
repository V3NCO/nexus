<script lang="ts">
  import { authClient } from "$lib/auth-client";
  const session = authClient.useSession();
</script>

<div class="main">
    <button
        class="loginbtn"
        on:click={async () => {
            await authClient.signIn.social({
                provider: "hackclub",
            });
        }}
    >
        <img src="https://assets.hackclub.com/icon-progress-rounded.svg" alt="Hackclub">
        Login with Hackclub
    </button>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
    .main {
        display: grid;
        padding-left: 25vw;
        padding-right: 25vw;
        place-items: center;
        width: 100vw;
        height: 100vh;
    }

    .loginbtn {
        width: 100%;
        background: white;
        height: 3rem;
        font-family: "Montserrat", sans-serif;
        font-weight: 700;
        font-size: 1.5rem;
        font-optical-sizing: auto;
        display: inline;
    }
</style>
