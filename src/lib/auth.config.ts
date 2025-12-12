import type { NextAuthConfig } from "next-auth";

// Minimal config for Edge Runtime (middleware) - no MongoDB imports
export const authConfig = {
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      // Public routes
      const publicRoutes = ["/auth/signin", "/auth/signup", "/auth/error", "/"];
      const isPublicRoute = publicRoutes.some((route) =>
        pathname.startsWith(route)
      );

      if (isPublicRoute) {
        return true;
      }

      return isLoggedIn;
    },
  },
  providers: [], // Providers added in auth.ts
} satisfies NextAuthConfig;
