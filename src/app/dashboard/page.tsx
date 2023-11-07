import { AddTodoComponent, Task, TaskComponent } from "../todos";

export default function HomePage() {
  const tasks: Task[] = [
    {
      id: 1,
      title: "Initialize Project",
      completed: true,
    },
    {
      id: 2,
      title: "Create Todo App",
      completed: false,
    },
  ];

  return (
    <main>
      <h1 className="text-center text-6xl italic text-[#ef4444]">todos</h1>
      <div className="card-shadow m-auto w-1/2 min-w-[400px] rounded-lg border border-solid border-gray-300 bg-white ">
        <AddTodoComponent />

        {tasks?.length ? (
          tasks.map((task) => <TaskComponent task={task} key={task.id} />)
        ) : (
          <div className="flex">
            <div className="px-3 py-2 text-gray-500">No tasks found</div>
          </div>
        )}
      </div>
    </main>
  );
}
