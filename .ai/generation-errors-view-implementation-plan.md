# API Endpoint Implementation Plan: GET /generation-errors

## 1. Przegląd punktu końcowego
Opis: Endpoint umożliwia pobieranie rekordów błędów generacji dla uwierzytelnionego użytkownika. Użytkownik otrzymuje listę wpisów dotyczących problemów, które wystąpiły podczas generacji fiszek.

## 2. Szczegóły żądania
- **Metoda HTTP:** GET
- **Struktura URL:** /generation-errors
- **Parametry zapytania:**
  - **page (opcjonalny):** Numer strony (oczekiwany typ: liczba całkowita, >= 0), domyślne 0
  - **limit (opcjonalny):** Liczba rekordów na stronę (oczekiwany typ: liczba całkowita, > 0), domyślne 10
- **Request Body:** Brak

## 3. Wykorzystywane typy
- **GenerationErrorDTO:** Typ reprezentujący rekord błędu generacji (z wyłączeniem pola `user_id`). Zdefiniowany w `src/types.ts`.
- **Pagination oraz PaginatedResponse:** Typy używane do strukturyzacji odpowiedzi z metadanymi paginacji.

## 4. Szczegóły odpowiedzi
- **Kod statusu 200:** Pomyślny odczyt rekordu

**Przykładowa odpowiedź:**
```json
{
  "data": [
    {
      "id": "5",
      "generation_id": "4",
      "source_text_hash": "...",
      "source_text_length": 1500,
      "error_message": "Error details",
      "llm_model": "gpt-4",
      "created_at": "2023-01-01T12:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5
  }
}
```

**Błędy:**
- 401 Unauthorized – Użytkownik nie jest uwierzytelniony
- 400 Bad Request – Nieprawidłowe parametry zapytania
- 500 Internal Server Error – Błąd po stronie serwera

## 5. Przepływ danych
1. Klient wysyła zapytanie GET na `/generation-errors` z odpowiednimi parametrami `page` i `limit`.
2. Middleware autoryzacyjne weryfikuje tożsamość użytkownika i przekazuje `user_id` do warstwy serwisowej.
3. Warstwa serwisu wywołuje zapytanie do bazy danych, filtrując rekordy w tabeli `generation_errors` wg `user_id` i stosując paginację (OFFSET, LIMIT).
4. Dane z bazy są mapowane na typ `GenerationErrorDTO`, wykluczając pole `user_id`.
5. Odpowiedź zawiera listę błędów oraz metadane paginacji i jest wysyłana do klienta.

## 6. Względy bezpieczeństwa
- **Autoryzacja:** Endpoint dostępny tylko dla uwierzytelnionych użytkowników. Weryfikacja odbywa się na poziomie middleware.
- **Walidacja danych wejściowych:** Parametry `page` i `limit` muszą być pozytywnymi liczbami całkowitymi, weryfikacja przy pomocy np. Zod.
- **Ochrona danych:** Upewnić się, że użytkownik widzi tylko swoje rekordy, filtrując dane wg `user_id`.
- **SQL Injection:** Użycie przygotowanych zapytań lub ORM zapobiega atakom SQL Injection.

## 7. Obsługa błędów
- **401 Unauthorized:** Gdy użytkownik nie jest autoryzowany.
- **400 Bad Request:** Gdy parametry zapytania są nieprawidłowe (np. nie liczby, liczby mniejsze lub równe 0).
- **500 Internal Server Error:** W przypadku błędów po stronie bazy danych lub innych nieoczekiwanych wyjątków.
- **Logowanie błędów:** Każdy błąd powinien być odpowiednio zalogowany w systemie logowania aplikacji.

## 8. Rozważania dotyczące wydajności
- **Paginacja:** Użycie LIMIT i OFFSET dla optymalnego pobierania danych.
- **Indeksowanie:** Zapewnienie indeksów na polach `user_id` oraz `created_at` dla przyspieszenia zapytań.
- **Cache:** Rozważenie pamięci podręcznej, jeśli rekordy błędów generacji są często odczytywane, ale rzadko modyfikowane.

## 9. Kroki implementacji
1. **Stworzenie endpointu:** Utworzyć plik API endpointu (np. `./src/pages/api/generation-errors.ts`) lub zgodnie z obowiązującą strukturą projektu.
2. **Autoryzacja:** Zaimplementować middleware uwierzytelniające, przetwarzające nagłówki i wERYfikujące token, a następnie przekazujące `user_id` do kontekstu.
3. **Walidacja parametrów:** Użyć Zod do walidacji parametrów `page` i `limit`.
4. **Logika serwisowa:** Wyodrębnić logikę pobierania danych do nowej lub istniejącej funkcji serwisowej w `./src/lib/services`:
   - Filtrowanie rekordów z tabeli `generation_errors` na podstawie `user_id`.
   - Zastosowanie paginacji.
5. **Mapowanie danych:** Przekształcić rekordy bazy danych do formatu `GenerationErrorDTO` (wykluczając `user_id`).
6. **Budowa odpowiedzi:** Zbudować strukturę JSON odpowiedzi, zawierającą dane i metadane paginacji.
7. **Obsługa błędów:** Dodać odpowiednie mechanizmy obsługi błędów dla stanów 400, 401 i 500.