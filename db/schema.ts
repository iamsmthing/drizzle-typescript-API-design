import { relations } from "drizzle-orm";
import { text, boolean, pgTable } from "drizzle-orm/pg-core";

export const tasks = pgTable("tasks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  isCompleted: boolean("isCompleted").default(false).notNull(),
  userId:text("userId").references(()=>users.id,{onDelete:"cascade"})
});


export const users=pgTable("users",{
    id:text("id").primaryKey(),
    name:text("name").notNull(),
    email:text("email").notNull().unique(),
    password:text("password").notNull(),
   
})

// This relations shows that one user can have many tasks
export const usersRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
}));


// This relations shows that one task can have one and only one user
export const taskRelations = relations(tasks, ({ one }) => ({
  author: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
}));






