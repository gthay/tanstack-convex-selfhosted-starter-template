import { useMutation } from '@tanstack/react-query'
import { convexQuery, useConvexMutation } from '@convex-dev/react-query'
import { api } from '../convex/_generated/api'

export const todoQueries = {
  list: () => convexQuery(api.todos.getTodos, {}),
}

export function useCreateTodoMutation() {
  const mutationFn = useConvexMutation(api.todos.createTodo)
  return useMutation({ mutationFn })
}

export function useUpdateTodoMutation() {
  const mutationFn = useConvexMutation(api.todos.updateTodo)
  return useMutation({ mutationFn })
}

export function useDeleteTodoMutation() {
  const mutationFn = useConvexMutation(api.todos.deleteTodo)
  return useMutation({ mutationFn })
}
