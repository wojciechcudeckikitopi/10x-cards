# Plan implementacji widoku listy fiszek

## 1. Przegląd
Celem tego widoku jest umożliwienie użytkownikom przeglądania, zarządzania (edycja, usuwanie) swoimi fiszkami (zarówno stworzonymi ręcznie, jak i wygenerowanymi przez AI). Widok będzie prezentował listę fiszek wraz z kluczowymi informacjami i akcjami kontekstowymi, zgodnie z wymaganiami US-005 i PRD.

## 2. Routing widoku
Widok powinien być dostępny pod ścieżką: `/flashcards`. Strona zostanie utworzona jako komponent Astro w `src/pages/flashcards.astro`.

## 3. Struktura komponentów
Hierarchia komponentów dla widoku listy fiszek będzie następująca:

```
FlashcardsPage (Astro - src/pages/flashcards.astro)
└── FlashcardListContainer (React - src/components/flashcards/FlashcardListContainer.tsx)
    ├── FlashcardTable (React - src/components/flashcards/FlashcardTable.tsx)
    │   └── FlashcardActions (React - src/components/flashcards/FlashcardActions.tsx, per row)
    │       └── DropdownMenu (Shadcn)
    ├── PaginationControls (React - src/components/shared/PaginationControls.tsx)
    │   └── Button (Shadcn)
    ├── EditFlashcardModal (React - src/components/flashcards/EditFlashcardModal.tsx, conditionally rendered)
    │   └── Dialog (Shadcn)
    │       ├── Input (Shadcn)
    │       └── Textarea (Shadcn)
    │       └── Button (Shadcn)
    └── DeleteConfirmationDialog (React - src/components/shared/DeleteConfirmationDialog.tsx, conditionally rendered)
        └── AlertDialog (Shadcn)
            └── Button (Shadcn)
```
Komponenty React będą renderowane wewnątrz strony Astro z odpowiednią dyrektywą `client:*` (np. `client:visible`).

## 4. Szczegóły komponentów

### `FlashcardsPage` (Astro)
- **Opis komponentu:** Główny kontener strony Astro. Odpowiada za ustawienie layoutu aplikacji i renderowanie głównego komponentu React (`FlashcardListContainer`) zarządzającego listą fiszek. Może obsługiwać strategię ładowania danych (np. Server-Side Rendering, jeśli dotyczy, lub inicjalizację po stronie klienta).
- **Główne elementy:** Layout aplikacji, `<FlashcardListContainer client:visible />`.
- **Obsługiwane interakcje:** Brak bezpośrednich.
- **Obsługiwana walidacja:** Brak.
- **Typy:** Zależne od Layoutu.
- **Propsy:** Zależne od Layoutu.

### `FlashcardListContainer` (React)
- **Opis komponentu:** Główny kontener React zarządzający stanem widoku listy fiszek. Odpowiada za pobieranie danych (fiszki, paginacja), obsługę stanu ładowania i błędów, zarządzanie stanem filtrowania/sortowania (przyszłość), kontrolowanie widoczności modali edycji/usuwania oraz przekazywanie danych i funkcji do komponentów podrzędnych (`FlashcardTable`, `PaginationControls`, modale).
- **Główne elementy:** `FlashcardTable`, `PaginationControls`, `EditFlashcardModal`, `DeleteConfirmationDialog`. Warunkowe renderowanie wskaźnika ładowania lub komunikatu o błędzie.
- **Obsługiwane interakcje:** Zmiana strony paginacji, inicjowanie edycji fiszki, inicjowanie usuwania fiszki, zapisanie edytowanej fiszki, potwierdzenie usunięcia fiszki.
- **Obsługiwana walidacja:** Brak bezpośredniej (przekazuje dalej).
- **Typy:** `FlashcardDTO[]`, `Pagination`, `FlashcardStatus` (dla przyszłych filtrów), `string` (dla przyszłego sortowania), `string | null` (dla ID edytowanej/usuwanej fiszki).
- **Propsy:** Brak (komponent najwyższego poziomu React na tej stronie).

