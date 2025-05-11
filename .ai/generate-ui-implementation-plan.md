# Plan implementacji widoku Generowania Fiszek

## 1. Przegląd

Widok "Generowanie Fiszek" umożliwia użytkownikom wprowadzenie dłuższego tekstu źródłowego (1000-10 000 znaków) i wykorzystanie AI do automatycznego wygenerowania propozycji fiszek. Użytkownik może następnie przeglądać wygenerowane propozycje, akceptować je, odrzucać lub edytować przed zapisaniem wybranych fiszek w systemie. Widok integruje się z backendem w celu przetworzenia tekstu przez AI oraz zapisania finalnych fiszek.

## 2. Routing widoku

Widok powinien być dostępny pod ścieżką `/generate`. Strona zostanie utworzona jako komponent Astro w `./src/pages/generate.astro`.

## 3. Struktura komponentów

Hierarchia komponentów będzie następująca (komponenty React/Shadcn osadzone w stronie Astro):

```
GeneratePageView (./src/pages/generate.astro)
└── GenerateFlashcardsForm (React - ./src/components/GenerateFlashcardsForm.tsx)
    ├── SourceTextInput (React/Shadcn Textarea - ./src/components/SourceTextInput.tsx lub bezpośrednio w formularzu)
    ├── Button (Generuj) (Shadcn)
    ├── LoadingIndicator (React/Shadcn Skeleton - ./src/components/ui/LoadingIndicator.tsx)
    ├── ErrorMessage (React/Shadcn Alert - ./src/components/ui/ErrorMessage.tsx)
    └── ProposedFlashcardList (React - ./src/components/ProposedFlashcardList.tsx)
        ├── ProposedFlashcardItem[] (React - ./src/components/ProposedFlashcardItem.tsx)
        │   ├── Button (Akceptuj) (Shadcn)
        │   ├── Button (Odrzuć) (Shadcn)
        │   └── Button (Edytuj) (Shadcn)
        ├── Button (Zapisz wszystkie) (Shadcn)
        └── Button (Zapisz zaakceptowane) (Shadcn)
    └── EditFlashcardModal (React/Shadcn Dialog - ./src/components/EditFlashcardModal.tsx)
        ├── Textarea (Przód) (Shadcn)
        ├── Textarea (Tył) (Shadcn)
        ├── Button (Zapisz) (Shadcn)
        └── Button (Anuluj) (Shadcn)

```

## 4. Szczegóły komponentów

### `GeneratePageView` (`./src/pages/generate.astro`)

- **Opis komponentu:** Główny kontener strony Astro. Odpowiada za ustawienie layoutu (`src/layouts/Layout.astro`) i renderowanie głównego interaktywnego komponentu React (`GenerateFlashcardsForm`).
- **Główne elementy:** Komponent `Layout`, Komponent `<GenerateFlashcardsForm client:load />`.
- **Obsługiwane interakcje:** Brak bezpośrednich interakcji.
- **Obsługiwana walidacja:** Brak.
- **Typy:** Brak.
- **Propsy:** Brak.

### `GenerateFlashcardsForm` (`./src/components/GenerateFlashcardsForm.tsx`)

- **Opis komponentu:** Główny komponent React zarządzający stanem i logiką widoku generowania. Zawiera formularz do wprowadzania tekstu, przycisk generowania, obsługuje komunikację z API, wyświetla wskaźniki ładowania/błędów oraz listę proponowanych fiszek.
- **Główne elementy:** `SourceTextInput` (lub `Textarea` Shadcn), `Button` (Generuj), `LoadingIndicator`, `ErrorMessage`, `ProposedFlashcardList`, `EditFlashcardModal`.
- **Obsługiwane interakcje:** Wprowadzanie tekstu, kliknięcie przycisku "Generuj", obsługa akcji z listy fiszek (edycja, zapis).
- **Obsługiwana walidacja:** Walidacja długości tekstu źródłowego (1000-10 000 znaków) przed wysłaniem żądania do API.
- **Typy:** `GenerateFlashcardsCommand`, `GenerationCreateResponseDTO`, `FlashcardProposalDTO`, `ProposedFlashcardViewModel`, `CreateFlashcardsCommand`, `CreateFlashcardDTO`.
- **Propsy:** Brak.

