# API Endpoint Implementation Plan: PUT /flashcards/:id

## 1. Przegląd punktu końcowego

Endpoint służy do aktualizacji istniejącej fiszki. Umożliwia edycję tekstu z przodu i z tyłu, a w przypadku fiszek generowanych przez AI także aktualizację statusu. Kluczowe funkcjonalności obejmują walidację danych wejściowych, autoryzację użytkownika oraz aktualizację rekordu w bazie danych.

## 2. Szczegóły żądania

- **Metoda HTTP:** PUT
- **Struktura URL:** /flashcards/:id (gdzie `:id` to identyfikator fiszki)
- **Parametry:**
  - **Wymagane:**
    - Parametr ścieżki: `id` (identyfikator fiszki)
  - **Opcjonalne (w treści żądania):**
    - `front`: Tekst z przodu fiszki (max 200 znaków)
    - `back`: Tekst z tyłu fiszki (max 500 znaków)
    - `status`: Opcjonalny status, wymagany dla fiszek generowanych przez AI, przyjmujący jedną z wartości: "accepted" lub "rejected"
- **Body (JSON):**
  ```json
  {
    "front": "Updated text (max 200 characters)",
    "back": "Updated text (max 500 characters)",
    "status": "accepted"
  }
  ```

## 3. Wykorzystywane typy

- **UpdateFlashcardDTO:** Używany do walidacji danych aktualizacji, zawiera opcjonalne pola `front`, `back` oraz `status`.
- **FlashcardDTO:** Reprezentacja fiszki zwracanej w odpowiedzi.

## 4. Szczegóły odpowiedzi

- **Sukces (200 OK):** Zwraca zaktualizowaną fiszkę w formacie `FlashcardDTO`.
- **Błędy:**
  - **400 Bad Request:** Nieprawidłowe dane wejściowe (np. przekroczenie limitu znaków lub niepoprawny status)
  - **401 Unauthorized:** Użytkownik nie jest uwierzytelniony
  - **404 Not Found:** Fiszka o podanym identyfikatorze nie istnieje
  - **500 Internal Server Error:** Błąd serwera

## 5. Przepływ danych

1. Klient wysyła żądanie PUT do endpointu wraz z identyfikatorem fiszki oraz ewentualnymi danymi do aktualizacji.
2. Endpoint waliduje dane wejściowe:
   - Sprawdza długość pola `front` (maks. 200 znaków)
   - Sprawdza długość pola `back` (maks. 500 znaków)
   - Jeśli podany, waliduje, czy `status` jest "accepted" lub "rejected"
3. Autentykacja i autoryzacja:
   - Używa kontekstu `supabase` aby upewnić się, że użytkownik jest uwierzytelniony.
   - Weryfikuje, czy fiszka należy do aktualnie zalogowanego użytkownika
4. Aktualizacja rekordu w bazie danych.
5. Zwrócenie odpowiedzi z zaktualizowaną fiszką lub odpowiednim komunikatem o błędzie.

## 6. Względy bezpieczeństwa

- Użycie mechanizmu uwierzytelniania Supabase i weryfikacja użytkownika.
- Walidacja danych wejściowych przy użyciu bibliotek takich jak `zod` dla spójności i bezpieczeństwa.
- Uniknięcie możliwości SQL Injection poprzez korzystanie z interfejsu Supabase.
- Ograniczenie aktualizacji tylko do pól modyfikowalnych oraz weryfikacja własności fiszki.

## 7. Obsługa błędów

- Walidacja danych wejściowych: Zwracanie błędu 400 w przypadku niepoprawnych danych.
- Brak autoryzacji: Zwracanie błędu 401.
- Nie znaleziono rekordu: Zwracanie błędu 404.
- Błędy serwera: Logowanie błędów oraz zwrócenie błędu 500 dla nieoczekiwanych problemów.
- Dokumentacja i rejestrowanie błędów do ewentualnej analizy w przyszłości (np. logi, dashboard).

## 8. Rozważania dotyczące wydajności

- Operacja aktualizacji dotyczy pojedynczej fiszki, więc operacja bazodanowa jest lekka.
- Indeks na kolumnie `id` zapewnia szybkie wyszukiwanie rekordu.

## 9. Etapy wdrożenia

1. Utworzenie pliku endpointu w katalogu `./src/pages/api/flashcards/[id].ts`.
2. Implementacja walidacji danych wejściowych przy użyciu `zod` lub innej biblioteki.
3. Pobranie rekordu fiszki z bazy danych oraz weryfikacja autoryzacji użytkownika.
4. Aktualizacja rekordu za pomocą klienta Supabase.
5. Implementacja odpowiedzi z kodami statusów 200, 400, 401, 404, 500.
