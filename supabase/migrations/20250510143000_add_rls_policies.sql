 -- Migration: Add Row Level Security (RLS) policies to flashcards, generations, and generation_errors tables
-- Description: This migration enables RLS and adds appropriate policies for CRUD operations
-- Author: AI Assistant
-- Date: 2024-03-27

-- Enable RLS on all tables
alter table public.flashcards enable row level security;
alter table public.generations enable row level security;
alter table public.generation_errors enable row level security;

-- Policies for flashcards table
-- Note: Users should only see and manage their own flashcards

-- Select policy for authenticated users
create policy "Users can view their own flashcards"
on public.flashcards
for select
to authenticated
using (auth.uid() = user_id);

-- Insert policy for authenticated users
create policy "Users can create their own flashcards"
on public.flashcards
for insert
to authenticated
with check (auth.uid() = user_id);

-- Update policy for authenticated users
create policy "Users can update their own flashcards"
on public.flashcards
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Delete policy for authenticated users
create policy "Users can delete their own flashcards"
on public.flashcards
for delete
to authenticated
using (auth.uid() = user_id);

-- Policies for generations table
-- Note: Users should only see and manage their own generations

-- Select policy for authenticated users
create policy "Users can view their own generations"
on public.generations
for select
to authenticated
using (auth.uid() = user_id);

-- Insert policy for authenticated users
create policy "Users can create their own generations"
on public.generations
for insert
to authenticated
with check (auth.uid() = user_id);

-- Update policy for authenticated users
create policy "Users can update their own generations"
on public.generations
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Delete policy for authenticated users
create policy "Users can delete their own generations"
on public.generations
for delete
to authenticated
using (auth.uid() = user_id);

-- Policies for generation_errors table
-- Note: Users should only see and manage their own generation errors

-- Select policy for authenticated users
create policy "Users can view their own generation errors"
on public.generation_errors
for select
to authenticated
using (auth.uid() = user_id);

-- Insert policy for authenticated users
create policy "Users can create their own generation errors"
on public.generation_errors
for insert
to authenticated
with check (auth.uid() = user_id);

-- Update policy for authenticated users
create policy "Users can update their own generation errors"
on public.generation_errors
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Delete policy for authenticated users
create policy "Users can delete their own generation errors"
on public.generation_errors
for delete
to authenticated
using (auth.uid() = user_id);