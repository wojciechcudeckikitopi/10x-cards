import { test as teardown } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../db/database.types";

teardown("cleanup database", async () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_KEY;
  const userId = process.env.E2E_USERNAME_ID;

  if (!supabaseUrl || !supabaseAnonKey || !userId) {
    throw new Error("Missing required environment variables for Supabase connection or test user ID");
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

  console.log("🧹 Cleaning up test database...");

  // Delete all flashcards for the test user
  const { error: flashcardsError } = await supabase.from("flashcards").delete().eq("user_id", userId); // Delete test user data only

  if (flashcardsError) {
    console.error("Error deleting flashcards:", flashcardsError);
  }

  // Delete all generations for the test user
  const { error: generationsError } = await supabase.from("generations").delete().eq("user_id", userId); // Delete test user data only

  if (generationsError) {
    console.error("Error deleting generations:", generationsError);
  }

  console.log("✅ Database cleanup completed");
});
