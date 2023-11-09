import { db } from "~/server/db";
import { AddTodoComponent, TodoComponent } from "../todos";
import { revalidatePath } from "next/cache";

export default async function DashboardPage() {
  const todos = await db.todo.findMany();

  return (
    <main>
      <h1 className="todos-title">todos</h1>
      <div className="todos-card">
        <AddTodoComponent
          addTodo={async (title) => {
            "use server";

            await db.todo.create({
              data: { title, completed: false },
            });

            revalidatePath("/dashboard");
          }}
        />

        {todos?.length ? (
          todos.map((todo) => (
            <TodoComponent
              todo={todo}
              key={todo.id}
              toggleCompleted={async (todo) => {
                "use server";

                await db.todo.update({
                  where: { id: todo.id },
                  data: { completed: !todo.completed },
                });

                revalidatePath("/dashboard");
              }}
              deleteTodo={async (todo) => {
                "use server";

                await db.todo.delete({
                  where: { id: todo.id },
                });

                revalidatePath("/dashboard");
              }}
            />
          ))
        ) : (
          <div className="flex">
            <div className="todos-text">No todos found</div>
          </div>
        )}
      </div>
    </main>
  );
}
