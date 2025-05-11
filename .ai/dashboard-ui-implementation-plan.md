# Plan implementacji widoku Dashboard

## 1. Przegląd

Widok Dashboard (`/dashboard`) stanowi centralny punkt dla zalogowanego użytkownika, oferując przegląd jego aktywności i szybki dostęp do kluczowych funkcji aplikacji 10x-Cards. Wyświetla kluczowe statystyki dotyczące fiszek (całkowita liczba, podział według statusu) oraz udostępnia przyciski akcji umożliwiające nawigację do generowania fiszek, przeglądania listy fiszek oraz rozpoczęcia sesji nauki.

## 2. Routing widoku

Widok Dashboard powinien być dostępny pod ścieżką `/dashboard`. Dostęp do tej ścieżki powinien wymagać uwierzytelnienia użytkownika.

## 3. Struktura komponentów

Hierarchia komponentów dla widoku Dashboard będzie następująca:

```
src/pages/dashboard.astro
└── src/layouts/DashboardLayout.astro (Layout współdzielony, zawiera np. TopNav)
    └── main (kontener treści)
        └── src/components/DashboardView.tsx (React, client:load)
            ├── src/components/StatsCards.tsx (React)
            │   ├── src/components/SkeletonStatCard.tsx (React, renderowany warunkowo)
            │   └── src/components/StatCard.tsx (React, renderowany warunkowo, powtarzalny)
            └── src/components/ActionButtons.tsx (React)
                └── Button (Komponent Shadcn/ui, powtarzalny)
```

- `dashboard.astro`: Główny plik strony Astro, osadza komponent React.
- `DashboardLayout.astro`: (Opcjonalny, ale zalecany) Współdzielony layout dla widoków po zalogowaniu, zawierający nawigację.
- `DashboardView.tsx`: Główny komponent React, odpowiedzialny za pobieranie danych, zarządzanie stanem (ładowanie, błędy) i renderowanie podkomponentów.
- `StatsCards.tsx`: Komponent React wyświetlający zestaw kart ze statystykami. Obsługuje stan ładowania, pokazując szkielety (`SkeletonStatCard`).
- `StatCard.tsx`: Komponent React do wyświetlania pojedynczej statystyki (tytuł, wartość, ikona).
- `SkeletonStatCard.tsx`: Komponent React wyświetlający szkielet ładowania dla `StatCard`.
- `ActionButtons.tsx`: Komponent React wyświetlający przyciski głównych akcji.

## 4. Szczegóły komponentów

### `DashboardView.tsx`

- **Opis komponentu:** Główny kontener interfejsu Dashboard, renderowany po stronie klienta (`client:load`). Odpowiada za pobranie statystyk użytkownika, zarządzanie stanami ładowania i błędów oraz renderowanie komponentów `StatsCards` i `ActionButtons`.
- **Główne elementy:** `div` jako główny kontener. Warunkowo renderuje `StatsCards` (lub komunikaty o ładowaniu/błędzie) i `ActionButtons`.
- **Obsługiwane interakcje:** Inicjuje pobieranie danych przy montowaniu komponentu.
- **Obsługiwana walidacja:** Sprawdza stan ładowania i błędów przed renderowaniem danych.
- **Typy:** `DashboardStatsViewModel`, wewnętrzny stan `isLoading: boolean`, `error: string | null`.
- **Propsy:** Brak (komponent najwyższego poziomu dla widoku).

### `StatsCards.tsx`

- **Opis komponentu:** Wyświetla sekcję z kartami statystyk (np. Całkowita liczba fiszek, Oczekujące, Zaakceptowane, Odrzucone). Wykorzystuje komponenty `StatCard` i `SkeletonStatCard`.
- **Główne elementy:** Kontener `div` (np. z `grid` Tailwind). Renderuje listę `StatCard` lub `SkeletonStatCard` w zależności od stanu `isLoading`.
- **Obsługiwane interakcje:** Brak bezpośrednich interakcji.
- **Obsługiwana walidacja:** Brak.
- **Typy:** `DashboardStatsViewModel | null`, `isLoading: boolean`.
- **Propsy:**
  - `stats: DashboardStatsViewModel | null`
  - `isLoading: boolean`

### `StatCard.tsx`

