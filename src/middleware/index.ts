import { defineMiddleware } from "astro:middleware";
import { createSupabaseServerInstance } from "../db/supabase.client";

// Public paths - Auth API endpoints & Server-Rendered Astro Pages
const PUBLIC_PATHS = [
  // Server-Rendered Astro Pages
  "/auth/login",
  "/auth/register",
  "/auth/password-recovery",
  "/auth/password-reset",
  // Auth API endpoints
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/reset-password",
];

export const onRequest = defineMiddleware(async ({ locals, cookies, url, request, redirect }, next) => {
  // Skip auth check for public paths
  if (PUBLIC_PATHS.includes(url.pathname)) {
    return next();
  }

  const supabase = createSupabaseServerInstance({
    cookies,
    headers: request.headers,
  });

  locals.supabase = supabase;

  // IMPORTANT: Always get user session first before any other operations
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user) {
    locals.user = {
      email: session.user.email,
      id: session.user.id,
    };
    return next();
  }

  // Redirect to login for protected routes
  return redirect("/auth/login");
});
