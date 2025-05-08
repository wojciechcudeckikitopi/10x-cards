import { createSupabaseServerInstance } from "@/db/supabase.client";
import type { APIRoute } from 'astro';

// Define the User type to match the one used in locals
type User = {
  id: string;
  email: string | null;
};

// Extend Astro.locals type
declare global {
  namespace App {
    interface Locals {
      user?: User | undefined;
    }
  }
}

export const prerender = false;

export const POST: APIRoute = async ({ cookies, request }) => {
  const supabase = createSupabaseServerInstance({
    cookies,
    headers: request.headers,
  });

  const { error } = await supabase.auth.signOut();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}; 