- **Opis komponentu:** Pojedyncza karta (Shadcn `Card`) wyświetlająca tytuł statystyki (np. "Łącznie fiszek") i jej wartość. Może opcjonalnie zawierać ikonę.
- **Główne elementy:** Komponenty Shadcn/ui: `Card`, `CardHeader`, `CardTitle`, `CardContent`. Opcjonalnie element na ikonę.
- **Obsługiwane interakcje:** Brak.
- **Obsługiwana walidacja:** Brak.
- **Typy:** `title: string`, `value: number | string`, `icon?: React.ReactNode`.
- **Propsy:**
  - `title: string`
  - `value: number | string`
  - `icon?: React.ReactNode` (np. `<FileTextIcon />` z `lucide-react`)

### `SkeletonStatCard.tsx`

- **Opis komponentu:** Wyświetla wersję szkieletową (`Skeleton` z Shadcn/ui) karty statystyki, zachowując jej układ podczas ładowania danych.
- **Główne elementy:** Komponenty Shadcn/ui: `Card`, `CardHeader`, `Skeleton` (dla tytułu), `CardContent`, `Skeleton` (dla wartości).
- **Obsługiwane interakcje:** Brak.
- **Obsługiwana walidacja:** Brak.
- **Typy:** Brak.
- **Propsy:** Brak.

### `ActionButtons.tsx`

- **Opis komponentu:** Wyświetla grupę przycisków (Shadcn `Button`) umożliwiających nawigację do kluczowych sekcji aplikacji.
- **Główne elementy:** Kontener `div`. Przyciski (Shadcn `Button`) dla akcji: "Generuj fiszki AI", "Zobacz wszystkie fiszki", "Rozpocznij sesję nauki".
- **Obsługiwane interakcje:** Kliknięcie przycisku (`onClick`).
- **Obsługiwana walidacja:** Brak.
- **Typy:** Brak.
- **Propsy:** Brak (nawigacja może być realizowana za pomocą `<a>` lub hooka `useNavigate` z biblioteki routingowej, jeśli jest używana w części React).

## 5. Typy

Do implementacji widoku Dashboard, oprócz istniejących typów (`FlashcardDTO`, `PaginatedResponse`, `Pagination` z `src/types.ts`), potrzebny będzie nowy ViewModel:

- **`DashboardStatsViewModel`**
  - **Cel:** Agregacja danych statystycznych potrzebnych wyłącznie dla widoku Dashboard. Dane te pochodzą z endpointu `GET /api/flashcards`.
  - **Pola:**
    - `totalFlashcards: number`: Całkowita liczba fiszek użytkownika. Odpowiada polu `total` z obiektu `pagination` w odpowiedzi API (`GET /api/flashcards`).
    - `pendingCount: number`: Liczba fiszek ze statusem `pending`. Odpowiada polu `total` z obiektu `pagination` w odpowiedzi API po wywołaniu `GET /api/flashcards?status=pending&limit=1`.
    - `acceptedCount: number`: Liczba fiszek ze statusem `accepted`. Odpowiada polu `total` z obiektu `pagination` w odpowiedzi API po wywołaniu `GET /api/flashcards?status=accepted&limit=1`.
    - `rejectedCount: number`: Liczba fiszek ze statusem `rejected`. Odpowiada polu `total` z obiektu `pagination` w odpowiedzi API po wywołaniu `GET /api/flashcards?status=rejected&limit=1`.

```typescript
// Proponowana definicja w src/types.ts lub w pliku komponentu DashboardView.tsx

export interface DashboardStatsViewModel {
  totalFlashcards: number;
  pendingCount: number;
  acceptedCount: number;
  rejectedCount: number;
}
```

## 6. Zarządzanie stanem

Zarządzanie stanem będzie realizowane wewnątrz komponentu `DashboardView.tsx`, prawdopodobnie z wykorzystaniem niestandardowego hooka `useDashboardStats` w celu enkapsulacji logiki pobierania danych i zarządzania stanami.

- **Stan w `DashboardView.tsx` (lub zarządzany przez hook):**

  - `stats: DashboardStatsViewModel | null`: Przechowuje pobrane statystyki. Inicjalizowany jako `null`.
  - `isLoading: boolean`: Flaga wskazująca, czy dane są aktualnie pobierane. Inicjalizowana jako `true`.
  - `error: string | null`: Przechowuje komunikat błędu, jeśli wystąpił problem z pobraniem danych. Inicjalizowany jako `null`.

