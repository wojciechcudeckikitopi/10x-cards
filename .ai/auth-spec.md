# Specyfikacja modułu uwierzytelniania (US-004)

## 1. ARCHITEKTURA INTERFEJSU UŻYTKOWNIKA

### 1.1 Strony i nawigacja
- `/register` (rejestracja)
- `/login` (logowanie)
- `/password-recovery` (odzyskiwanie hasła)
- `/password-reset` (reset hasła po otrzymanym mailu, token w query parametru `access_token`)

### 1.2 Layout i nawigacja
- Rozszerzyć `src/layouts/Layout.astro` oraz `src/components/TopBar.tsx` (TopBar):
  - Dla niezalogowanych: przycisk **Zaloguj się** kierujący do `/login`.
  - Dla zalogowanych: przycisk **Wyloguj się** wywołujący `POST /api/auth/logout` i przekierowujący na `/login`.
  - Reactive'na obsługa stanu sesji (useSession) dla dynamicznej zmiany przycisków.

### 1.3 Komponenty React
- `src/components/AuthForm/RegisterForm.tsx`:
  - Pola: **email**, **password**, **confirmPassword**.
  - Client-side validation: email regex, min. 8 znaków, zgodność haseł.
  - Wyświetlanie inline błędów oraz globalnych alertów.
- `src/components/AuthForm/LoginForm.tsx`:
  - Pola: **email**, **password**.
  - Walidacja non-empty i format email.
  - Globalny komunikat błędu przy nieudanym logowaniu.
- `src/components/AuthForm/PasswordRecoveryForm.tsx`:
  - Pole: **email**.
  - Obsługa potwierdzenia wysłania maila z instrukcjami.
- `src/components/AuthForm/PasswordResetForm.tsx`:
  - Pola: **newPassword**, **confirmNewPassword**.
  - Walidacja długości i zgodności.
  - Obsługa tokena z query parametru `access_token` w URL oraz błędów nieważnego/wygaśniętego tokena.

### 1.4 Rozdzielenie odpowiedzialności
- **Strony Astro**:
  - SSR, wczytanie layoutu, przekazanie props (np. token z URL) do React.
- **Komponenty React**:
  - Obsługa UI formularzy, walidacja client-side, wywołania API.
  - Zarządzanie stanem błędów i loading.

### 1.5 Walidacja i komunikaty
- **Client-side**:
  - Email: regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
  - Hasło: min. 8 znaków.
  - Confirm password: zgodność z polem password.
- **Server-side**:
  - Weryfikacja obecności i formatu pól.
  - HTTP 400 dla błędów walidacji.
  - HTTP 401 dla nieautoryzowanych.
- **Komunikaty**:
  - Inline error pod polem.
  - Globalny alert u góry formularza.

## 2. LOGIKA BACKENDOWA

### 2.1 Struktura endpointów API
- `src/pages/api/auth/register.ts`
- `src/pages/api/auth/login.ts`
- `src/pages/api/auth/logout.ts`
- `src/pages/api/auth/password-recovery.ts`
- `src/pages/api/auth/password-reset.ts`

### 2.2 Modele i dane
- Wykorzystanie tabeli `auth.users` w Supabase.
- Sesje, tokeny resetu i mechanizmy auth zarządzane przez Supabase.

### 2.3 Mechanizm walidacji danych wejściowych
- Każdy endpoint sprawdza:
  - Obecność wymaganych pól.
  - Format email i długość haseł.
- Zastosowanie guard clauses i wczesnych returnów.

### 2.4 Obsługa wyjątków
- Przechwytywanie błędów z Supabase (`error` z `supabase.auth`).
- Zwracanie ujednoliconego JSON: `{ status: 'error' | 'success', message, data? }`.
- Kody HTTP:
  - **200** – sukces,
  - **400** – błędy walidacji,
  - **401** – nieautoryzowany,
  - **500** – błędy serwera.

### 2.5 Middleware i SSR
- `src/middleware/index.ts`:
  - Sprawdzanie ciasteczek sesji Supabase.
  - Chroni ścieżki: `/dashboard`, `/study`, `/flashcards`, `/settings`, `/`.
  - Przekierowanie niezalogowanych na `/login`.
- `astro.config.mjs`:
  - Dodanie env: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
  - Rejestracja middleware w konfiguracji serwera.

## 3. SYSTEM AUTENTYKACJI

### 3.1 Konfiguracja Supabase
- `src/db/supabaseClient.ts`:
  - `createClient(SUPABASE_URL, SUPABASE_ANON_KEY)` – client-side.
- `src/db/supabaseAdmin.ts`:
  - `createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)` – serwer.

### 3.2 Operacje autoryzacji
- **Rejestracja**: `supabaseClient.auth.signUp({ email, password })`; brak wymogu weryfikacji email w tej wersji.
- **Logowanie**: `supabaseClient.auth.signInWithPassword({ email, password })`, ustawienie cookie.
- **Wylogowanie**: `supabaseClient.auth.signOut()`, usunięcie cookie.
- **Odzyskiwanie hasła**: `supabaseClient.auth.resetPasswordForEmail(email, { redirectTo: '<BASE_URL>/password-reset' })`.
- **Reset hasła**: przy wejściu na `/password-reset`, Supabase Client wykryje parametr `access_token` w URL, ustawi sesję i wywoła `supabaseClient.auth.updateUser({ password: newPassword })`; w razie nieważnego/wygaśniętego tokena zwróci HTTP 401.

### 3.3 Integracja z komponentami
- React-formularze wywołują powyższe metody.
- Po sukcesie: rejestracja/logowanie -> `/dashboard`; reset hasła -> `/login`.

---

> Specyfikacja umożliwia bezpieczne i spójne wdrożenie procesu rejestracji, logowania oraz odzyskiwania i resetu hasła, zgodnie z PRD i wytycznymi technicznymi stacku.