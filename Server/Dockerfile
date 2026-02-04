# -------- Base --------
FROM node:20-alpine AS base
WORKDIR /app

# -------- Dependencies --------
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# -------- Production --------
FROM base AS production

WORKDIR /app

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy source
COPY . .

# Create non-root user
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs
USER nodejs

# Render provides PORT automatically
EXPOSE 3000

CMD ["npm", "start"]
