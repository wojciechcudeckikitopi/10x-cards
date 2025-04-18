# Schemat bazy danych dla 10x-Cards

## 1. Tabele

### 1.1. Users
Ta tabela jest zarządzana przez Supabase Auth.

- **id**: UUID PRIMARY KEY
- **email**: VARCHAR NOT NULL UNIQUE
- **created_at**: TIMESTAMPTZ NOT NULL DEFAULT now()
- **encrypted_password**: VARCHAR NOT NULL
- **confirmed_at**: TIMESTAMPTZ

---

### 1.2. Flashcards
Tabela fiszek zawiera dane fiszek z ograniczeniami na długość treści oraz typy ENUM dla źródła i statusu.

- **id**: BIGSERIAL PRIMARY KEY
- **user_id**: UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
- **front**: VARCHAR(200) NOT NULL
- **back**: VARCHAR(500) NOT NULL
- **source**: flashcard_source NOT NULL
- **status**: flashcard_status NOT NULL
- **generation_id**: UUID NOT NULL REFERENCES generations(id)
- **created_at**: TIMESTAMPTZ NOT NULL DEFAULT now()
- **updated_at**: TIMESTAMPTZ NOT NULL DEFAULT now()

**Typy ENUM:**

```sql
CREATE TYPE flashcard_source AS ENUM ('ai', 'manual', 'ai-edited');
CREATE TYPE flashcard_status AS ENUM ('pending', 'accepted', 'rejected');
```

---

### 1.3. Generations
Tabela przechowująca informacje o wygenerowanych fiszkach, wraz z danymi źródłowymi oraz statystykami.

- **id**: BIGSERIAL PRIMARY KEY
- **user_id**: UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
- **source_text_hash**: TEXT NOT NULL
- **source_text_length**: INTEGER NOT NULL CHECK (source_text_length BETWEEN 1000 AND 10000)
- **generated_count**: INTEGER NOT NULL DEFAULT 0
- **accepted_unedited_count**: INTEGER NULLABLE
- **accepted_edited_count**: INTEGER NULLABLE
- **llm_model**: TEXT NOT NULL
- **generation_duration**: INTEGER
- **generated_at**: TIMESTAMPTZ NOT NULL DEFAULT now()
- **updated_at**: TIMESTAMPTZ NOT NULL DEFAULT now()

---

### 1.4. Generation Errors
Tabela błędów generowania fiszek zawiera informacje o problemach podczas generacji.

- **id**: BIGSERIAL PRIMARY KEY
- **user_id**: UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
- **source_text_hash**: TEXT NOT NULL
- **source_text_length**: INTEGER NOT NULL CHECK (source_text_length BETWEEN 1000 AND 10000)
- **error_message**: TEXT NOT NULL
- **llm_model**: TEXT NOT NULL
- **created_at**: TIMESTAMPTZ NOT NULL DEFAULT now()


## 2. Relacje między tabelami

- Jeden użytkownik (users) może posiadać wiele rekordów w tabelach:
  - **Flashcards** (relacja 1:N poprzez `user_id`)
  - **Generations** (relacja 1:N poprzez `user_id`)
  - **Generation Errors** (relacja 1:N poprzez `user_id`)


## 3. Indeksy

- Indeks na kolumnie `user_id` w tabelach: Flashcards, Generations, Generation Errors.
- Indeks na kolumnie `status` w tabeli Flashcards dla optymalizacji zapytań filtrowania.


## 4. Zasady PostgreSQL (RLS)

Dla tabel **Flashcards**, **Generations** oraz **Generation Errors** wdrożone zostaną zasady Row-Level Security, gwarantujące, że użytkownik ma dostęp tylko do swoich danych. Przykładowa polityka RLS:

```sql
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User access only" ON flashcards
  FOR ALL
  USING (user_id = current_setting('app.current_user_id')::uuid);
```

Podobne polityki zostaną wdrożone dla tabel `generations` oraz `generation_errors`.