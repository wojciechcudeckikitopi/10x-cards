# Architektura UI dla 10x-Cards

## 1. Przegląd struktury UI

Ogólny przegląd zakłada istnienie uporządkowanej struktury widoków odpowiadających kolejnym etapom korzystania z platformy. Bazujemy na przestrzeni między widokami autoryzacji, dashboardu, generowania fiszek, listy fiszek, panelu użytkownika oraz przyszłego widoku sesji powtórkowych. Interfejs jest responsywny, spełnia wymogi WCAG AA i wykorzystuje komponenty z Shadcn/ui, Tailwind CSS, a także implementuje zabezpieczenia (np. autoryzacja JWT).

## 2. Lista widoków

1. **Ekran autoryzacji**
   - Ścieżka: `/login`, `/register`, `/reset-password`
   - Główny cel: Umożliwienie użytkownikowi logowania, rejestracji oraz resetu hasła.
   - Kluczowe informacje do wyświetlenia: Formularze logowania, rejestracji, resetu hasła; komunikaty błędów oraz walidacja danych.
   - Kluczowe komponenty widoku: Formularze (Input, Button), linki nawigacyjne, komponenty walidacyjne.
   - UX, dostępność i bezpieczeństwo: Intuicyjna nawigacja, wysoki kontrast, wsparcie dla nawigacji klawiaturowej, zabezpieczenia przy procesie autoryzacji (JWT).

2. **Dashboard**
   - Ścieżka: `/dashboard`
   - Główny cel: Przedstawienie ogólnego przeglądu konta, statystyk oraz szybkiego dostępu do kluczowych funkcji platformy.
   - Kluczowe informacje do wyświetlenia: Statystyki (liczba fiszek, statusy), skróty do generowania fiszek, listy fiszek i panel użytkownika.
   - Kluczowe komponenty widoku: Navigation Menu (topbar), karty statystyk, przyciski akcji, komponenty skeleton do ładowania.
   - UX, dostępność i bezpieczeństwo: Responsywny design, intuicyjna nawigacja, czytelne prezentowanie informacji, zabezpieczenia sesyjne.

3. **Widok generowania fiszek**
   - Ścieżka: `/flashcards/generate`
   - Główny cel: Umożliwienie wprowadzenia przez użytkownika tekstu, a następnie automatyczne generowanie fiszek przez AI. 
   - Kluczowe informacje do wyświetlenia: Obszar tekstowy do wprowadzania źródłowego tekstu (1000-10 000 znaków), podgląd wygenerowanych fiszek z opcjami akceptacji, odrzucenia, edycji oraz grupowego zatwierdzania zmian.
   - Kluczowe komponenty widoku: Formularz tekstowy, przycisk generowania, modal do edycji fiszek, skeleton loader i komunikaty o błędach. Dodatkowo przyciski "zapisz wszystkie" i "zapisz zatwierdzone".
   - UX, dostępność i bezpieczeństwo: Jasne instrukcje, walidacja długości, responsywność, bezpieczna komunikacja z API.

4. **Widok listy fiszek**
   - Ścieżka: `/flashcards/list`
   - Główny cel: Prezentacja listy fiszek (zarówno manualnych, jak i AI-wygenerowanych) z możliwością edycji, usuwania.
   - Kluczowe informacje do wyświetlenia: Lista fiszek z informacjami (front, status, data utworzenia), kontekstowe menu akcji (edytuj, usuń), status zmian (zatwierdzone/odrzucone).
   - Kluczowe komponenty widoku: Tabela lub lista elementów, modal edycji, kontekstowe submenu
   - UX, dostępność i bezpieczeństwo: Dostępność klawiaturowa, intuicyjne komunikaty, walidacja danych, potwierdzenia operacji i zabezpieczenia przy edycji.

5. **Panel użytkownika**
   - Ścieżka: `/user/profile`
   - Główny cel: Zarządzanie danymi użytkownika, ustawieniami konta i preferencjami.
   - Kluczowe informacje do wyświetlenia: Dane profilowe, formularze edycji, ustawienia bezpieczeństwa (np. zmiana hasła).
   - Kluczowe komponenty widoku: Formularze edycji, przyciski zapisu, komponenty walidacyjne, sekcje informacyjne.
   - UX, dostępność i bezpieczeństwo: Bezpieczne przetwarzanie danych, prostota interakcji, zgodność z WCAG AA.