- **Niestandardowy Hook `useDashboardStats` (zalecane):**
  - **Cel:** Zamknięcie logiki pobierania danych statystycznych dla Dashboardu, obsługa stanu ładowania i błędów.
  - **Zwraca:** `{ stats: DashboardStatsViewModel | null, isLoading: boolean, error: string | null, refetch: () => void }`.
  - **Logika:** Używa `useState` do zarządzania stanami `stats`, `isLoading`, `error`. Używa `useEffect` do wywołania pobierania danych przy pierwszym renderowaniu. Implementuje logikę `fetch` do wywoływania endpointu `/api/flashcards` (potencjalnie wielokrotnie z różnymi filtrami `status` i `limit=1`), agreguje wyniki w `DashboardStatsViewModel`. Obsługuje błędy (sieciowe, API). Udostępnia funkcję `refetch` do ponownego pobrania danych.

## 7. Integracja API

Integracja odbywa się poprzez wywołanie endpointu `GET /api/flashcards` z poziomu hooka `useDashboardStats` (lub bezpośrednio z `DashboardView.tsx`).

- **Endpoint:** `GET /api/flashcards`
- **Cel:** Pobranie liczby fiszek (całkowitej oraz według statusów).
- **Sposób użycia:**
  1. Wywołaj `fetch('/api/flashcards?limit=1')` w celu uzyskania `totalFlashcards` z `response.pagination.total`.
  2. Wywołaj `fetch('/api/flashcards?status=pending&limit=1')` w celu uzyskania `pendingCount` z `response.pagination.total`.
  3. Wywołaj `fetch('/api/flashcards?status=accepted&limit=1')` w celu uzyskania `acceptedCount` z `response.pagination.total`.
  4. Wywołaj `fetch('/api/flashcards?status=rejected&limit=1')` w celu uzyskania `rejectedCount` z `response.pagination.total`.
  - Wywołania powinny być realizowane współbieżnie (np. `Promise.all`).
- **Typy Żądania:** Brak ciała żądania, parametry przekazywane w URL (query parameters).
- **Typy Odpowiedzi:** `PaginatedResponse<FlashcardDTO>` (zdefiniowany w `src/types.ts`). Interesuje nas głównie pole `pagination.total`.

Należy upewnić się, że żądania do API wysyłane z frontendu zawierają odpowiednie nagłówki uwierzytelniające (np. ciasteczko sesji), co powinno być zarządzane globalnie lub przez mechanizmy Astro/Supabase.

## 8. Interakcje użytkownika

- **Wejście na `/dashboard`:**
  - Użytkownik widzi stronę Dashboard.
  - Początkowo wyświetlane są szkielety (`SkeletonStatCard`) w miejscu statystyk.
  - Po pomyślnym załadowaniu danych, statystyki (`StatCard`) są wypełniane liczbami.
  - Przyciski akcji (`ActionButtons`) są widoczne.
- **Kliknięcie przycisku "Generuj fiszki AI":**
  - Użytkownik jest przekierowywany na stronę/komponent odpowiedzialny za generowanie fiszek (np. `/generate`).
- **Kliknięcie przycisku "Zobacz wszystkie fiszki":**
  - Użytkownik jest przekierowywany na stronę z listą fiszek (np. `/flashcards`).
- **Kliknięcie przycisku "Rozpocznij sesję nauki":**
  - Użytkownik jest przekierowywany na stronę sesji nauki (np. `/study`).

## 9. Warunki i walidacja

- **Uwierzytelnienie:** Dostęp do `/dashboard` wymaga zalogowanego użytkownika. Niezalogowani użytkownicy powinni być przekierowywani na stronę logowania (obsługiwane przez middleware Astro).
- **Stan ładowania danych:** Komponent `DashboardView` musi poprawnie obsługiwać stan `isLoading`. Gdy `isLoading` jest `true`, komponent `StatsCards` powinien wyświetlać `SkeletonStatCard`.
- **Stan błędu:** Gdy `error` w `DashboardView` nie jest `null`, należy wyświetlić komunikat błędu zamiast statystyk.

Nie ma bezpośredniej walidacji danych wprowadzanych przez użytkownika w tym widoku. Walidacja dotyczy obsługi odpowiedzi API i stanów interfejsu.

## 10. Obsługa błędów

