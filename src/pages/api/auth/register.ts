import { createSupabaseServerInstance } from '@/db/supabase.client';
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies }) => {
  const { email, password } = await request.json();

  // Input validation
  if (!email || !password) {
    return new Response(
      JSON.stringify({ error: 'Email and password are required' }),
      { status: 400 }
    );
  }

  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return new Response(
      JSON.stringify({ error: 'Please enter a valid email address' }),
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return new Response(
      JSON.stringify({ error: 'Password must be at least 8 characters long' }),
      { status: 400 }
    );
  }

  const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }), 
      { status: 400 }
    );
  }

  return new Response(
    JSON.stringify({ user: data.user }), 
    { status: 200 }
  );
}; 