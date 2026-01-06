# TanStack Start + Convex Self Hosting Starter Template

A starter template for building full-stack React applications with [TanStack Start](https://tanstack.com/start) and [Convex](https://convex.dev).

## Features

- **TanStack Start** - Type-safe, client-first, full-stack React framework
- **Convex** - Reactive backend with real-time updates
- **TanStack Query** - Powerful data synchronization with Convex integration
- **TypeScript** - Full type safety across the stack
- **TailwindCSS** - Utility-first CSS framework
- **Real-time updates** - Live data synchronization via WebSocket
- **Optimistic updates** - Instant UI feedback with automatic rollback

## Getting Started

### Prerequisites

- Node.js 24 or higher
- Bun (recommended) or npm/pnpm/yarn
- A Convex account (free tier available)

### Initial Setup

1. **Clone or use this template:**
   ```bash
   git clone https://github.com/gthay/tanstack-convex-selfhosted-starter-template.git
   cd tanstack-convex-selfhosted-starter-template
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

3. **Set up Convex:**
   ```bash
   npx convex dev
   ```
   1. Select "New Project"
   2. Select "local deployment"
   This will:
   - Create a new Convex project (if you don't have one)
   - Generate your deployment URL
   - Push your schema and functions to Convex

4. **Configure environment variables:**
   
   --

5. **Start the development server:**
   ```bash
   bun dev
   ```
   
   This will:
   - Start the Convex dev server
   - Start the Vite dev server on port 3000
   - Seed the database with example data

6. **Open your browser:**
   
   Navigate to [http://localhost:3000](http://localhost:3000)


## Deploy to Dokploy

1. Create your Github Repo
Push the repo into your own Github Repository
2. Setup Dokploy Server
Setup a Dokploy Server and secure it etc.
3. Create Project 
Create a Project in Dokploy.
4. Create Backend Service
Select Create compose and give it a name e.G. "Convex"
5. Connect Github Repo
Connect your Github Repository. Select main branch and press save
6. Set Domains
Open Tab "Domains" and add the following 3:
- Backend:
   - Service Name: select backend in dropdown
   - Host: use button for for a traefik Domain or create a subdomain e.G db.example.com
   - Container Port: 3210
   - HTTPS: On and select "Let's Encrypt"
- Dashboard:
   - Service Name: dashboard
   - Host: use button for for a traefik Domain or create a subdomain e.G db-panel.example.com
   - Container Port: 6791
   - HTTPS: On and select "Let's Encrypt"
- Backend2:
   - Service Name: backend
   - Host: use button for for a traefik Domain or create a subdomain e.G db2.example.com
   - Container Port: 3211
   - HTTPS: On and select "Let's Encrypt"
7. Set env 
Then go to "Environment" Tab and make it visible. In there paste:
```bash
   CONVEX_CLOUD_ORIGIN=https://convex-db.example.com
   CONVEX_SITE_ORIGIN=http://convex-convex-1wqleh-7f7f4e-49-13-80-89.traefik.me
   POSTGRES_PASSWORD=your_secure_password_123
   INSTANCE_NAME=convex
   INSTANCE_SECRET=bf52d4564c2bad0499fccaa563c3cd5f3d
   POSTGRES_USER=convex
   POSTGRES_DB=convex
   CONVEX_BACKEND_PORT=3210
   CONVEX_SITE_PORT=3211
   DASHBOARD_PORT=6791
   RUST_LOG=info
   DISABLE_BEACON=true
   ```
   Then edit the following: 
   - POSTGRES_PASSWORD -> Change to a secure password (can only change before the first deployment)
   - INSTANCE_SECRET -> Execute the following in any Terminal and use it as a secret:
   openssl rand -hex 32
   Then go back to tab "General" and press "deploy" wait until it's done (green)
   - CONVEX_CLOUD_ORIGIN -> Use Domain from earlier on port 3210 (db.example.com)
   - CONVEX_SITE_ORIGIN -> Use Domain from earlier on port 3211 (db2.example.com)
## Project Structure

```
├── convex/              # Convex backend functions
│   ├── schema.ts        # Database schema definition
│   ├── todos.ts         # Example Convex functions (queries/mutations)
│   └── crons.ts         # Scheduled functions (optional)
├── src/
│   ├── components/      # React components
│   ├── routes/          # TanStack Router file-based routes
│   ├── queries.ts       # TanStack Query definitions
│   ├── router.tsx       # Router configuration
│   └── styles/          # Global styles
└── public/              # Static assets
```

## Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start development with Convex, web dev server, and database seeding |
| `bun dev:web` | Start Vite dev server on port 3000 |
| `bun dev:db` | Run Convex dev with todos:seed function |
| `bun build` | Build production bundle with type checking |
| `bun preview` | Preview production build locally |
| `bun start` | Start production server |

### Convex Development

- **View your data:** Open the Convex dashboard with `npx convex dashboard`
- **Push functions:** Functions are automatically pushed during `bun dev`, or manually with `npx convex deploy`
- **View logs:** Check the Convex dashboard or terminal output

### Adding New Features

1. **Define your schema** in `convex/schema.ts`
2. **Create Convex functions** in `convex/` (queries, mutations, actions)
3. **Use in React** with `useSuspenseQuery` and `useMutation` from TanStack Query
4. **See the example:** Check `convex/todos.ts` and `src/routes/index.tsx` for a complete example

## Example: Todo List

This starter includes a simple todo list example that demonstrates:

- **Schema definition** (`convex/schema.ts`)
- **Convex queries and mutations** (`convex/todos.ts`)
- **React Query integration** (`src/queries.ts`)
- **Real-time UI updates** (`src/routes/index.tsx`)

You can use this as a reference for building your own features.

## Deployment

### Frontend Deployment

The frontend can be deployed to any platform that supports Node.js:

- **Vercel:** Connect your repo and deploy
- **Netlify:** Connect your repo and deploy
- **Self-hosted:** Use the included Dockerfile

### Convex Deployment

**IMPORTANT:** Before deploying your frontend, you must deploy your Convex functions and schema to your Convex backend.

1. **Set up your Convex project** (if not already done):
   ```bash
   npx convex dev
   ```
   This will create a project and push your functions.

2. **For production deployment:**
   ```bash
   npx convex deploy --prod
   ```
   Or if using a specific deployment:
   ```bash
   npx convex deploy --prod --url https://your-deployment.convex.cloud
   ```

3. **Set the environment variable** in your deployment platform:
   - Set `VITE_CONVEX_URL` to your Convex deployment URL
   - You can find this in the Convex dashboard or from `npx convex dev` output

**Note:** If you see "Server Error" from Convex after deployment, it usually means:
- Your Convex functions haven't been deployed yet
- The `VITE_CONVEX_URL` environment variable is incorrect
- Your Convex backend is not running (for self-hosted setups)

**For self-hosted Convex deployments:**

1. Make sure your Convex backend is running and accessible
2. Deploy your functions:
   ```bash
   npx convex deploy --url https://your-convex-backend-url.com
   ```
3. Verify deployment by checking:
   - Convex dashboard (if available)
   - Backend logs for function registration
   - Try calling a function directly via the API

**Troubleshooting:**

Check the browser console and server logs for detailed error messages. The error logs will show:
- Which function is being called
- The full error details
- Suggestions for fixing the issue

### Self-Hosted Convex

See [DEPLOY.md](./DEPLOY.md) for instructions on deploying with self-hosted Convex using Docker.

## Learn More

- [TanStack Start Documentation](https://tanstack.com/start)
- [Convex Documentation](https://docs.convex.dev)
- [TanStack Query Documentation](https://tanstack.com/query)
- [TanStack Router Documentation](https://tanstack.com/router)

## License

This starter template is provided as-is for your use.
