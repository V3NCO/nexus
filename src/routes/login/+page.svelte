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
        <img class="icon" src="https://assets.hackclub.com/icon-progress-rounded.svg" alt="Hackclub">
        Login with Hack Club
    </button>
    <button
        class="loginbtn"
        on:click={async () => {
            await authClient.signIn.social({
                provider: "discord",
            });
        }}
    >
        <img class="icon" src="/discord-logo.svg" alt="Hackclub">
        Login with Discord
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
        display: inline-flex;
        justify-content: center;
        align-items: center;
        border-radius: 0.5em;
        cursor:pointer;
    }
    .loginbtn:hover {
        background: #EAEAEA;
    }

    .icon {
        width: 2rem;
        height: 2rem;
        margin-right: 0.5rem;
    }
</style>
