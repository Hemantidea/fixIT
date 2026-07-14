import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Next.js 16 looks for a named export called 'proxy' or a default export
export const proxy = NextAuth(authConfig).auth;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};