### `SourceTextInput` (`./src/components/SourceTextInput.tsx` lub wbudowany w `GenerateFlashcardsForm`)

- **Opis komponentu:** Komponent do wprowadzania tekstu źródłowego. Wyświetla licznik znaków i informację zwrotną o walidacji. Używa komponentu `Textarea` z Shadcn/ui.
- **Główne elementy:** `Label`, `Textarea` (Shadcn), licznik znaków (np. `p` tag), komunikat walidacyjny.
- **Obsługiwane interakcje:** Wprowadzanie tekstu (`onChange`).
- **Obsługiwana walidacja:** Długość tekstu (min 1000, max 10 000 znaków). Wizualne wskazanie stanu walidacji (np. kolor ramki, tekst pomocniczy).
- **Typy:** `string` (dla wartości).
- **Propsy:** `value: string`, `onChange: (value: string) => void`, `error: string | null`, `charCount: number`.

### `ProposedFlashcardList` (`./src/components/ProposedFlashcardList.tsx`)

- **Opis komponentu:** Wyświetla listę fiszek zaproponowanych przez AI. Zawiera przyciski do grupowego zapisywania fiszek.
- **Główne elementy:** Kontener listy (np. `div`), mapowanie `proposedFlashcards` do `ProposedFlashcardItem`, `Button` ("Zapisz wszystkie"), `Button` ("Zapisz zaakceptowane").
- **Obsługiwane interakcje:** Kliknięcie "Zapisz wszystkie", Kliknięcie "Zapisz zaakceptowane". Przekazuje handlery do `ProposedFlashcardItem`.
- **Obsługiwana walidacja:** Przyciski zapisu mogą być nieaktywne, jeśli lista jest pusta lub nie ma odpowiednich kart do zapisania (wszystkie oczekujące / tylko zaakceptowane).
- **Typy:** `ProposedFlashcardViewModel[]`.
- **Propsy:** `flashcards: ProposedFlashcardViewModel[]`, `onAccept: (id: string | number) => void`, `onReject: (id: string | number) => void`, `onEdit: (card: ProposedFlashcardViewModel) => void`, `onSaveAll: () => void`, `onSaveAccepted: () => void`.

### `ProposedFlashcardItem` (`./src/components/ProposedFlashcardItem.tsx`)

- **Opis komponentu:** Wyświetla pojedynczą proponowaną fiszkę z jej treścią (przód/tył) i przyciskami akcji (Akceptuj, Odrzuć, Edytuj). Wskazuje wizualnie aktualny status przeglądu (`pending`, `accepted`, `rejected`). Używa komponentu `Card` z Shadcn/ui.
- **Główne elementy:** `Card`, `CardHeader`, `CardContent`, `CardFooter` (Shadcn), elementy tekstowe dla przodu i tyłu, `Button` ("Akceptuj"), `Button` ("Odrzuć"), `Button` ("Edytuj"). Wizualne wskaźniki statusu (np. kolor tła/ramki karty).
- **Obsługiwane interakcje:** Kliknięcie "Akceptuj", Kliknięcie "Odrzuć", Kliknięcie "Edytuj".
- **Obsługiwana walidacja:** Brak.
- **Typy:** `ProposedFlashcardViewModel`.
- **Propsy:** `card: ProposedFlashcardViewModel`, `onAccept: (id: string | number) => void`, `onReject: (id: string | number) => void`, `onEdit: (card: ProposedFlashcardViewModel) => void`.

### `EditFlashcardModal` (`./src/components/EditFlashcardModal.tsx`)

