import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  // Making sure homepage route and API, especially the webhook, are both public!
  publicRoutes: ["/", "/api/(.*)"],
  afterAuth: async (auth, req) => {
    console.log(auth.sessionClaims);
    // Nice try, you need to sign-in
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
    // Hey! Members is for members 😆
    if (
      auth.userId &&
      req.nextUrl.pathname === "/members" &&
      auth.sessionClaims.publicMetadata.stripe?.payment !== "paid"
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    // Welcome paid member! 👋
    if (
      auth.userId &&
      req.nextUrl.pathname === "/members" &&
      // How we get payment value "paid" is next, in the webhook section!
      auth.sessionClaims.publicMetadata.stripe?.payment === "paid"
    ) {
      return NextResponse.next();
    }
    // If we add more public routes, signed-in people can access them
    if (auth.userId && req.nextUrl.pathname !== "/members") {
      return NextResponse.next();
    }
    // Fallthrough last-ditch to allow access to a public route explicitly
    if (auth.isPublicRoute) {
      return NextResponse.next();
    }
  },
});
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
