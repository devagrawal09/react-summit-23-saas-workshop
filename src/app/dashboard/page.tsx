import { db } from "~/server/db";
import { AddTodoComponent, TodoComponent } from "../todos";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs";

export default async function DashboardPage() {
  const { userId } = auth();

  if (!userId) throw new Error("Must be logged in");

  const todos = await db.todo.findMany({
    where: { userId },
  });

  return (
    <main>
      <h1 className="todos-title">todos</h1>
      <div className="todos-card">
        <AddTodoComponent
          addTodo={async (title) => {
            "use server";

            const { userId } = auth();

            if (!userId) throw new Error("Must be logged in");

            await db.todo.create({
              data: { title, completed: false, userId },
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

                const { userId } = auth();

                if (!userId) throw new Error("Must be logged in");

                await db.todo.update({
                  where: { id: todo.id, userId },
                  data: { completed: !todo.completed },
                });

                revalidatePath("/dashboard");
              }}
              deleteTodo={async (todo) => {
                "use server";

                const { userId } = auth();

                if (!userId) throw new Error("Must be logged in");

                await db.todo.delete({
                  where: { id: todo.id, userId },
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
