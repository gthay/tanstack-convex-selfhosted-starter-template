import { defineSchema, defineTable } from 'convex/server'
import { type Infer, v } from 'convex/values'

const schema = defineSchema({
  todos: defineTable({
    text: v.string(),
    completed: v.boolean(),
    createdAt: v.number(),
  })
    .index('createdAt', ['createdAt']),
})

export default schema

const todo = schema.tables.todos.validator

export const createTodoSchema = v.object({
  text: todo.fields.text,
})

export const updateTodoSchema = v.object({
  id: v.id('todos'),
  text: v.optional(todo.fields.text),
  completed: v.optional(todo.fields.completed),
})

export type Todo = Infer<typeof todo>
