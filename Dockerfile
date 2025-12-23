FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock* ./
# Install all dependencies (including devDeps) to run the build
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# --- Production Stage ---
FROM node:22-alpine AS runner
WORKDIR /app

# Copy the built application
COPY --from=builder /app/build build/
# Copy only production dependencies to keep the image small
COPY package.json yarn.lock* ./
RUN yarn install --production --frozen-lockfile

EXPOSE 3000
ENV NODE_ENV=production

# SvelteKit adapter-node default entry point is build/index.js
CMD [ "node", "build/index.js" ]