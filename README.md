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
   git clone <your-repo-url>
   cd tanstack-convex-starter-template
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

3. **Set up Convex:**
   ```bash
   npx convex dev
   ```
   
   This will:
   - Create a new Convex project (if you don't have one)
   - Generate your deployment URL
   - Push your schema and functions to Convex

4. **Configure environment variables:**
   
   Create a `.env` file in the root directory:
   ```bash
   VITE_CONVEX_URL=your-convex-deployment-url
   ```
   
   You can find your deployment URL in the Convex dashboard or in the output from `npx convex dev`.

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
