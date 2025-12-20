<!-- JS Part -->
<script lang="ts">
	import { goto } from "$app/navigation";
    import { authClient } from "$lib/auth/auth-client";
    const session = authClient.useSession();
</script>
<!-- HTML Part -->
<div class="item">
    <div class="box">
        {#if $session.data}
            <div class="actions">
                <p class="logstatus">Logged In!</p>
                <p style="font-weight: 600;">Name: {$session.data.user.name}</p>
                <p style="font-weight: 600;">Email: {$session.data.user.email}</p>
                <button
                    class="action logout"
                    on:click={
                      async () => {
                        await authClient.signOut();
                      }
                    }
                >
                    Log Out
                </button>
            </div>
        {:else}
            <div class="actions">
                <p class="logstatus">Logged Out!</p>
                <button
                    class="action login"
                    on:click={() => goto("/login")}
                >
                    Log In
                </button>
                <button
                    class="action signup"
                    on:click={() => goto("/signup")}
                >
                    Sign Up
                </button>
            </div>
        {/if}
    </div>
</div>

<!-- CSS Part -->
<style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

    .box {
        background-color: #EFEFEF;
        border-radius: 2rem;
        position: absolute;
        inset: 10px;
        font-family: "Montserrat", sans-serif;
        font-optical-sizing: auto;
        overflow: hidden;
        display: flex;
        flex-direction: column;
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

    .actions {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 1rem;
        height: 100%
    }

    .logout {
        outline: 0.25rem solid #FF746C;
        border-bottom-right-radius: 1rem;
        border-bottom-left-radius: 1rem;
        border-top-right-radius: 0.2rem;
        border-top-left-radius: 0.2rem;
        height: 2.5rem;
        font-size: 1.25rem;
        font-weight: 600;
    }

    .login {
        outline: 0.25rem solid #77dd77;
        border-top-right-radius: 1rem;
        border-top-left-radius: 1rem;
        border-bottom-right-radius: 0.2rem;
        border-bottom-left-radius: 0.2rem;
        margin-bottom: 0.5rem;
        margin-top: 0.5rem;
        height: 100%;
        font-size: 1.25rem;
        font-weight: 600;
    }

    .signup {
        outline: 0.25rem solid #a2bffe;
        border-bottom-right-radius: 1rem;
        border-bottom-left-radius: 1rem;
        border-top-right-radius: 0.2rem;
        border-top-left-radius: 0.2rem;
        margin-top: 0.5rem;
        height: 100%;
        font-size: 1.25rem;
        font-weight: 600;
    }

    .logstatus {
        text-align: center;
    }

    .action:hover {
        background-color: #CCCCCC;
        height: 1fr;
    }
</style>
