<script lang="ts">
  import { authClient } from "$lib/auth/auth-client";
  const session = authClient.useSession();
  import { goto } from '$app/navigation';

  let email: string
  let password: string
  $: if ($session.data) goto('/');
</script>

<div class="container">
    <div class="main">
    {#if !$session.data}
        <input class="loginput" type="email" bind:value={email} placeholder="johndoe@example.com" />
        <input class="loginput" type="password" bind:value={password} placeholder="Password1234!" />
        <button
            class="loginbtn"
            onclick={async () => {
              await authClient.signIn.email({
                email: email,
                password: password
            }, {onError:(ctx) => {
              alert(ctx.error.message)
            }});
          }}
        >
              Login
        </button>
        <hr/>
        <button
            class="loginbtn"
            onclick={async () => {
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
            onclick={async () => {
              await authClient.signIn.social({
                  provider: "discord",
              });
          }}
        >
            <img class="icon" src="/discord-logo.svg" alt="Hackclub">
                Login with Discord
        </button>
    {/if}
    </div>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 100vw;
        min-height: 100vh;
    }
    .main {
        display: grid;
        place-items: center;
        width: 50vw;
        align-content: space-between;
        gap: 1rem;

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

    .loginput {
        width: 100%;
        background: white;
        height: 3rem;
        font-family: "Montserrat", sans-serif;
        font-weight: 500;
        font-size: 1.2rem;
        font-optical-sizing: auto;
        border-radius: 0.5em;
        padding: 1rem;
        outline: 0.1rem solid #000000;
    }

    .icon {
        width: 2rem;
        height: 2rem;
        margin-right: 0.5rem;
    }
</style>
