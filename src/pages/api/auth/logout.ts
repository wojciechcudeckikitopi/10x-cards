import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ cookies, redirect }) => {
  // Clear the session cookie
  cookies.delete('session', {
    path: '/',
  });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}; 