- **Opis komponentu:** Modal (okno dialogowe) do edycji treści proponowanej fiszki. Używa komponentu `Dialog` z Shadcn/ui.
- **Główne elementy:** `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter` (Shadcn), `Label` i `Textarea` (Shadcn) dla przodu i tyłu, `Button` ("Zapisz"), `Button` ("Anuluj").
- **Obsługiwane interakcje:** Wprowadzanie tekstu w polach "Przód" i "Tył", Kliknięcie "Zapisz", Kliknięcie "Anuluj".
- **Obsługiwana walidacja:** Długość tekstu "Przód" (max 200 znaków), Długość tekstu "Tył" (max 500 znaków). Przycisk "Zapisz" jest nieaktywny, jeśli walidacja nie przechodzi. Wyświetlanie komunikatów o błędach walidacji przy polach.
- **Typy:** `ProposedFlashcardViewModel` (dane karty do edycji).
- **Propsy:** `isOpen: boolean`, `onClose: () => void`, `card: ProposedFlashcardViewModel | null`, `onSave: (updatedCardData: { front: string; back: string }) => void`.

### `LoadingIndicator` (`./src/components/ui/LoadingIndicator.tsx`)

- **Opis komponentu:** Wyświetla wskaźnik ładowania (np. animacja szkieletu - `Skeleton` z Shadcn/ui) podczas oczekiwania na odpowiedź API generowania.
- **Główne elementy:** Komponenty `Skeleton` (Shadcn) imitujące strukturę listy kart.
- **Obsługiwane interakcje:** Brak.
- **Obsługiwana walidacja:** Brak.
- **Typy:** Brak.
- **Propsy:** Brak (lub `isLoading: boolean`).

### `ErrorMessage` (`./src/components/ui/ErrorMessage.tsx`)

- **Opis komponentu:** Wyświetla komunikaty o błędach (np. błędy API, błędy walidacji po stronie serwera). Używa komponentu `Alert` z Shadcn/ui.
- **Główne elementy:** `Alert`, `AlertTitle`, `AlertDescription` (Shadcn).
- **Obsługiwane interakcje:** Brak (ewentualnie przycisk zamknięcia).
- **Obsługiwana walidacja:** Brak.
- **Typy:** `string | null` (dla komunikatu błędu).
- **Propsy:** `message: string | null`.

## 5. Typy

Oprócz typów DTO importowanych z `src/types.ts` (`GenerateFlashcardsCommand`, `GenerationCreateResponseDTO`, `FlashcardProposalDTO`, `CreateFlashcardsCommand`, `CreateFlashcardDTO`, `FlashcardDTO`, `FlashcardSource`), wymagany będzie następujący typ ViewModel:

- **`ProposedFlashcardViewModel`**:
  - **Cel:** Reprezentuje pojedynczą propozycję fiszki w stanie interfejsu użytkownika. Rozszerza `FlashcardProposalDTO` o status przeglądu przez użytkownika oraz tymczasowy identyfikator dla celów zarządzania stanem w React.
  - **Pola:**
    - `tempId: string | number`: Unikalny identyfikator propozycji w UI przed zapisaniem (dla kluczy React i aktualizacji stanu).
    - `front: string`: Tekst przodu fiszki (max 200 znaków podczas edycji).
    - `back: string`: Tekst tyłu fiszki (max 500 znaków podczas edycji).
    - `source: FlashcardSource`: Źródło fiszki (początkowo `'ai'`, zmieniane na `'ai-edited'` po edycji).
    - `reviewStatus: 'pending' | 'accepted' | 'rejected'`: Status przeglądu propozycji przez użytkownika.
    - `generation_id: string`: ID generacji, do której należy ta propozycja.

## 6. Zarządzanie stanem

Stan będzie zarządzany głównie w komponencie `GenerateFlashcardsForm` przy użyciu hooka `useState` z React.

