import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../convex/_generated/api'
import { Loader } from '~/components/Loader'
import { todoQueries, useCreateTodoMutation, useUpdateTodoMutation, useDeleteTodoMutation } from '~/queries'
import { useState } from 'react'
import type { Id, Doc } from '../../convex/_generated/dataModel'

export const Route = createFileRoute('/')({
  component: Home,
  pendingComponent: () => <Loader />,
})

function Home() {
  const todosQuery = useSuspenseQuery({
    ...todoQueries.list(),
    retry: false,
  })
  const createTodo = useCreateTodoMutation()
  const updateTodo = useUpdateTodoMutation()
  const deleteTodo = useDeleteTodoMutation()
  const [newTodoText, setNewTodoText] = useState('')

  const handleCreateTodo = async () => {
    if (!newTodoText.trim()) return
    await createTodo.mutateAsync({ text: newTodoText.trim() })
    setNewTodoText('')
  }

  const handleToggleTodo = async (id: Id<'todos'>, completed: boolean) => {
    await updateTodo.mutateAsync({ id, completed: !completed })
  }

  const handleDeleteTodo = async (id: Id<'todos'>) => {
    await deleteTodo.mutateAsync({ id })
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-black mb-6">Todo List</h1>
      
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleCreateTodo()
            }
          }}
          placeholder="Add a new todo..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleCreateTodo}
          disabled={!newTodoText.trim() || createTodo.isPending}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>

      <div className="space-y-2">
        {todosQuery.data.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No todos yet. Add one above!</p>
        ) : (
          todosQuery.data.map((todo: Doc<'todos'>) => (
            <div
              key={todo._id}
              className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-md hover:shadow-sm transition-shadow"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleTodo(todo._id, todo.completed)}
                className="w-5 h-5 cursor-pointer"
              />
              <span
                className={`flex-1 ${
                  todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
                }`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => handleDeleteTodo(todo._id)}
                disabled={deleteTodo.isPending}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
