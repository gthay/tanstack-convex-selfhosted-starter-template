import { v } from 'convex/values'
import { internalMutation, mutation, query } from './_generated/server'
import type { Id } from './_generated/dataModel'

export const getTodos = query(async (ctx) => {
  const todos = await ctx.db
    .query('todos')
    .withIndex('createdAt')
    .collect()
  return todos
})

export const createTodo = mutation({
  args: {
    text: v.string(),
  },
  handler: async (ctx, { text }) => {
    const todoId = await ctx.db.insert('todos', {
      text,
      completed: false,
      createdAt: Date.now(),
    })
    return todoId
  },
})

export const updateTodo = mutation({
  args: {
    id: v.id('todos'),
    text: v.optional(v.string()),
    completed: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, text, completed }) => {
    const todo = await ctx.db.get(id)
    if (!todo) {
      throw new Error('Todo not found')
    }
    await ctx.db.patch(id, {
      ...(text !== undefined && { text }),
      ...(completed !== undefined && { completed }),
    })
  },
})

export const deleteTodo = mutation({
  args: {
    id: v.id('todos'),
  },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id)
  },
})

export const seed = internalMutation(async (ctx) => {
  const existingTodos = await ctx.db.query('todos').collect()
  if (existingTodos.length > 0) {
    return
  }
  await ctx.db.insert('todos', {
    text: 'Welcome to TanStack Start + Convex!',
    completed: false,
    createdAt: Date.now(),
  })
  await ctx.db.insert('todos', {
    text: 'Check out the Convex docs',
    completed: false,
    createdAt: Date.now() + 1,
  })
})

