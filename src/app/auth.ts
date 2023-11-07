import { auth } from "@clerk/nextjs";

export function ensureUser() {
  const authObj = auth();

  if (authObj.userId) {
    const sessionClaims = authObj.sessionClaims;

    if (!sessionClaims) throw new Error("Session claims not found");

    return {
      ...authObj,
      userId: authObj.userId,
      orgId: authObj.orgId,
      sessionClaims,
    };
  }

  throw new Error("Not logged in");
}
