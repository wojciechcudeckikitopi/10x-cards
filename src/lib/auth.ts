import type { APIContext } from "astro";

export class AuthenticationError extends Error {
  constructor(message = "User not authenticated") {
    super(message);
    this.name = "AuthenticationError";
  }
}

export async function getCurrentUser(context: APIContext) {
  const { supabase } = context.locals;
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new AuthenticationError();
  }

  return user;
}
