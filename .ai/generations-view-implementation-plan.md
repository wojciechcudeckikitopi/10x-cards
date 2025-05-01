# API Endpoint Implementation Plan: POST /generations

## 1. Przegląd punktu końcowego
Endpoint służy do inicjacji procesu generowania fiszek przez AI. Użytkownik przesyła tekst źródłowy, który zostanie poddany walidacji oraz przetworzony do utworzenia rekordu generacji w bazie danych. Początkowo fiszki otrzymują status "pending". Proces może być rozwinięty o asynchroniczne wywołanie usługi AI, a ewentualne błędy są logowane do tabeli błędów.

## 2. Szczegóły żądania
- **Metoda HTTP:** POST
- **Endpoint:** /generations
- **Parametry:**
  - Wymagane: 
    - `source_text` (ciąg znaków o długości od 1000 do 10000 znaków)
  - Opcjonalne: brak
- **Request Body:**
  ```json
  {
    "source_text": "Text input between 1000 and 10000 characters"
  }
  ```

## 3. Wykorzystywane typy
- **Command Model:** `GenerateFlashcardsCommand` (wymaga właściwości `source_text`)
- **DTO dla odpowiedzi:** `GenerationCreateResponseDTO` zawierający:
  - `generation_id`: string
  - `flashcards`: Array of `FlashcardProposalDTO` (każdy z propozycjami fiszek, np. z początkowym statusem "pending")
  - `generated_count`: number
- **Dodatkowe typy:**
  - `FlashcardProposalDTO` dla pojedynczej propozycji fiszki
  - Typy związane z tabelą Generations w bazie

## 4. Szczegóły odpowiedzi
- **Sukces (201 Created):**
  ```json
  {
    "generation_id": "string",
    "generated_count": 0,
    "flashcards": []
  }
  ```
- **Błędy:**
  - 400 Bad Request – niepoprawne dane (np. za krótki lub za długi tekst)
  - 401 Unauthorized – brak autoryzacji
  - 500 Internal Server Error – błąd na serwerze (np. awaria bazy danych)

## 5. Przepływ danych
1. Klient wysyła żądanie POST z `source_text` do endpointa /generations.
2. Middleware i autoryzacja sprawdzają uprawnienia użytkownika (np. z wykorzystaniem `supabase` z `context.locals`).
3. Walidacja danych wejściowych:
   - Sprawdzenie, czy `source_text` jest obecny
   - Weryfikacja długości tekstu (1000-10000 znaków) przy użyciu narzędzia walidacyjnego (np. Zod)
4. Obliczany jest hash tekstu (source_text_hash) oraz zapisywana jest długość (`source_text_length`).
5. Tworzony jest rekord w tabeli Generations przy użyciu danych: `user_id`, `source_text_hash`, `source_text_length`, domyślne wartości dla `generated_count` itd.
6. Zwracana jest odpowiedź 201 z danymi dotyczącymi nowo utworzonej generacji.
7. Opcjonalnie: Asynchroniczne wywołanie procesu generowania fiszek przez AI, z obsługą błędów (logowanie do tabeli Generation Errors) w przypadku niepowodzenia.

## 6. Względy bezpieczeństwa
- **Autoryzacja:** Endpoint jest dostępny tylko dla uwierzytelnionych użytkowników (sprawdzenie przez `context.locals` i Supabase).
- **Walidacja:** Użycie Zod do walidacji danych wejściowych, aby wyłapać nieprawidłowe dane przed operacjami bazodanowymi.
- **Bezpieczeństwo danych:** Użycie mechanizmów ochrony przed SQL Injection i zabezpieczenie operacji na poziomie bazy (np. poprzez przygotowane zapytania).
- **Rate Limiting:** Rozważ wdrożenie ograniczeń liczby żądań dla endpointa.

## 7. Obsługa błędów
- **400 Bad Request:**
  - Brak `source_text` lub nieprawidłowa długość tekstu.
- **401 Unauthorized:**
  - Użytkownik nie jest zalogowany lub brak poprawnego tokenu.
- **500 Internal Server Error:**
  - Błąd podczas komunikacji z bazą danych lub niespodziewany wyjątek.
- **Logowanie błędów:**
  - Każdy błąd podczas przetwarzania powinien być logowany, a szczególnie błędy związane z asynchronicznym procesem generacji mogą być zapisywane w tabeli Generation Errors.

## 8. Rozważania dotyczące wydajności
- Weryfikacja danych powinna odbywać się przed wykonaniem operacji na bazie.
- Indeksy na kolumnach takich jak `user_id` oraz `source_text_hash` mogą poprawić wydajność zapytań.
- Asynchroniczne przetwarzanie przez kolejki zadań może rozłożyć obciążenie operacji generacji fiszek.

## 9. Etapy wdrożenia
1. **Utworzenie schematu walidacyjnego:**
   - Implementacja walidacji `source_text` (długość między 1000 a 10000 znaków) przy użyciu Zod.
2. **Tworzenie endpointa:**
   - Utworzenie pliku API (np. `src/pages/api/generations.ts`) obsługującego metodę POST.
3. **Autoryzacja:**
   - Sprawdzenie, czy użytkownik jest uwierzytelniony przy pomocy `context.locals` i Supabase.
4. **Logika biznesowa:**
   - Obliczenie hash'a tekstu i długości, a następnie wstawienie rekordu w tabeli Generations.
5. **Generowanie odpowiedzi:**
   - Zwrócenie odpowiedzi z kodem 201 oraz danymi nowej generacji.
6. **Asynchroniczne wywołanie AI:**
   - Opcjonalne wdrożenie mechanizmu kolejkowego do przetwarzania generowania fiszek przez AI i obsługa błędów.
7. **Obsługa błędów:**
   - Implementacja mechanizmów try/catch oraz logowania błędów, z odpowiednim zwracaniem kodów HTTP.