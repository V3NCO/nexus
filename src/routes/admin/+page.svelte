<script lang="ts">
  import { authClient } from "$lib/auth/auth-client";
  import { onMount } from "svelte";

  const availableRoles = ["user", "admin", "locationAccess"]
  let selectedRoles = new Map();
  const initRoles = (user: any) => {
    if (!selectedRoles.has(user.id)) {
      const raw = user.role ?? '';
      const clean = raw.split(',').map((r: string) => r.trim()).filter((r: string) => r.length > 0);
      selectedRoles.set(user.id, clean);
    }
    return selectedRoles.get(user.id);
  }

  const roleUpdate = async (user: any, roles: string[]) => {
    if (!user?.id) return;
    try {
      const cleanroles = (roles ?? []).map((r) => r.trim()).filter((r: string) => r.length > 0);
      await authClient.admin.setRole({
        userId: user.id,
        role: cleanroles as any
      });
      location.reload();
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  }

  let config = $state<Record<string, string>>({});
  let locations = $state<any[]>([]);
  let newLocation = $state({ id: '', hassid: '', emoji: '', label: '' });

  const fetchData = async () => {
    try {
      const [configRes, locationsRes] = await Promise.all([
        fetch('/api/config'),
        fetch('/api/locations')
      ]);
      config = await configRes.json();
      locations = await locationsRes.json();
    } catch (e) {
      console.error('Failed to fetch data', e);
    }
  };

  onMount(fetchData);

  const saveConfig = async () => {
    try {
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      alert('Saved');
    } catch (e) {
      alert('Error');
    }
  };

  const addLocation = async () => {
    try {
      const res = await fetch('/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLocation)
      });
      if (res.ok) {
        newLocation = { id: '', hassid: '', emoji: '', label: '' };
        fetchData();
      }
    } catch (e) {
      alert('Error');
    }
  };

  const updateLocation = async (loc: any) => {
    try {
      await fetch(`/api/location/${loc.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loc)
      });
      alert('Updated');
    } catch (e) {
      alert('Error');
    }
  };

  const deleteLocation = async (id: string) => {
    if (!confirm('Delete?')) return;
    try {
      await fetch(`/api/location/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (e) {
      alert('Error');
    }
  };
</script>

<div style="padding: 20px;">
  <h2>Config</h2>
  <div class="userlist">
    {#each Object.keys(config) as key}
      <div class="userline">
        <p>{key}:</p>
        <input type="text" bind:value={config[key]} />
      </div>
    {/each}
    <button onclick={saveConfig} style="width: fit-content; margin: 1vh; background-color: white;">Save Config</button>
  </div>

  <h2>Locations</h2>
  <div class="userlist">
    {#each locations as loc}
      <div class="userline">
        <input type="text" bind:value={loc.label} placeholder="Label" />
        <input type="text" bind:value={loc.hassid} placeholder="HASS ID" />
        <input type="text" bind:value={loc.emoji} placeholder="Emoji" style="width: 40px" />
        <button onclick={() => updateLocation(loc)}>Update</button>
        <button onclick={() => deleteLocation(loc.id)}>Delete</button>
      </div>
    {/each}
    <div class="userline" style="background: #eee;">
      <input type="text" bind:value={newLocation.id} placeholder="ID" />
      <input type="text" bind:value={newLocation.label} placeholder="Label" />
      <input type="text" bind:value={newLocation.hassid} placeholder="HASS ID" />
      <input type="text" bind:value={newLocation.emoji} placeholder="Emoji" style="width: 40px" />
      <button onclick={addLocation}>Add</button>
    </div>
  </div>

  <h2>Users</h2>
  {#await authClient.admin.listUsers({ query: { limit: 1000, sortBy: "email" } })}
    <p>Loading Users...</p>
  {:then response}
    <div class="userlist">
      {#each response.data?.users ?? [] as user}
        {@const roles = initRoles(user)}
        <span class="userline">
          <p>"{user.name}" ({user.email})</p>
          {#each availableRoles as role}
            <div>
              <input
                type="checkbox"
                id="{role}-{user.id}"
                checked={roles.includes(role)}
                onchange={(e) => {
                  const target = e.target as HTMLInputElement;
                  if (target.checked) { roles.push(role); }
                  else { const index = roles.indexOf(role); if (index > -1) roles.splice(index, 1); }
                  selectedRoles.set(user.id, roles);
                }}
              />
              <label for="{role}-{user.id}">{role}</label>
            </div>
          {/each}
          <button onclick={() => roleUpdate(user, selectedRoles.get(user.id) || [])}>Apply</button>
        </span>
      {/each}
    </div>
  {/await}
</div>

<style>
    .userline {
        height: 5vh;
        display: flex;
        gap: 2vw;
        margin: 1vh;
        background: white;
        align-items: center;
        padding: 0.5vh 1vh;
        border-radius: 0.5rem;
    }

    h2 {background-color: white;}


    .userlist {
        display: grid;
    }

    input[type="text"] {
        padding: 2px 5px;
    }
</style>
