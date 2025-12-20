<script lang="ts">
  import { authClient } from "$lib/auth/auth-client";
  const availableRoles = ["user", "admin", "locationAccess"]
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
{/await}