### `FlashcardTable` (React)
- **Opis komponentu:** Wyświetla listę fiszek w formie tabeli (używając komponentu `Table` z Shadcn/ui). Renderuje kolumny: Przód fiszki (fragment), Status, Data utworzenia, Akcje. Dla każdego wiersza renderuje komponent `FlashcardActions`.
- **Główne elementy:** Komponent `Table`, `TableRow`, `TableCell` z Shadcn/ui. Renderuje `FlashcardActions` w ostatniej kolumnie.
- **Obsługiwane interakcje:** Brak bezpośrednich (deleguje do `FlashcardActions`).
- **Obsługiwana walidacja:** Brak.
- **Typy:** `FlashcardDTO[]`.
- **Propsy:** `flashcards: FlashcardDTO[]`, `onEdit: (id: string) => void`, `onDelete: (id: string) => void`.

### `FlashcardActions` (React)
- **Opis komponentu:** Wyświetla menu kontekstowe (używając `DropdownMenu` z Shadcn/ui) dla pojedynczego wiersza fiszki, zawierające opcje "Edytuj" i "Usuń".
- **Główne elementy:** Komponent `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem` z Shadcn/ui.
- **Obsługiwane interakcje:** Kliknięcie opcji "Edytuj", kliknięcie opcji "Usuń".
- **Obsługiwana walidacja:** Brak.
- **Typy:** `string` (ID fiszki).
- **Propsy:** `flashcardId: string`, `onEdit: (id: string) => void`, `onDelete: (id: string) => void`.

### `EditFlashcardModal` (React)
- **Opis komponentu:** Modal (używając `Dialog` z Shadcn/ui) zawierający formularz do edycji przodu i tyłu fiszki. Zawiera pola `Input` (dla przodu) i `Textarea` (dla tyłu), wskaźniki/limity znaków oraz przyciski "Zapisz" i "Anuluj". Zarządza stanem formularza, walidacją i komunikacją z API (PUT).
- **Główne elementy:** Komponent `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogFooter`, `Input`, `Textarea`, `Button` z Shadcn/ui. Elementy do wyświetlania liczników znaków i błędów walidacji.
- **Obsługiwane interakcje:** Wprowadzanie tekstu w polach, kliknięcie "Zapisz", kliknięcie "Anuluj".
- **Obsługiwana walidacja:**
    - Przód (`front`): Maksymalnie 200 znaków (`value.length <= 200`). Wymagane.
    - Tył (`back`): Maksymalnie 500 znaków (`value.length <= 500`). Wymagane.
    - Przycisk "Zapisz" jest nieaktywny, jeśli walidacja nie przechodzi lub trwa zapisywanie.
- **Typy:** `FlashcardDTO` (do inicjalizacji), `UpdateFlashcardDTO` (do wysłania).
- **Propsy:** `isOpen: boolean`, `flashcard: FlashcardDTO | null`, `onSave: (updatedData: FlashcardDTO) => void`, `onCancel: () => void`.

