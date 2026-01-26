# Credits for models!
Pixel 8 Pro - https://pixel.withgoogle.com/Pixel_8_Pro/get-to-know-your-hardware?hl=en&country=US&dark=0
Phone (3a) Community Edition - https://fr.nothing.tech/products/phone-3a-community-edition?Capacity=12%2B256+GB -> https://cdn.sanity.io/files/gtd4w1cq/production/bfc24d0865c36bcd6a8563a193f9c16954434d2c.glb
(see https://nothing.community/d/29511-phone-3a-3d-model-glb, the principle is similar on the 3a community edition page)


# Guide to add a phone model
1. Add the .glb file in here (static/models)
2. Run `npx @threlte/gltf@3.0.1 nexus/static/models/<model>.glb --root /models/ --types --printwidth 120 --precision 2`
3. Go into nexus/src/lib/tiles/phone.svelte
4. On line 58 and 72 there are `{:else if}`, add one and adapt their content for your case
5. Update this file so the line numbers are accurate
6. make a PR :)
