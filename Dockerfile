# =============================================================================
# TanStack Start Production Dockerfile
# Using Node.js 22 with Bun for package management
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Base image with Node.js 24 and Bun
# -----------------------------------------------------------------------------
FROM node:24-alpine AS base

# Install Bun
RUN npm install -g bun

WORKDIR /app

# -----------------------------------------------------------------------------
# Stage 2: Install dependencies
# -----------------------------------------------------------------------------
FROM base AS deps

# Copy package files for dependency installation
COPY package.json bun.lock ./

# Install all dependencies (including devDependencies for build)
RUN bun install --frozen-lockfile

# -----------------------------------------------------------------------------
# Stage 3: Build the application
# -----------------------------------------------------------------------------
FROM base AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code and config files
COPY . .

# Build the application
RUN bun run build

# -----------------------------------------------------------------------------
# Stage 4: Production runtime
# -----------------------------------------------------------------------------
FROM node:24-alpine AS runner

# Install Bun for runtime
RUN npm install -g bun

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 tanstack

# Copy built output from builder (both client and server)
COPY --from=builder --chown=tanstack:nodejs /app/dist ./dist

# Copy node_modules (needed for runtime)
COPY --from=builder --chown=tanstack:nodejs /app/node_modules ./node_modules

# Copy package.json (needed for module resolution)
COPY --from=builder --chown=tanstack:nodejs /app/package.json ./package.json

# Copy public assets to dist/client for static serving
COPY --from=builder --chown=tanstack:nodejs /app/public ./dist/client

# Copy convex directory for deployment
COPY --from=builder --chown=tanstack:nodejs /app/convex ./convex

# Copy tsconfig.json (needed for Convex)
COPY --from=builder --chown=tanstack:nodejs /app/tsconfig.json ./tsconfig.json

# Copy the startup script
COPY --from=builder --chown=tanstack:nodejs /app/start.sh ./start.sh
RUN chmod +x ./start.sh

# Switch to non-root user
USER tanstack

# Expose the port
EXPOSE 3000

# Health check for container orchestration
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# Use the startup script
CMD ["./start.sh"]
