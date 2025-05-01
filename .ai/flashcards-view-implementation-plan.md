# API Endpoint Implementation Plan: POST /flashcards

## 1. Przegląd punktu końcowego
Endpoint POST /flashcards służy do tworzenia jednej lub wielu fiszek. Umożliwia dodawanie fiszek zarówno tworzonych ręcznie, jak i generowanych przez AI (typy "ai" oraz "ai-edited"). Endpoint przyjmuje tablicę obiektów fiszek, waliduje ich długość oraz typy i zapisuje je w bazie danych, przypisując właściwe identyfikatory i znaczniki czasowe.

## 2. Szczegóły żądania
- **Metoda HTTP:** POST
- **Struktura URL:** /flashcards
- **Parametry:**
  - **Wymagane:**
    - `flashcards` (array of objects) – lista fiszek do zapisania
      - Każdy obiekt musi zawierać:
        - `front`: tekst z przodu fiszki (max 200 znaków)
        - `back`: tekst z tyłu fiszki (max 500 znaków)
        - `source`: źródło fiszki (dozwolone wartości: "manual", "ai", "ai-edited")
  - **Opcjonalne:**
    - `generation_id`: identyfikator generacji (występuje, jeśli fiszka jest związana z wygenerowaną fiszką przez AI)

### Przykładowe ciało żądania
```json
{
  "flashcards": [
    {
      "front": "Przykładowy tekst frontu",
      "back": "Przykładowy tekst tyłu",
      "source": "manual",
      "generation_id": "opcjonalny-id-generacji"
    }
  ]
}
```

## 3. Wykorzystywane typy
- **DTO i Command Modele:**
  - `CreateFlashcardDTO` – pojedyncza fiszka do utworzenia (wymaga pola `front`, `back`, `source`, opcjonalnie `generation_id`)
  - `CreateFlashcardsCommand` – obiekt zawierający tablicę fiszek do utworzenia
  - `FlashcardDTO` – zwracany obiekt fiszki, zawierający między innymi przypisany identyfikator i znaczniki czasowe

## 4. Szczegóły odpowiedzi
- **Status 201 Created:**
  - Zwraca stworzone fiszki z przypisanymi identyfikatorami oraz informacjami o datach utworzenia i aktualizacji
- **Statusy błędów:**
  - 400 Bad Request – w przypadku niezgodności z walidacją (np. przekroczenie limitów znaków lub błędny format danych)
  - 401 Unauthorized – w przypadku braku autoryzacji
  - 500 Internal Server Error – w przypadku błędów po stronie serwera

## 5. Przepływ danych
1. Klient wysyła żądanie POST na endpoint `/flashcards` zawierające ciało żądania.
2. Warstwa middleware w Astro sprawdza autentykację i autoryzację użytkownika, korzystając z `context.locals.supabase`.
3. Payload jest walidowany przy użyciu schematu (np. Zod) sprawdzającego:
   - Długość `front` (maks. 200 znaków)
   - Długość `back` (maks. 500 znaków)
   - Prawidłowość wartości `source`
   - Ewentualną obecność i format `generation_id`
4. Po pozytywnej walidacji, logika biznesowa (umieszczona w serwisie, np. `src/lib/services/flashcards.ts`) wykonuje wstawienie danych do bazy Supabase.
5. W przypadku udanego zapisu, serwis zwraca utworzone rekordy, które endpoint przekazuje klientowi z kodem 201.

## 6. Względy bezpieczeństwa
- **Autoryzacja:** Sprawdzenie tożsamości użytkownika używając `context.locals.supabase`.
- **Walidacja wejściowa:** Użycie Zod lub innej biblioteki walidacyjnej do sprawdzenia poprawności danych wejściowych, zapobiegające atakom typu injection.
- **Ograniczenia danych:** Zapewnienie, że pola `front` i `back` nie przekraczają określonej liczby znaków, co chroni przed nadmiernym obciążeniem bazy.
- **Monitoring błędów:** Rejestrowanie ewentualnych błędów do systemu logowania lub tabeli błędów, aby umożliwić przyszłą analizę problemów.

## 7. Obsługa błędów
- **400 Bad Request:** W przypadku niepoprawnych danych wejściowych (np. błędna długość lub niepoprawny typ `source`).
- **401 Unauthorized:** Jeśli użytkownik nie jest zalogowany lub nie ma odpowiednich uprawnień.
- **500 Internal Server Error:** W przypadku awarii bazy danych lub innych problemów technicznych.

Każdy przypadek błędu powinien być rejestrowany z odpowiednimi danymi diagnostycznymi, aby umożliwić szybkie reagowanie.

## 8. Rozważenia dotyczące wydajności
- **Batch Insert:** Wykorzystanie możliwości wsadowego wstawiania danych, aby zminimalizować liczbę zapytań do bazy danych.
- **Indeksowanie:** Upewnienie się, że kluczowe kolumny (np. `user_id`, `generation_id`) są odpowiednio zindeksowane w bazie danych.
- **Optymalizacja walidacji:** Walidacja powinna być wykonywana na poziomie serwera przed wysłaniem żądania do bazy danych.

## 9. Etapy wdrożenia
1. **Definicja schematu walidacji:** Utworzenie schematu walidacji przy użyciu Zod, uwzględniającego ograniczenia pól `front`, `back`, `source` oraz opcjonalny `generation_id`.
2. **Implementacja endpointu:** Utworzenie pliku endpointa w katalogu `./src/pages/api/flashcards.ts`.
3. **Logika autoryzacji:** Dodanie middleware lub logiki w endpointzie do sprawdzania tożsamości użytkownika.
4. **Integracja z serwisem:** Wyodrębnienie logiki biznesowej do serwisu (np. `src/lib/services/flashcards.ts`), który będzie zarządzał operacją wstawiania fiszek do bazy.
5. **Obsługa błędów:** Implementacja mechanizmów obsługi błędów, zwracających odpowiednie kody stanu i komunikaty.