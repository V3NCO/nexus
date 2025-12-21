<script lang="ts">
  import { authClient } from "$lib/auth/auth-client";
  const availableRoles = ["user", "admin", "locationAccess"]
  let selectedRoles = new Map();
  const initRoles = (user: any) => {
    if (!selectedRoles.has(user.id)) {
      selectedRoles.set(user.id, user.role?.split(",") || []);
    }
    return selectedRoles.get(user.id);
  }

   const roleUpdate = async (user: any, roles: string[]) => {
    if (!user?.id) return;
    try {
      console.log(roles)
      await authClient.admin.setRole({
        userId: user.id,
        role: roles as any
      })
      location.reload()
    } catch (error) {
      console.error('Failed to update role:', error)
    }
  }
</script>

{#await authClient.admin.listUsers({
  query: {
    limit: 1000,
    sortBy: "email"
  }
})}
    <p>Loading Users...</p>
{:then response}
    {console.log(response)}
    <div class="userlist">
    {#each response.data?.users as user }
      {@const roles = initRoles(user)}
        <span class="userline">
            <p>Username: "{user.name}"</p>
            <p>Email: "{user.email}"</p>
            <p>Roles: </p>
            {#each availableRoles as role}
                <div>
                    <input type="checkbox" id="{role}-{user.id}" name="{role}" checked={roles.includes(role)} on:change={(e) => { if (e.target.checked) { roles.push(role); } else { const index = roles.indexOf(role); if (index > -1) roles.splice(index, 1); } selectedRoles.set(user.id, roles); }} />
                    <label for="{role}">{role}</label>
                </div>
            {/each}
            <button
                class="applyrole"
                on:click={() => roleUpdate(user, selectedRoles.get(user.id) || [])}
            >
                Apply Roles
            </button>
        </span>
    {/each}
    </div>
{/await}


<style>
    .userline {
        height: 5vh;
        display: inline flex;
        gap: 2vw;
        margin: 1vh;
        background: white;
        align-items: center;
        padding: 0.5vh;
        border-radius: 0.5rem;
    }

    .userlist {
        display: grid;
    }
</style>
