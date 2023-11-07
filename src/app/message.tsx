"use server";

export async function Message() {
  await sleep(1000);
  return <h2>Hi from the server</h2>;
}
async function sleep(ms: number) {
  console.log(`Sleeping for ${ms}ms`);
  return new Promise((resolve) => setTimeout(resolve, ms));
}
