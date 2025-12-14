<script lang="ts">
  import { authClient } from "$lib/auth-client";
  const session = authClient.useSession();
</script>

<div class="main">
    <button
        on:click={async () => {
            await authClient.signIn.social({
                provider: "hackclub",
            });
        }}
    >
        Login with Hackclub
    </button>
</div>

<style>
</style>
