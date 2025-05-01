# API Endpoint Implementation Plan: GET /generations

## 1. Przegląd punktu końcowego
Ten endpoint umożliwia pobranie listy rekordów generacji (generation requests) należących do uwierzytelnionego użytkownika. Obsługuje paginację oraz opcjonalne filtry, takie jak zakres dat czy model LLM użyty do generacji.

## 2. Szczegóły żądania
- **Metoda HTTP:** GET
- **Ścieżka URL:** /generations
- **Parametry zapytania:**
  - **page** (opcjonalny): Numer bieżącej strony, domyślnie 0
  - **limit** (opcjonalny): Liczba rekordów na stronę, domyślnie 10
  - **Opcjonalne filtry:**
    - **date:** Filtr według zakresu dat.
    - **llm_model:** Filtr według modelu LLM (np. "gpt-4").
- **Request Body:** Brak

## 3. Wykorzystywane typy
- **GenerationDTO:** Reprezentuje rekord generacji zwracany przez API (bez wrażliwych informacji o użytkowniku).
- **GenerationDetailsDTO:** Szczegółowy rekord generacji zawierający dodatkowe dane, takie jak powiązane fiszki.
- **Pagination:** Typ zawierający metadane paginacji (page, limit, total).
- **Zod Schemas:** Do walidacji parametrów zapytania.

## 4. Szczegóły odpowiedzi
- **Status 200 (OK):**
  - Struktura odpowiedzi:
    ```json
    {
      "data": [
        {
          "id": 10,
          "source_text_hash": "...",
          "source_text_length": 1500,
          "generated_count": 5,
          "accepted_unedited_count": 3,
          "accepted_edited_count": 1,
          "llm_model": "gpt-4",
          "generation_duration": 120,
          "generated_at": "2023-01-01T12:00:00Z",
          "updated_at": "2023-01-01T12:05:00Z"
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 20,
        "total": 50
      }
    }
    ```
- **Błędy:**
  - 401 Unauthorized: Użytkownik nie jest uwierzytelniony.
  - 400 Bad Request: Nieprawidłowe lub brak wymaganych parametrów.
  - 500 Internal Server Error: Błąd po stronie serwera.

## 5. Przepływ danych
1. Użytkownik wysyła żądanie GET do endpointu `/generations` z odpowiednimi parametrami zapytania.
2. Middleware weryfikuje uwierzytelnienie użytkownika (np. poprzez `context.locals` i supabaseClient).
3. Warstwa serwisowa waliduje parametry zapytania przy użyciu Zod i przygotowuje zapytanie do bazy danych.
4. Zapytanie jest wykonywane na bazie danych Supabase w celu pobrania rekordów generacji powiązanych z `user_id` użytkownika.
5. Wyniki są mapowane do odpowiednich DTO, a metadane paginacji są obliczane.
6. Ostatecznie, zwracana jest struktura JSON zawierająca dane generacji oraz informacje o paginacji.

## 6. Względy bezpieczeństwa
- **Uwierzytelnienie:** Sprawdzenie sesji użytkownika przed przetwarzaniem żądania.
- **Autoryzacja:** Dane zwracane są tylko dla bieżącego, uwierzytelnionego użytkownika.
- **Walidacja:** Użycie Zod do walidacji parametrów zapytania, aby zabezpieczyć przed atakami typu injection.
- **Minimalizacja danych:** Zwracanie tylko tych pól, które są niezbędne, w celu ochrony wrażliwych informacji.

## 7. Obsługa błędów
- **400 Bad Request:** Zwrot szczegółowych komunikatów błędów dla nieprawidłowych lub brakujących parametrów.
- **401 Unauthorized:** Błąd przy braku lub nieprawidłowym uwierzytelnieniu użytkownika.
- **500 Internal Server Error:** Logowanie błędów serwera i zwracanie ogólnego komunikatu błędu.
- **404 Not Found:** (Opcjonalnie) Zwrot pustej tablicy danych, jeśli nie znaleziono rekordów pasujących do filtrów.

## 8. Wydajność
- **Paginacja:** Używanie limitu i offsetu w zapytaniu, aby zoptymalizować pobieranie danych.
- **Indeksy:** Zapewnienie indeksów na kolumnach używanych do filtrowania, takich jak `generated_at` i `llm_model`.
- **Optymalizacja zapytań:** Zwracanie wyłącznie niezbędnych pól oraz rozważenie ewentualnego cachowania wyników dla popularnych zapytań.

## 9. Etapy wdrożenia
1. **Utworzenie endpointu:** Dodanie nowego pliku API w `src/pages/api` dla ścieżki `/generations` z metodą GET.
2. **Middleware uwierzytelnienia:** Wdrożenie lub wykorzystanie istniejącego middleware do weryfikacji sesji użytkownika.
3. **Walidacja:** Implementacja walidacji parametrów zapytania przy użyciu Zod.
4. **Warstwa serwisowa:** Utworzenie funkcji serwisowej w `src/lib/services` odpowiedzialnej za komunikację z bazą danych Supabase.
5. **Mapowanie danych:** Konwersja wyników zapytania do odpowiednich DTO (np. GenerationDTO).
6. **Implementacja paginacji:** Obliczenie oraz zwrócenie metadanych paginacji w odpowiedzi.
7. **Obsługa błędów i logowanie:** Dodanie mechanizmów obsługi błędów oraz logowania incydentów.