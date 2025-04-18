-- Migration: Disable RLS Policies
-- Description: Drops all previously defined RLS policies for flashcards, generations, and generation_errors tables
-- Author: AI Assistant
-- Date: 2024-03-27

-- Drop policies for generations table
drop policy if exists "Users can view their own generations" on generations;
drop policy if exists "Users can insert their own generations" on generations;
drop policy if exists "Users can update their own generations" on generations;
drop policy if exists "Users can delete their own generations" on generations;

-- Drop policies for flashcards table
drop policy if exists "Users can view their own flashcards" on flashcards;
drop policy if exists "Users can insert their own flashcards" on flashcards;
drop policy if exists "Users can update their own flashcards" on flashcards;
drop policy if exists "Users can delete their own flashcards" on flashcards;

-- Drop policies for generation_errors table
drop policy if exists "Users can view their own generation errors" on generation_errors;
drop policy if exists "Users can insert their own generation errors" on generation_errors;
drop policy if exists "Users can delete their own generation errors" on generation_errors;

-- Disable RLS on tables
alter table generations disable row level security;
alter table flashcards disable row level security;
alter table generation_errors disable row level security; 