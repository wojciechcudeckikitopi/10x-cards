# Plan Testów dla projektu 10x-Cards

## 1. Wprowadzenie i cele testowania

Celem testowania jest zapewnienie wysokiej jakości, stabilności i użyteczności aplikacji 10x-Cards. Planujemy wykryć i wyeliminować krytyczne błędy, zweryfikować zgodność funkcjonalności z wymaganiami oraz optymalizować wydajność i bezpieczeństwo. Efektem będzie pewność, że produkt jest gotowy do produkcji i zapewnia pozytywne doświadczenie użytkownika.

## 2. Zakres testów

- **Warstwa backend/API**: wszystkie endpoints w `src/pages/api` (CRUD fiszek, decków, auth)
- **Logika biznesowa**: moduły w `src/lib` (spaced repetition, AI‐service)
- **UI React**: kluczowe komponenty w `src/components` i `src/components/ui`
- **Strony SSR Astro**: render statyczny i hydracja dynamicznych komponentów
- **Integracja z Supabase**: operacje na bazie, migracje, autoryzacja
- **Integracja z Openrouter.ai**: poprawność wywołań i obsługa błędów
- **Wydajność i regresja wizualna**: czasy odpowiedzi SSR, budowa aplikacji, styling Tailwind
- **Bezpieczeństwo**: autoryzacja, ochrona tras, zarządzanie tokenami

## 3. Typy testów do przeprowadzenia

1. **Testy jednostkowe**
   - Logika biznesowa (`spacedRepetitionEngine`, helpery)
   - Walidacja formularzy
2. **Testy integracyjne**
   - Endpoints API z rzeczywistym lub mokowanym Supabase
   - Middleware autoryzacji
   - Komponenty UI w połączeniu z kontekstem i providerami
3. **Testy end-to-end (E2E)**
   - Scenariusze kluczowych ścieżek użytkownika (Playwright)
4. **Testy wydajnościowe**
   - Czas SSR i generacji statycznych stron (Web Vitals)
   - Czas odpowiedzi API
5. **Testy regresji wizualnej**
   - Snapshoty komponentów UI (Playwright Visual Comparisons)
   - Porównania z Golden Master przy zmianach Tailwind/Shadcn/ui
6. **Testy bezpieczeństwa**
   - Próby nieautoryzowanego dostępu
   - Obsługa wygasłych/nieprawidłowych tokenów
   - Statyczna analiza kodu (eslint-plugin-security)

## 4. Scenariusze testowe dla kluczowych funkcjonalności

1. **Rejestracja i logowanie**
   - Poprawne dane → sukces
   - Błędne hasło/nieistniejący użytkownik → komunikat o błędzie
2. **CRUD fiszek i decków**
   - Tworzenie, edycja, usuwanie, pobieranie listy
   - UX: walidacje, stan ładowania, obsługa błędów sieci
3. **Sesja powtórek**
   - Prawidłowy dobór fiszek wg algorytmu
   - Odrzucenie/zaakceptowanie odpowiedzi → aktualizacja stanu
4. **Generowanie fiszki przez AI**
   - Pomyślne wywołanie, wyświetlenie wygenerowanej treści
   - Błąd AI (timeout/500) → fallback, komunikat
5. **SSR i hydracja**
   - Render czystego HTML
   - Po załadowaniu JS, komponenty dynamiczne działają interaktywnie
6. **Responsywność i dostępność**
   - Widoki mobilne/deskopowe
   - Testy a11y (kontrast, aria-labels)

## 5. Środowisko testowe

- **Lokalne**: Docker Compose z lokalnym Supabase, pliki środowiskowe `.env.test`
- **CI**: GitHub Actions uruchamiające testy jednostkowe, integracyjne, E2E i audyty wizualne
- **Dane testowe**: osobna baza testowa, migracje w wersji próbnym, seedy

## 6. Narzędzia do testowania

- Testy jednostkowe i integracyjne: **Vitest** + **React Testing Library** + **Testing Library/user-event**
- E2E: **Playwright** (w tym Playwright Component Testing)
- Dokumentacja i testy komponentów: **Storybook**
- Mockowanie API: **MSW**
- Regresja wizualna: **Playwright Visual Comparisons**
- Wydajność: **Web Vitals** + **Astro Check**
- Bezpieczeństwo: **Snyk** + **eslint-plugin-security**
- Infrastruktura testowa: **Vitest UI** + **TypeSpec** + **Turborepo**

## 7. Harmonogram testów

| Faza                     | Czas trwania        | Aktywności                                |
| ------------------------ | ------------------- | ----------------------------------------- |
| Analiza wymagań          | 1 tydzień           | Definicja zakresu, scenariuszy            |
| Testy jednostkowe        | 2 sprinty (2–3 tyg) | Implementacja testów logiki i komponentów |
| Testy integracyjne       | 1 sprint (1–2 tyg)  | API, middleware, integracja z DB          |
| Testy E2E                | 1 sprint (1–2 tyg)  | Scenariusze kluczowych workflow           |
| Testy wydajnościowe      | Po etapie MVP       | Metryki SSR, Web Vitals, load testy API   |
| Testy regresji wizualnej | Ciągłe              | Porównania snapshotów przy zmianach UI    |

## 8. Kryteria akceptacji testów

- Coverage:
  - ≥ 80% logika biznesowa
  - ≥ 70% komponenty UI
- Wszystkie krytyczne i wysokie błędy naprawione
- Zielony pipeline CI (brak failów)
- Spełnienie standardów a11y (automatyczne checki)
- Brak problemów bezpieczeństwa zidentyfikowanych przez Snyk

## 9. Role i odpowiedzialności

- **QA Engineer**: projekt i utrzymanie testów, raportowanie
- **Developerzy**: poprawki zgłoszonych błędów, wsparcie przy testach integracyjnych
- **DevOps**: konfiguracja CI, utrzymanie środowisk testowych
- **Product Owner**: priorytetyzacja scenariuszy, weryfikacja kryteriów akceptacji

## 10. Procedury raportowania błędów

1. Zgłoszenie w GitHub Issues z:
   - Kroki do odtworzenia
   - Oczekiwane vs. rzeczywiste zachowanie
   - Zrzuty ekranu/logi
2. Oznaczenie czynników:
   - **Severity** (Critical, High, Medium, Low)
   - **Priority** (P0–P3)
3. Triage i przypisanie do zespołu odpowiedzialnego
4. Weryfikacja poprawki i zamknięcie zadania po retestach
