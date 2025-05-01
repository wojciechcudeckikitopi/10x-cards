# API Endpoint Implementation Plan: DELETE /flashcards/:id

## 1. Przegląd punktu końcowego
Endpoint DELETE /flashcards/:id umożliwia usunięcie fiszki na podstawie jej identyfikatora. Przed wykonaniem operacji następuje walidacja autoryzacji użytkownika, a następnie sprawdzanie istnienia rekordu. W przypadku pomyślnego usunięcia, zwracany jest komunikat potwierdzający.

## 2. Szczegóły żądania
- Metoda HTTP: DELETE
- Struktura URL: /flashcards/:id
- Parametry:
  - Wymagane: 
    - id – identyfikator fiszki (typ może być BIGSERIAL lub UUID, zgodny z definicją bazy)
- Request Body: brak

## 3. Wykorzystywane typy
- DTO:
  - DeleteResponseDTO – reprezentuje odpowiedź potwierdzającą usunięcie fiszki.
- Dodatkowe elementy:
  - Parametr id przekazany w URL

## 4. Szczegóły odpowiedzi
- HTTP 200: Komunikat potwierdzający usunięcie, np. { "message": "Flashcard deleted successfully" }
- HTTP 401: Unauthorized – użytkownik nieautoryzowany
- HTTP 404: Not Found – fiszka o podanym id nie została znaleziona
- HTTP 500: Internal Server Error – błąd po stronie serwera

## 5. Przepływ danych
1. Klient wysyła żądanie DELETE do /flashcards/:id.
2. Middleware autoryzacji weryfikuje token użytkownika (supabase w context.locals).
3. Endpoint waliduje parametr id wykorzystując np. schemat Zod.
4. Warstwa serwisowa (Flashcards Service) wykonuje operację usunięcia rekordu z bazy danych przez zapytanie DELETE do tabeli flashcards.
5. Jeśli rekord zostanie znaleziony i usunięty, serwis zwraca komunikat sukcesu.
6. Jeśli rekord nie istnieje, zwracany jest błąd 404.
7. Wszelkie niespodziewane błędy przekładają się na odpowiedź 500.

## 6. Względy bezpieczeństwa
- Autoryzacja: Endpoint wymaga weryfikacji tokena autoryzacyjnego (np. z supabase w context.locals) i sprawdzenia uprawnień użytkownika do usunięcia danej fiszki.
- Walidacja danych wejściowych: Weryfikacja formatu parametru id za pomocą Zod lub innego narzędzia walidacji.
- Unikanie ataków: Zapewnienie, że użytkownik może usuwać jedynie swoje fiszki.

## 7. Obsługa błędów
- 401 Unauthorized: Brak lub niepoprawny token autoryzacyjny.
- 404 Not Found: Brak fiszki o podanym id.
- 500 Internal Server Error: Niespodziewane błędy (np. problemy z bazą danych). Wszystkie krytyczne błędy powinny być logowane.

## 8. Rozważania dotyczące wydajności
- Upewnienie się, że operacja usuwania wykorzystuje indeksowane pole id w tabeli flashcards, co pozwoli na szybkie wyszukiwanie rekordu.
- Wykorzystanie istniejącego puli połączeń do bazy danych (np. przy użyciu Supabase) w celu minimalizacji opóźnień.
- Monitorowanie wydajności operacji usuwania w przypadku dużej liczby żądań.

## 9. Etapy wdrożenia
1. Utworzenie walidacji parametru id za pomocą Zod.
2. Integracja middleware autoryzacji w celu weryfikacji tokena i uprawnień użytkownika.
3. Utworzenie serwisu (Flashcards Service), który będzie zawierał logikę biznesową obsługującą operację usuwania fiszki.
4. Implementacja operacji usunięcia fiszki w bazie danych przy użyciu Supabase (DELETE query na tabeli flashcards).
5. Implementacja zwracania odpowiednich komunikatów i kodów HTTP (200, 401, 404, 500).
6. Dodanie logiki do logowania błędów.