- **Kluczowe zmienne stanu:**

  - `sourceText: string`: Treść pola tekstowego.
  - `charCount: number`: Liczba znaków w `sourceText`.
  - `isGenerating: boolean`: Flaga ładowania dla API `/generations`.
  - `isSaving: boolean`: Flaga ładowania dla API `/flashcards`.
  - `error: string | null`: Komunikat błędu.
  - `proposedFlashcards: ProposedFlashcardViewModel[]`: Lista proponowanych fiszek.
  - `generationId: string | null`: ID zwrócone przez API `/generations`.
  - `editingCard: ProposedFlashcardViewModel | null`: Karta aktualnie edytowana w modalu.
  - `isModalOpen: boolean`: Stan widoczności modala edycji.

- **Potencjalny Custom Hook (`useFlashcardGeneration`):** Dla zwiększenia czytelności i reużywalności logiki, można rozważyć stworzenie customowego hooka (`./src/hooks/useFlashcardGeneration.ts`), który enkapsulowałby logikę wywołań API (`POST /generations`, `POST /flashcards`), zarządzanie stanami `isLoading`, `isSaving`, `error` oraz `proposedFlashcards`. Komponent `GenerateFlashcardsForm` używałby tego hooka.

## 7. Integracja API

- **Generowanie fiszek (`POST /api/generations`):**
  - **Trigger:** Kliknięcie przycisku "Generuj" w `GenerateFlashcardsForm`.
  - **Warunek:** `sourceText` ma długość między 1000 a 10 000 znaków.
  - **Request:**
    - Typ: `GenerateFlashcardsCommand`
    - Payload: `{ source_text: sourceText }`
  - **Response (Success):**
    - Typ: `GenerationCreateResponseDTO`
    - Akcja: Zaktualizuj stan `proposedFlashcards` mapując odpowiedź na `ProposedFlashcardViewModel[]` (ustaw `reviewStatus` na `'pending'`, dodaj `tempId`), zapisz `generationId`, ustaw `isGenerating` na `false`.
  - **Response (Error):** Ustaw stan `error`, ustaw `isGenerating` na `false`.
- **Zapisywanie fiszek (`POST /api/flashcards`):**
  - **Trigger:** Kliknięcie "Zapisz wszystkie" lub "Zapisz zaakceptowane" w `ProposedFlashcardList`.
  - **Warunek:** Istnieją odpowiednie fiszki do zapisania (`pending` lub `accepted` dla "Zapisz wszystkie", `accepted` dla "Zapisz zaakceptowane").
  - **Request:**
    - Typ: `CreateFlashcardsCommand`
    - Payload: `{ flashcards: CreateFlashcardDTO[] }`, gdzie tablica `flashcards` jest tworzona przez:
      1.  Filtrowanie `proposedFlashcards` na podstawie `reviewStatus` (`'pending'` lub `'accepted'`).
      2.  Mapowanie przefiltrowanych `ProposedFlashcardViewModel` do `CreateFlashcardDTO`, używając ich aktualnych `front`, `back`, `source` (`'ai'` dla `pending`, `'ai'` lub `'ai-edited'` dla `accepted`) i `generation_id`.
  - **Response (Success):**
    - Typ: `FlashcardDTO[]`
    - Akcja: Zaktualizuj stan UI (np. usuń zapisane karty z `proposedFlashcards`, wyświetl komunikat sukcesu), ustaw `isSaving` na `false`.
  - **Response (Error):** Ustaw stan `error`, ustaw `isSaving` na `false`.

## 8. Interakcje użytkownika

