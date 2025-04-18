-- Migration: Initial Schema Setup
-- Description: Creates the initial database schema for 10x-Cards application
-- Including: ENUMs, tables, indexes, and RLS policies
-- Author: AI Assistant
-- Date: 2024-03-27

-- Create ENUM types
create type flashcard_source as enum ('ai', 'manual', 'ai-edited');
create type flashcard_status as enum ('pending', 'accepted', 'rejected');

-- Create generations table
create table generations (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    source_text_hash text not null,
    source_text_length integer not null check (source_text_length between 1000 and 10000),
    generated_count integer not null default 0,
    accepted_unedited_count integer,
    accepted_edited_count integer,
    llm_model text not null,
    generation_duration integer,
    generated_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Create flashcards table
create table flashcards (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    front varchar(200) not null,
    back varchar(500) not null,
    source flashcard_source not null,
    status flashcard_status not null,
    generation_id uuid not null references generations(id),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Create generation_errors table
create table generation_errors (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    source_text_hash text not null,
    source_text_length integer not null check (source_text_length between 1000 and 10000),
    error_message text not null,
    llm_model text not null,
    created_at timestamptz not null default now()
);

-- Create indexes
create index generations_user_id_idx on generations(user_id);
create index flashcards_user_id_idx on flashcards(user_id);
create index flashcards_status_idx on flashcards(status);
create index generation_errors_user_id_idx on generation_errors(user_id);

-- Enable Row Level Security
alter table generations enable row level security;
alter table flashcards enable row level security;
alter table generation_errors enable row level security;

-- RLS Policies for generations
create policy "Users can view their own generations"
    on generations for select
    using (auth.uid() = user_id);

create policy "Users can insert their own generations"
    on generations for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own generations"
    on generations for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete their own generations"
    on generations for delete
    using (auth.uid() = user_id);

-- RLS Policies for flashcards
create policy "Users can view their own flashcards"
    on flashcards for select
    using (auth.uid() = user_id);

create policy "Users can insert their own flashcards"
    on flashcards for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own flashcards"
    on flashcards for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete their own flashcards"
    on flashcards for delete
    using (auth.uid() = user_id);

-- RLS Policies for generation_errors
create policy "Users can view their own generation errors"
    on generation_errors for select
    using (auth.uid() = user_id);

create policy "Users can insert their own generation errors"
    on generation_errors for insert
    with check (auth.uid() = user_id);

create policy "Users can delete their own generation errors"
    on generation_errors for delete
    using (auth.uid() = user_id); 