- **Błąd sieci lub serwera (np. 500) podczas pobierania statystyk:**
  - Hook `useDashboardStats` powinien przechwycić błąd.
  - Ustawić stan `error` na odpowiedni komunikat (np. "Nie udało się załadować statystyk. Spróbuj ponownie później.").
  - Komponent `DashboardView` powinien wyświetlić ten komunikat zamiast `StatsCards`.
  - Opcjonalnie można dodać przycisk "Spróbuj ponownie", który wywoła funkcję `refetch` z hooka.
- **Błąd 401 Unauthorized (brak autoryzacji / wygaśnięcie sesji):**
  - Hook `useDashboardStats` powinien przechwycić błąd.
  - Należy rozważyć globalną obsługę błędu 401, która przekieruje użytkownika do strony logowania. Jeśli nie, `DashboardView` może wyświetlić komunikat typu "Sesja wygasła, zaloguj się ponownie".
- **Niespodziewany format danych z API:**
  - W hooku `useDashboardStats` należy dodać zabezpieczenia (np. opcjonalne chainowanie `?.`) podczas dostępu do pól odpowiedzi (`response.pagination?.total`).
  - W przypadku błędu parsowania lub braku oczekiwanych pól, ustawić stan `error` na ogólny komunikat (np. "Wystąpił nieoczekiwany błąd.") i zalogować szczegóły błędu w konsoli deweloperskiej.

## 11. Kroki implementacji

1.  **Utworzenie plików komponentów:** Stwórz pliki dla komponentów React: `src/components/DashboardView.tsx`, `src/components/StatsCards.tsx`, `src/components/StatCard.tsx`, `src/components/SkeletonStatCard.tsx`, `src/components/ActionButtons.tsx`.
2.  **Implementacja komponentów statycznych (Layout):** Zaimplementuj podstawowe struktury HTML i style Tailwind dla `StatCard`, `SkeletonStatCard` i `ActionButtons`, używając komponentów Shadcn/ui (`Card`, `Skeleton`, `Button`).
3.  **Implementacja `StatsCards`:** Stwórz komponent `StatsCards`, który przyjmuje propsy `stats` i `isLoading`. Warunkowo renderuj `SkeletonStatCard` (gdy `isLoading=true`) lub listę `StatCard` (gdy `isLoading=false` i `stats` nie jest `null`), mapując dane z `stats`.
4.  **Zdefiniowanie typu `DashboardStatsViewModel`:** Dodaj interfejs `DashboardStatsViewModel` w `src/types.ts` lub lokalnie w `DashboardView.tsx`.
5.  **Implementacja hooka `useDashboardStats`:**
    - Zdefiniuj stany `stats`, `isLoading`, `error`.
    - Zaimplementuj funkcję `fetchStats`, która wykona 4 współbieżne wywołania `fetch` do `/api/flashcards` z odpowiednimi parametrami (`limit=1` i opcjonalnie `status`).
    - Przetwórz odpowiedzi, aby uzyskać wartości `total` z `pagination` i zaktualizuj stan `stats`.
    - Obsłuż stany ładowania (`isLoading`) i błędy (`error`).
    - Użyj `useEffect` do wywołania `fetchStats` przy montowaniu hooka.
    - Zwróć `{ stats, isLoading, error, refetch: fetchStats }`.
6.  **Implementacja `DashboardView`:**
    - Użyj hooka `useDashboardStats` do pobrania danych i zarządzania stanem.
    - Renderuj główny layout widoku.
    - Wyświetl komunikat o błędzie, jeśli `error` nie jest `null`.
    - Renderuj `StatsCards` przekazując `stats` i `isLoading`.
    - Renderuj `ActionButtons`.
7.  **Utworzenie strony Astro (`src/pages/dashboard.astro`):**
    - Importuj i użyj odpowiedniego layoutu (np. `DashboardLayout.astro`).
    - Importuj komponent `DashboardView.tsx`.
    - Osadź komponent `<DashboardView client:load />` w treści strony.
    - Upewnij się, że middleware Astro poprawnie obsługuje uwierzytelnianie dla tej strony.
8.  **Nawigacja:** Zaimplementuj nawigację w `ActionButtons` (np. używając tagów `<a>` kierujących do odpowiednich ścieżek: `/generate`, `/flashcards`, `/study`).
9.  **Styling i responsywność:** Dopracuj style Tailwind, upewniając się, że widok jest responsywny i zgodny z resztą aplikacji.