- **Wpisywanie tekstu:** Licznik znaków aktualizuje się. Przycisk "Generuj" jest aktywny tylko dla 1000-10 000 znaków.
- **Kliknięcie "Generuj":** Wyświetla `LoadingIndicator`. Po sukcesie API, wyświetla `ProposedFlashcardList`. Po błędzie, wyświetla `ErrorMessage`.
- **Kliknięcie "Akceptuj" na karcie:** Zmienia `reviewStatus` karty na `'accepted'` w stanie, aktualizuje wizualnie kartę.
- **Kliknięcie "Odrzuć" na karcie:** Zmienia `reviewStatus` karty na `'rejected'` w stanie, aktualizuje wizualnie kartę (np. wyszarzenie, oznaczenie).
- **Kliknięcie "Edytuj" na karcie:** Otwiera `EditFlashcardModal` z danymi karty.
- **Edycja w modalu i kliknięcie "Zapisz":** Waliduje pola (max 200/500 znaków). Jeśli poprawnie, aktualizuje dane karty (`front`, `back`) w stanie `proposedFlashcards`, ustawia `source` na `'ai-edited'`, ustawia `reviewStatus` na `'accepted'`, zamyka modal.
- **Kliknięcie "Anuluj" w modalu:** Zamyka modal bez zmian.
- **Kliknięcie "Zapisz wszystkie":** Wywołuje API `/flashcards` z kartami o statusie `pending` oraz `accepted`. Wyświetla `isSaving` loader. Aktualizuje listę po sukcesie lub pokazuje błąd.
- **Kliknięcie "Zapisz zaakceptowane":** Wywołuje API `/flashcards` z kartami o statusie `accepted`. Wyświetla `isSaving` loader. Aktualizuje listę po sukcesie lub pokazuje błąd.

## 9. Warunki i walidacja

- **Tekst źródłowy:** Długość musi być w zakresie 1000-10 000 znaków. Walidacja odbywa się w `SourceTextInput` / `GenerateFlashcardsForm` i blokuje przycisk "Generuj". Komunikat dla użytkownika jest wyświetlany.
- **Edycja fiszki (Modal):**
  - Przód: max 200 znaków.
  - Tył: max 500 znaków.
  - Walidacja odbywa się w `EditFlashcardModal`. Przycisk "Zapisz" jest nieaktywny, jeśli warunki nie są spełnione. Komunikaty walidacyjne są wyświetlane przy polach.
- **Przyciski zapisu:**
  - "Zapisz wszystkie": Aktywny tylko, jeśli `proposedFlashcards` zawiera co najmniej jedną kartę ze statusem `pending`.
  - "Zapisz zaakceptowane": Aktywny tylko, jeśli `proposedFlashcards` zawiera co najmniej jedną kartę ze statusem `accepted`.

## 10. Obsługa błędów

- **Błędy walidacji po stronie klienta:** Komunikaty wyświetlane bezpośrednio przy polach formularzy (`SourceTextInput`, `EditFlashcardModal`). Przyciski akcji (Generuj, Zapisz w modalu) są nieaktywne.
- **Błędy API (`/generations`, `/flashcards`):**
  - Błędy 4xx (np. Bad Request z powodu walidacji serwera, której klient nie wyłapał): Wyświetlić komunikat błędu z API w `ErrorMessage`.
  - Błędy 5xx (Internal Server Error): Wyświetlić generyczny komunikat błędu w `ErrorMessage`, np. "Wystąpił błąd serwera. Spróbuj ponownie później." Logować szczegóły błędu w konsoli deweloperskiej.
  - Błędy sieciowe (Fetch API failure): Wyświetlić generyczny komunikat o problemie z połączeniem w `ErrorMessage`.
- **Stan ładowania:** Używać `LoadingIndicator` (`isGenerating`, `isSaving`), aby poinformować użytkownika o trwających operacjach i zapobiec podwójnym kliknięciom. Wyłączać interaktywne elementy podczas ładowania (np. przyciski).

## 11. Kroki implementacji