### `DeleteConfirmationDialog` (React)
- **Opis komponentu:** Dialog potwierdzenia (używając `AlertDialog` z Shadcn/ui) wyświetlany przed usunięciem fiszki. Zawiera komunikat ostrzegawczy oraz przyciski "Potwierdź" i "Anuluj". Komunikuje się z API (DELETE) po potwierdzeniu.
- **Główne elementy:** Komponent `AlertDialog`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogFooter`, `AlertDialogAction`, `AlertDialogCancel` z Shadcn/ui.
- **Obsługiwane interakcje:** Kliknięcie "Potwierdź", kliknięcie "Anuluj".
- **Obsługiwana walidacja:** Brak.
- **Typy:** `string` (ID fiszki).
- **Propsy:** `isOpen: boolean`, `flashcardId: string | null`, `onConfirm: (id: string) => void`, `onCancel: () => void`.

### `PaginationControls` (React)
- **Opis komponentu:** Wyświetla kontrolki paginacji (np. przyciski "Poprzednia", "Następna", numery stron) na podstawie metadanych paginacji otrzymanych z API. Używa komponentów `Button` z Shadcn/ui.
- **Główne elementy:** Komponenty `Button` z Shadcn/ui. Logika do obliczania zakresu stron (jeśli potrzebne).
- **Obsługiwane interakcje:** Kliknięcie przycisku "Poprzednia", kliknięcie przycisku "Następna", kliknięcie numeru strony (jeśli zaimplementowane).
- **Obsługiwana walidacja:** Przyciski "Poprzednia"/"Następna" są nieaktywne, gdy użytkownik jest odpowiednio na pierwszej/ostatniej stronie.
- **Typy:** `Pagination`.
- **Propsy:** `pagination: Pagination`, `onPageChange: (page: number) => void`.

## 5. Typy
Do implementacji widoku wykorzystane zostaną następujące typy zdefiniowane w `src/types.ts`:
- `FlashcardDTO`: Podstawowy typ danych fiszki używany do wyświetlania w tabeli i przekazywania do modala edycji.
  ```typescript
  export type FlashcardDTO = Omit<FlashcardRow, "user_id"> & {
    status: FlashcardStatus;
    source: FlashcardSource;
  };
  // Gdzie FlashcardRow zawiera m.in.: id, front, back, created_at, updated_at, generation_id
  // FlashcardStatus = "pending" | "accepted" | "rejected"
  // FlashcardSource = "ai" | "manual" | "ai-edited"
  ```
- `UpdateFlashcardDTO`: Typ danych wysyłanych w żądaniu `PUT /flashcards/:id` podczas edycji.
  ```typescript
  export type UpdateFlashcardDTO = Partial<Pick<FlashcardUpdate, "front" | "back" | "source">> & {
    status?: FlashcardStatus; // Edycja statusu może być dodana później
  };
  // FlashcardUpdate pozwala na zmianę front, back, source, status
  ```
- `DeleteResponseDTO`: Oczekiwany typ odpowiedzi z żądania `DELETE /flashcards/:id`.
  ```typescript
  export interface DeleteResponseDTO {
    message: string;
  }
  ```
- `Pagination`: Typ metadanych paginacji.
  ```typescript
  export interface Pagination {
    page: number;
    limit: number;
    total: number;
  }
  ```
- `PaginatedResponse<T>`: Generyczny typ odpowiedzi dla list z paginacją, używany z `FlashcardDTO`.
  ```typescript
  export interface PaginatedResponse<T> {
    data: T[];
    pagination: Pagination;
  }
  ```
- `FlashcardStatus`: Enum dla statusów fiszek (używany do wyświetlania i potencjalnych filtrów).
- `FlashcardSource`: Enum dla źródeł fiszek (używany do wyświetlania).

**ViewModel:**
Na tym etapie `FlashcardDTO` wydaje się wystarczający. Jeśli logika wyświetlania (np. formatowanie daty, skracanie tekstu) stanie się bardziej skomplikowana, można wprowadzić `FlashcardViewModel`.

## 6. Zarządzanie stanem
Stan widoku będzie zarządzany głównie w komponencie `FlashcardListContainer` przy użyciu hooków React (`useState`, `useEffect`, `useCallback`).

Kluczowe elementy stanu w `FlashcardListContainer`:
- `flashcards: FlashcardDTO[]`: Lista aktualnie wyświetlanych fiszek.
- `pagination: Pagination`: Aktualne informacje o paginacji.
- `isLoading: boolean`: Flaga wskazująca, czy trwa ładowanie danych.
- `error: string | null`: Komunikat o błędzie (jeśli wystąpił).
- `editingFlashcardId: string | null`: ID fiszki wybranej do edycji (kontroluje modal `EditFlashcardModal`).
- `deletingFlashcardId: string | null`: ID fiszki wybranej do usunięcia (kontroluje dialog `DeleteConfirmationDialog`).
- (Opcjonalnie) Stan filtrów i sortowania.

Stan formularza edycji (`formData`, `validationErrors`, `isSaving`) będzie zarządzany lokalnie w `EditFlashcardModal`.

**Custom Hook:** Rozważenie stworzenia customowego hooka `useFlashcards` może uprościć `FlashcardListContainer`, enkapsulując logikę pobierania danych, paginacji, obsługi akcji edycji/usuwania oraz zarządzania stanem `isLoading` i `error`.

## 7. Integracja API
Integracja z API będzie realizowana poprzez wywołania `fetch` (lub dedykowanego klienta API, jeśli istnieje w projekcie) w odpowiednich komponentach lub hooku `useFlashcards`.

- **`GET /flashcards`**:
    - Wywoływane przy inicjalizacji komponentu `FlashcardListContainer` oraz przy zmianie strony (`onPageChange` w `PaginationControls`), zmianie filtrów lub sortowania.
    - Parametry zapytania: `page`, `limit` (np. 20), opcjonalnie `status`, `sort_by`.
    - Typ odpowiedzi: `PaginatedResponse<FlashcardDTO>`.
    - Aktualizuje stany `flashcards` i `pagination`.
- **`PUT /flashcards/:id`**:
    - Wywoływane z `EditFlashcardModal` po kliknięciu "Zapisz" i przejściu walidacji.
    - ID fiszki pobierane z `editingFlashcardId`.
    - Ciało żądania: Obiekt typu `UpdateFlashcardDTO` zawierający zmienione pola `front` i `back`.
    - Typ odpowiedzi: `FlashcardDTO` (zaktualizowana fiszka).
    - Po sukcesie: Aktualizacja stanu `flashcards` w `FlashcardListContainer` (bezpośrednio lub przez refetch) i zamknięcie modala.
- **`DELETE /flashcards/:id`**:
    - Wywoływane z `DeleteConfirmationDialog` po kliknięciu "Potwierdź".
    - ID fiszki pobierane z `deletingFlashcardId`.
    - Typ odpowiedzi: `DeleteResponseDTO`.
    - Po sukcesie: Aktualizacja stanu `flashcards` w `FlashcardListContainer` (usunięcie elementu lub refetch) i zamknięcie dialogu.

Wszystkie wywołania API muszą zawierać odpowiednie nagłówki autoryzacyjne (obsługiwane przez globalny mechanizm fetch/Supabase klienta).

## 8. Interakcje użytkownika
- **Ładowanie widoku:** Pokazywany wskaźnik ładowania, następnie tabela z pierwszą stroną fiszek i kontrolki paginacji.
- **Zmiana strony:** Kliknięcie kontrolki paginacji ładuje i wyświetla odpowiednią stronę fiszek.
- **Edycja fiszki:** Kliknięcie "Edytuj" w menu kontekstowym otwiera modal z danymi fiszki. Użytkownik edytuje pola, walidacja działa na bieżąco. Kliknięcie "Zapisz" wysyła zmiany do API, po sukcesie modal się zamyka, a lista aktualizuje. Kliknięcie "Anuluj" zamyka modal bez zapisywania.
- **Usuwanie fiszki:** Kliknięcie "Usuń" w menu kontekstowym otwiera dialog potwierdzenia. Kliknięcie "Potwierdź" wysyła żądanie usunięcia do API, po sukcesie dialog się zamyka, a fiszka znika z listy. Kliknięcie "Anuluj" zamyka dialog.

## 9. Warunki i walidacja
- **Limit znaków (Edycja):** W `EditFlashcardModal` pola `front` (max 200) i `back` (max 500) są walidowane na bieżąco. Wyświetlane są komunikaty o błędach i/lub liczniki znaków. Przycisk "Zapisz" jest nieaktywny, jeśli dane są niepoprawne.
- **Paginacja:** Przyciski "Poprzednia"/"Następna" w `PaginationControls` są nieaktywne, jeśli użytkownik znajduje się odpowiednio na pierwszej/ostatniej stronie (na podstawie `pagination.page` i `pagination.total`).
- **Potwierdzenie usunięcia:** Operacja usunięcia wymaga dodatkowego potwierdzenia w `DeleteConfirmationDialog`, aby zapobiec przypadkowemu usunięciu danych.

## 10. Obsługa błędów
- **Błędy sieciowe / serwera (5xx):** Podczas pobierania listy, zapisywania edycji lub usuwania, wyświetlany jest ogólny komunikat o błędzie (np. "Wystąpił błąd. Spróbuj ponownie.") w odpowiednim miejscu (np. w `FlashcardListContainer` dla listy, w modalu/dialogu dla akcji). Możliwość ponowienia akcji (Retry button). Błędy są logowane do konsoli.
- **Błędy walidacji (400 - PUT):** W `EditFlashcardModal` wyświetlane są komunikaty o błędach zwrócone przez API (jeśli są dostępne) lub generyczny komunikat walidacji. Modal pozostaje otwarty, aby użytkownik mógł poprawić dane.
- **Nie znaleziono (404 - PUT/DELETE):** Wyświetlany jest komunikat (np. "Nie znaleziono fiszki."). Modal/dialog jest zamykany, a lista w `FlashcardListContainer` może zostać odświeżona, aby usunąć nieistniejący element.
- **Brak autoryzacji (401):** Globalny mechanizm obsługi błędów powinien przechwycić 401 i przekierować użytkownika na stronę logowania.

## 11. Kroki implementacji
1.  **Struktura plików:** Utwórz plik strony `src/pages/flashcards.astro` oraz katalogi dla komponentów React: `src/components/flashcards`, `src/components/shared`.
2.  **Strona Astro:** Zaimplementuj `src/pages/flashcards.astro`, ustawiając podstawowy layout i renderując komponent `<FlashcardListContainer client:visible />`.
3.  **Kontener listy (`FlashcardListContainer`):**
    *   Zaimplementuj podstawową strukturę komponentu React.
    *   Dodaj logikę pobierania danych (`GET /flashcards`) przy użyciu `useEffect` i `fetch` (lub klienta API).
    *   Zarządzaj stanami `flashcards`, `pagination`, `isLoading`, `error`.
    *   Wyświetlaj wskaźnik ładowania lub komunikat o błędzie.
4.  **Tabela (`FlashcardTable`):**
    *   Zaimplementuj komponent używając `Table` z Shadcn/ui.
    *   Przyjmuj `flashcards` jako prop i renderuj wiersze z danymi (`front`, `status`, `created_at`).
    *   Dodaj pustą kolumnę na akcje.
5.  **Akcje (`FlashcardActions`):**
    *   Zaimplementuj komponent używając `DropdownMenu` z Shadcn/ui.
    *   Dodaj opcje "Edytuj" i "Usuń".
    *   Przyjmuj `flashcardId`, `onEdit`, `onDelete` jako propsy i wywołuj odpowiednie funkcje przy kliknięciu.
    *   Zintegruj `FlashcardActions` w `FlashcardTable`.
6.  **Paginacja (`PaginationControls`):**
    *   Zaimplementuj komponent używając `Button` z Shadcn/ui.
    *   Przyjmuj `pagination` i `onPageChange` jako propsy.
    *   Implementuj logikę przycisków "Poprzednia"/"Następna" i ich deaktywacji.
    *   Zintegruj `PaginationControls` w `FlashcardListContainer` i podłącz do stanu paginacji i funkcji zmiany strony.
7.  **Modal Edycji (`EditFlashcardModal`):**
    *   Zaimplementuj komponent używając `Dialog` z Shadcn/ui.
    *   Dodaj formularz z polami `Input` (front) i `Textarea` (back) oraz przyciskami "Zapisz"/"Anuluj".
    *   Zarządzaj stanem formularza (`formData`).
    *   Implementuj walidację długości pól i wyświetlanie błędów/liczników.
    *   Implementuj logikę zapisu (`PUT /flashcards/:id`) po kliknięciu "Zapisz", obsługując stany `isSaving` i błędy.
    *   Przyjmuj `isOpen`, `flashcard`, `onSave`, `onCancel` jako propsy.
    *   Zintegruj `EditFlashcardModal` w `FlashcardListContainer`, kontrolując jego widoczność i przekazując dane/callbacki.
8.  **Dialog Potwierdzenia Usunięcia (`DeleteConfirmationDialog`):**
    *   Zaimplementuj komponent używając `AlertDialog` z Shadcn/ui.
    *   Dodaj komunikat potwierdzenia i przyciski "Potwierdź"/"Anuluj".
    *   Implementuj logikę usuwania (`DELETE /flashcards/:id`) po kliknięciu "Potwierdź", obsługując błędy.
    *   Przyjmuj `isOpen`, `flashcardId`, `onConfirm`, `onCancel` jako propsy.
    *   Zintegruj `DeleteConfirmationDialog` w `FlashcardListContainer`, kontrolując jego widoczność i przekazując dane/callbacki.
9.  **Styling i UX:** Dopracuj wygląd przy użyciu Tailwind, upewnij się, że komponenty Shadcn/ui są spójne z resztą aplikacji. Przetestuj dostępność (nawigacja klawiaturą, screen reader). Dodaj komunikaty toast (np. po sukcesie zapisu/usunięcia).
10. **Refaktoryzacja (Opcjonalnie):** Rozważ wydzielenie logiki z `FlashcardListContainer` do customowego hooka `useFlashcards`, jeśli komponent stanie się zbyt rozbudowany.
