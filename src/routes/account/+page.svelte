<script lang="ts">
  import { authClient } from "$lib/auth/auth-client";

  const session = authClient.useSession();
  let oldpassword:string
  let newpassword: string
</script>

<div class="container">
    <div class="main">
    {#if $session.data}
        <input class="loginput" type="password" bind:value={oldpassword} placeholder="Current Password" />
        <input class="loginput" type="password" bind:value={newpassword} placeholder="New Password" />
        <button
            class="loginbtn"
            onclick={async () => {
              await authClient.changePassword({
                currentPassword: oldpassword,
                newPassword: newpassword
            }, {onError:(ctx) => {
              alert(ctx.error.message)
            }});
          }}
        >
            Change Password
        </button>
        <hr/>
        <button
            class="loginbtn"
            style="outline: 0.5rem, solid, red;"
            onclick={async () => {
              await authClient.deleteUser({}, {onError:(ctx) => {
            }});
          }}
        >
            Delete Account!
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
