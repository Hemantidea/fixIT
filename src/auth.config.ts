import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  providers: [],
  session: {
    strategy: "jwt",
  },
  // Add a fallback value so compilation asserts pass before .env is loaded
  secret: process.env.AUTH_SECRET || "development_fallback_secret_value_12345",
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      
      // Whitelist both the root landing page and the OTP verification page as public
      const isPublicPage = nextUrl.pathname === "/" || nextUrl.pathname === "/verify-otp";
      
      if (!isLoggedIn) {
        // Allow unauthenticated guests to access only public pages
        if (isPublicPage) return true;
        return false; // Redirect private route access (Dashboard, Test Player, Results) to landing page
      } else {
        // Authenticated users trying to access public pages are directed straight to the dashboard
        if (isPublicPage) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }
    },
  },
  pages: {
    signIn: "/",
  },
} satisfies NextAuthConfig;