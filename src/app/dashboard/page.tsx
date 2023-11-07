import { revalidatePath } from "next/cache";
import { AddTodoComponent, TodoComponent } from "../todos";
import { db } from "~/server/db";
import { ensureUser } from "../auth";
import type { Todo } from "@prisma/client";

const todosRemaining = async (): Promise<[number, "free" | "paid"]> => {
  const {
    orgId,
    sessionClaims: {
      publicMetadata: { plan: personalPlan = "free" },
      orgMetadata: { plan: orgPlan = "free" },
    },
  } = ensureUser();

  const todos = (await getTodos()).length;

  if (!orgId) {
    if (personalPlan === "free") return [5 - todos, personalPlan];
    if (personalPlan === "paid") return [10 - todos, personalPlan];
  }

  if (orgId) {
    if (orgPlan === "free") return [10 - todos, orgPlan];
    if (orgPlan === "paid") return [20 - todos, orgPlan];
  }

  throw new Error("Unhandled case");
};

export default async function HomePage() {
  const todos = await getTodos();
  const [remaining, plan] = await todosRemaining();
  return (
    <main>
      <h1 className="text-center text-6xl italic text-[#ef4444]">todos</h1>
      <div className="card-shadow m-auto w-1/2 min-w-[400px] rounded-lg border border-solid border-gray-300 bg-white">
        <AddTodoComponent addTodo={addTodo} />
        {todos?.length ? (
          <>
            {todos.map((todo) => (
              <TodoComponent
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo(todo)}
                onDelete={deleteTodo(todo)}
              />
            ))}
            <div className="flex">
              <div className="px-3 py-2 text-gray-500">
                {remaining} todos remaining
                {plan === "paid" ? (
                  <span className="ml-2 inline-flex items-center rounded-full bg-green-800 px-2.5 py-0.5 text-xs font-medium text-green-50">
                    Pro
                  </span>
                ) : (
                  <span className="ml-2 inline-flex items-center rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-900">
                    Free
                  </span>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex">
            <div className="px-3 py-2 text-gray-500">No tasks found</div>
          </div>
        )}
      </div>
    </main>
  );
}

async function getTodos() {
  const { userId, orgId } = ensureUser();

  return orgId
    ? await db.todo.findMany({
        where: { orgId },
        orderBy: { createdAt: "desc" },
      })
    : await db.todo.findMany({
        where: { userId, orgId: null },
        orderBy: { createdAt: "desc" },
      });
}

async function addTodo(title: string) {
  "use server";
  const { userId, orgId } = ensureUser();

  const [remaining] = await todosRemaining();
  if (remaining < 1) throw new Error("You have reached your todo limit");

  await db.todo.create({
    data: {
      title,
      completed: false,
      userId,
      orgId,
    },
  });

  revalidatePath("/");
}

const toggleTodo = (todo: Todo) => async () => {
  "use server";
  const { userId, orgId } = ensureUser();

  await db.todo.update({
    where: { id: todo.id, userId, orgId },
    data: { completed: !todo.completed },
  });

  revalidatePath("/");
};

const deleteTodo = (todo: Todo) => async () => {
  "use server";
  const { userId, orgId } = ensureUser();

  await db.todo.delete({
    where: { id: todo.id, userId, orgId },
  });

  revalidatePath("/");
};
