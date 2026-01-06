import { createRouter } from '@tanstack/react-router'
import {
  MutationCache,
  QueryCache,
  QueryClient,
  notifyManager,
} from '@tanstack/react-query'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import toast from 'react-hot-toast'
import { ConvexQueryClient } from '@convex-dev/react-query'
import { ConvexProvider } from 'convex/react'
import { routeTree } from './routeTree.gen'
import { DefaultCatchBoundary } from './components/DefaultCatchBoundary'
import { NotFound } from './components/NotFound'

export function getRouter() {
  if (typeof document !== 'undefined') {
    notifyManager.setScheduler(window.requestAnimationFrame)
  }

  const CONVEX_URL = (import.meta as any).env.VITE_CONVEX_URL
  if (!CONVEX_URL) {
    throw new Error(
      'Missing VITE_CONVEX_URL environment variable. Please set it to your Convex deployment URL.',
    )
  }
  const convexQueryClient = new ConvexQueryClient(CONVEX_URL)

  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
      },
    },
    mutationCache: new MutationCache({
      onError: (error, variables, context, mutation) => {
        console.error('Convex mutation error:', {
          message: error.message,
          stack: error.stack,
          variables,
          errorDetails: error,
        })
        const errorMessage =
          error.message.includes('Server Error') &&
          !error.message.includes('Convex functions')
            ? 'Convex backend error. Make sure your functions are deployed with `npx convex deploy`.'
            : error.message
        toast(errorMessage, { className: 'bg-red-500 text-white' })
      },
    }),
    queryCache: new QueryCache({
      onError: (error, query) => {
        console.error('Convex query error:', {
          message: error.message,
          stack: error.stack,
          queryKey: query.queryKey,
          errorDetails: error,
        })
        if (error.message.includes('Server Error')) {
          console.error(
            'Convex query failed. Make sure:',
            '\n1. Your Convex functions are deployed: npx convex deploy',
            '\n2. Your VITE_CONVEX_URL is set correctly',
            '\n3. Your Convex deployment is running',
            '\n4. Check your Convex backend logs for more details',
            '\n\nAttempted query:', query.queryKey,
          )
        }
      },
    }),
  })
  convexQueryClient.connect(queryClient)

  const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
    context: { queryClient },
    Wrap: ({ children }) => (
      <ConvexProvider client={convexQueryClient.convexClient}>
        {children}
      </ConvexProvider>
    ),
    scrollRestoration: true,
  })
  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
