# Deploying to Dokploy with Self-Hosted Convex

This guide explains how to deploy the TanStack Start + Convex starter template with a self-hosted Convex backend using Dokploy.

## Prerequisites

- Dokploy instance running
- Domain configured for your services

## Environment Variables

Set these environment variables in Dokploy for your compose deployment:

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `POSTGRES_PASSWORD` | Secure password for PostgreSQL | `your_secure_password_123` |
| `INSTANCE_NAME` | Unique name for your Convex instance | `my-app-production` |
| `INSTANCE_SECRET` | 64-character hex secret (generate with `openssl rand -hex 32`) | `a1b2c3d4...` |
| `CONVEX_CLOUD_ORIGIN` | Public URL for Convex backend API (port 3210) | `https://convex-db.yourdomain.com` |
| `CONVEX_SITE_ORIGIN` | Public URL for Convex HTTP actions (port 3211) | `https://convex-site.yourdomain.com` |

### Optional Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `POSTGRES_USER` | `convex` | PostgreSQL username |
| `POSTGRES_DB` | `convex` | PostgreSQL database name |
| `CONVEX_BACKEND_PORT` | `3210` | Internal backend port |
| `CONVEX_SITE_PORT` | `3211` | Internal site proxy port |
| `DASHBOARD_PORT` | `6791` | Internal dashboard port |
| `RUST_LOG` | `info` | Log level (debug, info, warn, error) |
| `DISABLE_BEACON` | `true` | Disable telemetry beacon |

## Deployment Steps

### 1. Generate Instance Secret

Run this command locally to generate a secure secret:

```bash
openssl rand -hex 32
```

### 2. Configure Dokploy

1. Create a new **Compose** application in Dokploy
2. Use the `docker-compose.yml` from this repository
3. Set all required environment variables in Dokploy's environment settings
4. Configure domains/proxies for the exposed ports:
   - Port `3210` → Your Convex API domain (e.g., `convex-api.yourdomain.com`)
   - Port `3211` → Your Convex Site domain (e.g., `convex-site.yourdomain.com`)
   - Port `6791` → Your Dashboard domain (e.g., `convex-dashboard.yourdomain.com`)

### 3. Deploy

Deploy the compose stack in Dokploy. Wait for all services to be healthy.

### 4. Generate Admin Key

After deployment, access the backend container and run:

```bash
docker compose exec backend ./generate_admin_key.sh
```

Or in Dokploy, use the terminal feature to run this command in the backend container.

### 5. Configure Your Local Development

Create a `.env.local` file in your project (don't commit this):

```bash
CONVEX_SELF_HOSTED_URL='https://convex-api.yourdomain.com'
CONVEX_SELF_HOSTED_ADMIN_KEY='<your generated admin key>'
```

### 6. Push Your Convex Functions

```bash
npx convex dev
```

Or for production deployment:

```bash
npx convex deploy
```

## Troubleshooting

### Backend container exits immediately

- Check that all required environment variables are set
- Ensure `INSTANCE_SECRET` is exactly 64 hex characters
- Check logs: `docker compose logs backend`

### Cannot connect to PostgreSQL

- Verify `POSTGRES_PASSWORD` is set correctly
- Check PostgreSQL container health: `docker compose ps`

### Dashboard shows connection error

- Ensure `CONVEX_CLOUD_ORIGIN` matches the actual public URL
- Verify the backend is healthy before dashboard starts

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Dokploy                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  PostgreSQL │◄─│   Backend   │◄─│     Dashboard       │  │
│  │   :5432     │  │ :3210/:3211 │  │       :6791         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│         │                │                    │              │
│         ▼                ▼                    ▼              │
│    [postgres_data]  [convex_data]      [no volume]          │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
                    Your Frontend App
                 (Vercel/Netlify/etc.)
```