1.  **Utworzenie strony Astro:** Stworzyć plik `/src/pages/generate.astro`. Dodać podstawowy layout (`src/layouts/Layout.astro`).
2.  **Stworzenie głównego komponentu React:** Stworzyć plik `/src/components/GenerateFlashcardsForm.tsx`. Dodać podstawową strukturę JSX i osadzić go w `generate.astro` z dyrektywą `client:load`.
3.  **Implementacja formularza tekstowego:** Dodać komponent `Textarea` (Shadcn) w `GenerateFlashcardsForm` (lub jako osobny `SourceTextInput`). Zaimplementować zarządzanie stanem dla `sourceText`, `charCount` oraz logikę walidacji (1000-10k znaków) i powiązany z nią stan przycisku "Generuj".
4.  **Implementacja wywołania API generowania:** Dodać funkcję obsługującą kliknięcie "Generuj". Zaimplementować wywołanie `POST /api/generations` (używając `fetch`). Dodać obsługę stanów `isGenerating` i `error`. Wyświetlać `LoadingIndicator` i `ErrorMessage` warunkowo.
5.  **Definicja typu `ProposedFlashcardViewModel`:** Zdefiniować typ w `src/types.ts` lub lokalnie w `GenerateFlashcardsForm.tsx`.
6.  **Implementacja listy proponowanych fiszek:**
    - Stworzyć komponent `ProposedFlashcardList.tsx`.
    - Stworzyć komponent `ProposedFlashcardItem.tsx` używając `Card` Shadcn do wyświetlania `front`, `back` i przycisków akcji. Dodać wizualne wskazanie `reviewStatus`.
    - W `GenerateFlashcardsForm`, po udanym wywołaniu API `/generations`, zmapować odpowiedź do `ProposedFlashcardViewModel[]` i zapisać w stanie.
    - Przekazać stan i handlery akcji (accept, reject, edit) do `ProposedFlashcardList` i `ProposedFlashcardItem`.
7.  **Implementacja akcji Accept/Reject:** W `GenerateFlashcardsForm` zaimplementować funkcje `handleAccept` i `handleReject`, które aktualizują `reviewStatus` odpowiedniej karty w stanie `proposedFlashcards`.
8.  **Implementacja modala edycji:**
    - Stworzyć komponent `EditFlashcardModal.tsx` używając `Dialog` Shadcn.
    - Dodać pola `Textarea` dla `front` i `back` z walidacją (max 200/500 znaków).
    - W `GenerateFlashcardsForm` dodać stan `editingCard` i `isModalOpen`. Funkcja `handleEdit` powinna ustawiać te stany.
    - Zaimplementować logikę `handleSaveEdit` w `GenerateFlashcardsForm`, która odbiera zaktualizowane dane z modala, waliduje je ponownie (na wszelki wypadek), aktualizuje kartę w stanie `proposedFlashcards` (ustawiając `source` na `'ai-edited'` i `reviewStatus` na `'accepted'`), i zamyka modal.
9.  **Implementacja przycisków zapisu grupowego:**
    - Dodać przyciski "Zapisz wszystkie" i "Zapisz zaakceptowane" w `ProposedFlashcardList`.
    - W `GenerateFlashcardsForm` zaimplementować funkcje `handleSaveAll` i `handleSaveAccepted`.
    - Funkcje te powinny filtrować `proposedFlashcards` według odpowiedniego `reviewStatus`, mapować je do `CreateFlashcardDTO[]` (ustawiając `source` na `ai` dla `pending`, lub używając istniejącego `source` dla `accepted`), i wywoływać `POST /api/flashcards`.
    - Dodać obsługę stanu `isSaving` i `error` dla operacji zapisu.
    - Zaktualizować stan `proposedFlashcards` po udanym zapisie (np. usuwając zapisane karty).
10. **Styling i UX:** Dopracować wygląd komponentów używając Tailwind i Shadcn/ui. Zapewnić responsywność widoku. Dodać komunikaty zwrotne dla użytkownika (np. toast po zapisaniu fiszek).
11. **Refaktoryzacja (Opcjonalnie):** Rozważyć wydzielenie logiki API i zarządzania stanem do customowego hooka `useFlashcardGeneration`, jeśli komponent `GenerateFlashcardsForm` stanie się zbyt rozbudowany.
