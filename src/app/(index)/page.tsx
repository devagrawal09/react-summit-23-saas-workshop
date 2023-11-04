import { SignInButton } from "@clerk/nextjs";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default async function HomePage() {
  return (
    <main>
      <h1 className="text-center text-6xl italic text-[#ef4444]">todos</h1>
      <div className="card-shadow m-auto w-1/2 min-w-[400px] rounded-lg bg-white">
        <div className="px-3 py-2 pt-12 text-center text-gray-500">
          <SignedIn>
            Go to <Link href="/dashboard">dashboard</Link> to view your tasks
          </SignedIn>
          <SignedOut>
            Please{" "}
            <SignInButton>
              <button className="hover:underline">sign in</button>
            </SignInButton>{" "}
            to view your tasks
          </SignedOut>
        </div>
      </div>
    </main>
  );
}
