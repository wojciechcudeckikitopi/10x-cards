# API Endpoint Implementation Plan: GET /flashcards

## 1. Przegląd punktu końcowego

Endpoint GET /flashcards umożliwia pobranie listy fiszek przypisanych do uwierzytelnionego użytkownika. Endpoint obsługuje paginację, filtrowanie po statusie oraz sortowanie według daty utworzenia lub modyfikacji.

## 2. Szczegóły żądania

- **Metoda HTTP:** GET
- **URL:** /flashcards
- **Parametry zapytania:**
  - `page` (opcjonalny, domyślnie: 1)
  - `limit` (opcjonalny, domyślnie: 20)
  - `status` (opcjonalny, akceptowane wartości: "pending", "accepted", "rejected")
  - `sort_by` (opcjonalny, akceptowane wartości: "created_at", "updated_at")
- **Body żądania:** Brak

## 3. Wykorzystywane typy

- `FlashcardDTO`: DTO reprezentujący fiszkę (pola: id, front, back, status, source, generation_id, created_at, updated_at).
- `Pagination`: Obiekt zawierający informacje paginacyjne (page, limit, total).
- `PaginatedResponse<FlashcardDTO>`: Ogólny typ odpowiedzi zawierający listę fiszek oraz dane paginacyjne.

## 4. Szczegóły odpowiedzi

- **Sukces (200):**
  ```json
  {
    "data": [
      {
        "id": 1,
        "front": "...",
        "back": "...",
        "status": "pending",
        "source": "ai",
        "generation_id": "...",
        "created_at": "2023-01-01T12:00:00Z",
        "updated_at": "2023-01-01T12:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100
    }
  }
  ```
- **Błędy:**
  - 401 Unauthorized – brak lub niepoprawna autoryzacja
  - 400 Bad Request – nieprawidłowe parametry zapytania
  - 500 Internal Server Error – błąd po stronie serwera

## 5. Przepływ danych

1. Żądanie trafia do endpointu, gdzie najpierw odbywa się autoryzacja użytkownika za pomocą middleware (używając `supabaseClient` z `context.locals`).
2. Parametry zapytania są pobierane i weryfikowane za pomocą schematu walidacji (np. Zod) z domyślnymi wartościami dla `page` i `limit`.
3. Warstwa serwisowa (np. `flashcardService`) wykonuje zapytanie do bazy danych, filtrując fiszki według `user_id` oraz opcjonalnie według `statusu` i `sort_by`.
4. Wyniki zapytania są mapowane do struktury `FlashcardDTO` oraz opakowywane w obiekt paginacji.
5. Endpoint zwraca sformatowaną odpowiedź JSON.

## 6. Względy bezpieczeństwa

- **Autoryzacja:** Endpoint wymaga poprawnego tokena/sesji użytkownika. Używamy `supabaseClient` z `context.locals` do sprawdzenia autoryzacji.
- **Walidacja danych:** Wszystkie parametry wejściowe są walidowane przy użyciu Zod, aby zapobiec nieprawidłowym danym i potencjalnym atakom (np. SQL Injection).
- **Ograniczenie danych:** Zwracamy jedynie fiszki przypisane do uwierzytelnionego użytkownika.

## 7. Obsługa błędów

- **401 Unauthorized:** Zwracane, gdy użytkownik nie jest uwierzytelniony.
- **400 Bad Request:** Zwracane, gdy parametry zapytania nie spełniają wymagań walidacyjnych.
- **500 Internal Server Error:** Zwracane przy wystąpieniu niespodziewanych błędów na serwerze; błędy są logowane z wykorzystaniem dedykowanego systemu logowania.

## 8. Rozważenia dotyczące wydajności

- **Paginacja:** Użycie paginacji ogranicza liczbę pobieranych rekordów, co minimalizuje obciążenie bazy.
- **Indeksowanie:** Ważne jest, aby kolumny takie jak `user_id`, `status`, `created_at` i `updated_at` były odpowiednio zindeksowane w bazie danych.
- **Optymalizacja zapytań:** Używanie zapytań parametryzowanych lub ORM, aby zapewnić wydajność i bezpieczeństwo.

## 9. Etapy wdrożenia

1. **Walidacja parametrów zapytania:**
   - Stworzenie schematu walidacji (np. Zod) dla parametrów `page`, `limit`, `status` i `sort_by` z domyślnymi wartościami i ograniczeniami.
2. **Implementacja logiki w warstwie serwisowej:**
   - Dodanie lub modyfikacja istniejącego `flashcardService`, aby obsługiwał filtrowanie, sortowanie i paginację fiszek.
3. **Stworzenie endpointu:**
   - Implementacja pliku w `src/pages/api/flashcards.ts`.
   - Integracja autoryzacji użytkownika przy użyciu `supabaseClient` z `context.locals`.
   - Pobieranie, walidacja i sanitizacja parametrów zapytania.
   - Wywołanie serwisu i formatowanie odpowiedzi.
4. **Logowanie błędów:**
   - Implementacja mechanizmu logowania potencjalnych błędów (np. przy użyciu custom error types) i rejestrowanie krytycznych zdarzeń.
5. **Testy API:**
   - Przygotowanie testów jednostkowych i integracyjnych dla endpointu, obejmujących przypadki poprawnego działania, walidacji i obsługi błędów.
