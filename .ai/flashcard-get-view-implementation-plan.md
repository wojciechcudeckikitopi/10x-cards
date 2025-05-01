# API Endpoint Implementation Plan: GET /flashcards/:id

## 1. Przegląd punktu końcowego
Ten endpoint umożliwia pobranie szczegółowych informacji o konkretnej fiszce. Endpoint służy do wyświetlania wszystkich danych fiszki, takich jak front, back, status, source, generation_id oraz daty utworzenia i aktualizacji. Usługa będzie działać w oparciu o Supabase jako backend i Astro jako framework serwerowy.

## 2. Szczegóły żądania
- **Metoda HTTP:** GET
- **Struktura URL:** /flashcards/:id
- **Parametry:**
  - **Wymagane:**
    - `id` – identyfikator fiszki (liczba całkowita, odpowiada kolumnie `id` w bazie danych)
  - **Opcjonalne:** Brak
- **Request Body:** Brak

## 3. Wykorzystywane typy
- `FlashcardDTO` – reprezentuje strukturę danych fiszki zwracaną przez endpoint (definiowany w `src/types.ts`).
- (Ewentualnie) Schemat walidacji wejścia za pomocą biblioteki Zod, do weryfikacji formatu parametru `id`.

## 4. Szczegóły odpowiedzi
- **200 OK:** Żądanie zakończone sukcesem, zwraca obiekt JSON z danymi fiszki:
  ```json
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
  ```
- **401 Unauthorized:** Użytkownik nie jest zalogowany lub brak ważnej sesji.
- **404 Not Found:** Nie znaleziono fiszki o podanym identyfikatorze lub użytkownik nie ma do niej dostępu.
- **500 Internal Server Error:** Wystąpił błąd po stronie serwera.

## 5. Przepływ danych
1. Klient wysyła żądanie GET na endpoint `/flashcards/:id` z odpowiednimi nagłówkami autoryzacyjnymi.
2. Endpoint pobiera parametr `id` z URL i waliduje jego poprawność (np. jako liczba całkowita) przy użyciu Zod lub prostej walidacji.
3. Weryfikacja autoryzacji: Pobranie sesji użytkownika z `context.locals.supabase` i sprawdzenie, czy użytkownik jest zalogowany.
4. Zapytanie do bazy danych (tabela `flashcards`): wyszukiwanie fiszki o podanym `id`, dodatkowo sprawdzając, czy `user_id` fiszki zgadza się z identyfikatorem aktualnego użytkownika.
5. Jeśli fiszka zostanie znaleziona, dane są mapowane do modelu `FlashcardDTO`.
6. Endpoint zwraca dane fiszki z kodem 200 lub odpowiedni błąd (401/404).

## 6. Względy bezpieczeństwa
- **Uwierzytelnianie:** Endpoint wymaga ważnej sesji użytkownika. Wykorzystywany jest `supabase` z context.locals, który zapewnia autoryzację.
- **Autoryzacja:** Sprawdzenie, czy `user_id` fiszki odpowiada bieżącemu użytkownikowi, aby zapobiec nieautoryzowanemu dostępowi.
- **Walidacja wejścia:** Parametr `id` musi być liczbą; użycie Zod lub dedykowanej walidacji pomoże w walidacji i ochronie przed wstrzyknięciami.
- **Ograniczenia dostępu:** Zwrócenie odpowiedniego kodu statusu (401 lub 404) w przypadku naruszenia uprawnień.

## 7. Obsługa błędów
- **401 Unauthorized:** Jeśli użytkownik nie jest zalogowany lub sesja wygasła.
- **404 Not Found:** Jeśli nie znaleziono fiszki o podanym `id` lub fiszka nie należy do użytkownika.
- **500 Internal Server Error:** Ucatchowanie nieoczekiwanych błędów; logowanie błędów przy użyciu systemu logowania i zwrócenie komunikatu o błędzie serwera.

## 8. Rozważania dotyczące wydajności
- **Indeksowanie:** Zapewnienie, że kolumny `id` oraz `user_id` są odpowiednio indeksowane, aby zoptymalizować zapytania.
- **Cache:** Rozważenie mechanizmów cache'owania dla często pobieranych fiszek, jeśli wystąpią problemy z wydajnością.
- **Optymalizacja zapytań:** Korzystanie z selektywnych zapytań w celu minimalizacji obciążenia bazy danych.

## 9. Etapy wdrożenia
1. Utworzenie endpointu API: Stworzenie pliku w `./src/pages/api/flashcards/[id].ts` zgodnie z konwencją Astro.
2. Implementacja logiki autoryzacji: Pobranie `supabaseClient` z `context.locals` i weryfikacja sesji użytkownika.
3. Walidacja parametru `id`: Zaimplementowanie walidacji (np. za pomocą Zod) aby zapewnić, że `id` jest poprawnym identyfikatorem.
4. Integracja z bazą danych: Wykonanie zapytania do tabeli `flashcards` filtrowanego po `id` oraz `user_id`.
5. Mapowanie danych: Konwersja danych z bazy na model `FlashcardDTO`.
6. Obsługa odpowiedzi: Zwrócenie odpowiedzi z kodem 200 lub odpowiednich błędów (401, 404, 500).