6. **Widok sesji powtórkowych (faza wdrożeniowa)**
   - Ścieżka: `/flashcards/review`
   - Główny cel: Umożliwienie interaktywnej nauki poprzez prezentację fiszek zgodnie z algorytmem spaced repetition.
   - Kluczowe informacje do wyświetlenia: Prezentacja fiszki (przód i tył), wskaźniki postępu, przyciski oceny (np. "łatwo", "trudno").
   - Kluczowe komponenty widoku: Karty fiszek, przyciski interakcyjne, loader/skeleton, system oceny fiszek.
   - UX, dostępność i bezpieczeństwo: Intuicyjny interfejs, responsywność, czytelna prezentacja oraz zabezpieczenie sesji.

## 3. Mapa podróży użytkownika

1. Użytkownik rozpoczyna podróż od ekranu autoryzacji, gdzie loguje się lub rejestruje.
2. Po pomyślnym logowaniu trafia na dashboard, gdzie prezentowane są statystyki konta oraz skróty do głównych funkcji.
3. Użytkownik wybiera opcję generowania fiszek, przechodzi do widoku generowania i wprowadza tekst źródłowy.
4. W widoku generowania pojawia się podgląd wygenerowanych fiszek w formie listy – użytkownik może każdą z nich edytować lub odrzucić poprzez modal.
5. Użytkownik zatwierdza listę wygenerowanych lub wyedytowanych fiszek.
5. Po zatwierdzeniu zmian użytkownik przechodzi do widoku listy fiszek, gdzie przegląda wszystkie fiszki, dokonuje edycji lub usuwa niepotrzebne fiszki.
6. W razie potrzeby, użytkownik odwiedza panel użytkownika w celu aktualizacji danych profilowych.
7. W kolejnych etapach użytkownik ma możliwość rozpoczęcia sesji powtórkowych, przechodząc do widoku sesji nauki.

## 4. Układ i struktura nawigacji

- Główna nawigacja oparta jest na Navigation Menu (topbar), które jest widoczne na wszystkich stronach po autoryzacji.
- Topbar zawiera skróty do: Dashboard, Widoku Generowania Fiszek, Listy Fiszek, Panelu Użytkownika oraz opcjonalnie do Sesji Powtórkowych.
- System breadcrumbs i responsywna nawigacja mobilna umożliwiają szybki dostęp do podstron.
- Hierarchia menu została zaprojektowana w celu ułatwienia intuicyjnej nawigacji między widokami.

## 5. Kluczowe komponenty

- **Navigation Menu (Topbar):** Umożliwia łatwe przechodzenie między głównymi widokami oraz prezentowanie aktualnych informacji o stanie użytkownika.
- **Formularze autoryzacji:** Obsługują logowanie, rejestrację i reset hasła, z wbudowaną walidacją i wsparciem dla dostępności.
- **Modal edycji fiszek:** Umożliwia szczegółowe przeglądanie i edycję wybranej fiszki z opcjami akceptacji lub odrzucenia.
- **Tabela/Lista kandydatów fiszek:** Prezentuje wygenerowane fiszki do zapisu w sposób przejrzysty, z opcją akcji kontekstowych (edycja, usuwanie, grupowe zatwierdzanie).
- **Tabela/Lista fiszek:** Prezentuje zapisane fiszki w sposób przejrzysty, z opcją akcji kontekstowych (edycja, usuwanie).
- **Skeleton Loaders:** Zapewniają informację wizualną podczas ładowania danych w różnych widokach.
- **Komunikaty i toasty:** Informują użytkownika o błędach oraz sukcesach operacji, z uwzględnieniem walidacji i potwierdzeń.
- **Komponent oceny sesji:** Wspiera proces nauki poprzez umożliwienie oceny fiszek, np. poprzez przyciski "łatwo"/"trudno", oraz prezentację postępu sesji. 