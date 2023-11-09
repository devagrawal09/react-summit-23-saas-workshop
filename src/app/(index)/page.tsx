import Link from "next/link";

export default async function HomePage() {
  return (
    <main>
      <h1 className="todos-title">todos</h1>
      <div className="text-center">
        <div className="todos-text">
          Go to <Link href="/dashboard">dashboard</Link> to view your todos.
        </div>
      </div>
    </main>
  );
}
