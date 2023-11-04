import { revalidatePath } from "next/cache";
import { AddTodoComponent, TodoComponent } from "../todos";
import { db } from "~/server/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { userId, orgId } = auth();

  if (!userId) redirect("/");

  const todos = orgId
    ? await db.todo.findMany({
        where: { orgId },
        orderBy: { createdAt: "desc" },
      })
    : await db.todo.findMany({
        where: { userId, orgId: null },
        orderBy: { createdAt: "desc" },
      });

  return (
    <main>
      <h1 className="text-center text-6xl italic text-[#ef4444]">todos</h1>
      <div className="card-shadow m-auto w-1/2 min-w-[400px] rounded-lg border border-solid border-gray-300 bg-white">
        <AddTodoComponent
          addTodo={async (title: string) => {
            "use server";

            await db.todo.create({
              data: {
                title,
                completed: false,
                userId,
                orgId,
              },
            });

            revalidatePath("/");
          }}
        />
        {todos?.length ? (
          todos.map((todo) => (
            <TodoComponent
              key={todo.id}
              todo={todo}
              onToggle={async () => {
                "use server";

                await db.todo.update({
                  where: { id: todo.id, userId, orgId },
                  data: { completed: !todo.completed },
                });

                revalidatePath("/");
              }}
              onDelete={async () => {
                "use server";

                await db.todo.delete({ where: { id: todo.id, userId, orgId } });

                revalidatePath("/");
              }}
            />
          ))
        ) : (
          <div className="flex">
            <div className="px-3 py-2 text-gray-500">No tasks found</div>
          </div>
        )}
      </div>
    </main>
  );
}
