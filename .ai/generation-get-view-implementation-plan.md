# API Endpoint Implementation Plan: GET /generations/:id

## 1. Przegląd punktu końcowego
Celem punktu końcowego GET /generations/:id jest umożliwienie pobrania szczegółów konkretnego rekordu generacji. Endpoint zwraca dane generacji, powiązane fiszki oraz ewentualny komunikat błędu, korzystając z bazy danych Supabase oraz walidacji danych za pomocą Zod.

## 2. Szczegóły żądania
- **Metoda HTTP:** GET
- **Struktura URL:** /generations/:id
- **Parametry:**
  - **Wymagany:** `id` (parametr ścieżki, typ: UUID)
  - **Opcjonalne:** brak
- **Request Body:** brak (ze względu na użycie metody GET)

## 3. Wykorzystywane typy
- `GenerationDTO`: Reprezentuje szczegóły rekordu generacji bez pola `user_id`.
- `GenerationDetailsDTO`: Reprezentuje rekord generacji wraz z powiązanymi fiszkami oraz opcjonalnym komunikatem błędu.
- `FlashcardDTO`: Reprezentuje pojedynczą fiszkę (zawiera wyłącznie dane przeznaczone dla klienta).

## 4. Szczegóły odpowiedzi
- **200 OK:**
  - Zwracana treść odpowiedzi zawiera obiekt typu `GenerationDetailsDTO`, łączący dane generacji, listę powiązanych fiszek oraz ewentualny komunikat błędu (null jeśli brak błędu).
- **401 Unauthorized:** Użytkownik nie jest uwierzytelniony lub posiada niewłaściwe poświadczenia.
- **404 Not Found:** Rekord generacji o podanym `id` nie został znaleziony.
- **500 Internal Server Error:** Wystąpił błąd wewnętrzny serwera podczas przetwarzania żądania.

## 5. Przepływ danych
1. Klient wysyła żądanie GET /generations/:id z poprawnym identyfikatorem generacji.
2. Middleware uwierzytelniające weryfikuje sesję użytkownika, korzystając z kontekstu Supabase.
3. Logika biznesowa (service) pobiera dane generacji z bazy, łącznie z powiązanymi fiszkami.
4. Dane są mapowane na typ `GenerationDetailsDTO` i zwracane w odpowiedzi.
5. W przypadku wykrycia błędów (brak danych, nieautoryzowany dostęp), odpowiednie kody statusu oraz komunikaty błędów są zwracane.

## 6. Względy bezpieczeństwa
- **Uwierzytelnianie:** Weryfikacja tokena uwierzytelniającego; dostęp tylko dla autoryzowanych użytkowników.
- **Autoryzacja:** Sprawdzenie, czy użytkownik ma dostęp do żądanego rekordu generacji (np. czy rekord należy do uwierzytelnionego użytkownika).
- **Ochrona danych:** Uniknięcie ujawniania poufnych danych, takich jak `user_id` czy inne wewnętrzne identyfikatory.
- **Walidacja wejścia:** Sanitizacja i walidacja parametru `id` przy użyciu narzędzi takich jak Zod, aby zapobiec atakom typu SQL Injection.

## 7. Obsługa błędów
- **401 Unauthorized:** Jeśli token uwierzytelniający jest niepoprawny lub nie został przesłany.
- **404 Not Found:** Jeśli rekord generacji o podanym `id` nie istnieje w bazie.
- **500 Internal Server Error:** W przypadku nieoczekiwanych błędów, np. błędów po stronie bazy danych. Opcjonalnie, błędy te mogą być logowane do dedykowanej tabeli (np. `generation_errors`).

## 8. Wydajność
- **Optymalizacja zapytań:** Upewnij się, że zapytania do bazy danych są zoptymalizowane, m.in. przez stosowanie indeksów na kolumnach takich jak `id` i `generation_id`.
- **Paginacja:** Jeśli liczba powiązanych fiszek jest bardzo duża, rozważ wprowadzenie paginacji.
- **Caching:** Rozważ użycie mechanizmów buforowania w przypadku wysokich obciążeń, o ile nie narusza to zasad aktualności danych.

## 9. Kroki implementacji
1. **Utworzenie pliku API endpoint:** Stwórz plik w katalogu `./src/pages/api/generations/[id].ts` zgodnie ze strukturą projektu Astro.
2. **Middleware autoryzacyjne:** Zapewnij weryfikację sesji użytkownika wykorzystując kontekst Supabase w middleware.
3. **Implementacja usługi (service):** Utwórz lub zmodyfikuj usługę np. `src/lib/services/generationService.ts` odpowiedzialną za pobieranie danych generacji oraz powiązanych fiszek z bazy.
4. **Walidacja danych:** Użyj Zod do walidacji parametru `id` oraz ewentualnych innych danych wejściowych.
5. **Logika autoryzacji:** Upewnij się, że użytkownik ma prawo dostępu do rekordu generacji.
6. **Pobieranie danych:** Wykonaj zapytanie do bazy Supabase w celu pobrania rekordu generacji i dołączenia listy fiszek powiązanych z `generation_id`.
7. **Mapowanie danych:** Przekształć pobrane dane do struktury `GenerationDetailsDTO`.
8. **Obsługa błędów:** Zaimplementuj mechanizmy obsługi błędów, zwracając odpowiednie kody statusu (401, 404, 500) oraz logując błędy w razie potrzeby.