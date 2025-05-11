import { vi } from "vitest";
import type { SupabaseClient } from "../../db/supabase.client";

// Create a mock Supabase client for testing
export const createMockSupabaseClient = () => {
  // Create base mock functions
  const from = vi.fn();
  const select = vi.fn();
  const insert = vi.fn();
  const update = vi.fn();
  const delete_ = vi.fn();
  const eq = vi.fn();
  const in_ = vi.fn();
  const match = vi.fn();
  const auth = {
    getUser: vi.fn(),
    signOut: vi.fn(),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    onAuthStateChange: vi.fn(),
  };

  // Create a base mock implementation
  const baseImpl = {
    select: () => ({ ...baseImpl, data: null, error: null }),
    insert: () => ({ ...baseImpl, data: null, error: null }),
    update: () => ({ ...baseImpl, data: null, error: null }),
    delete: () => ({ ...baseImpl, data: null, error: null }),
    eq: () => ({ ...baseImpl }),
    in: () => ({ ...baseImpl }),
    match: () => ({ ...baseImpl }),
    single: () => ({ data: null, error: null }),
    order: () => ({ ...baseImpl }),
    limit: () => ({ ...baseImpl }),
    range: () => ({ ...baseImpl }),
    returning: () => ({ data: null, error: null }),
    maybeSingle: () => ({ data: null, error: null }),
    then: (callback: (value: any) => any) => callback({ data: null, error: null }),
  };

  // Build the mock chain
  from.mockReturnValue({
    ...baseImpl,
    select,
    insert,
    update,
    delete: delete_,
  });

  select.mockReturnValue({
    ...baseImpl,
    eq,
    in: in_,
    match,
  });

  insert.mockReturnValue({
    ...baseImpl,
    returning: () => ({ data: null, error: null }),
  });

  update.mockReturnValue({
    ...baseImpl,
    eq,
    match,
  });

  delete_.mockReturnValue({
    ...baseImpl,
    eq,
    match,
  });

  // Create the mock Supabase client
  const mockSupabaseClient = {
    from,
    auth,
    // Add any other Supabase client methods you need
  } as unknown as SupabaseClient;

  return {
    mockSupabaseClient,
    // Export mocks for further configuration in tests
    mocks: {
      from,
      select,
      insert,
      update,
      delete: delete_,
      eq,
      in: in_,
      match,
      auth,
    },
  };
};
