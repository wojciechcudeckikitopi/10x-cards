# Dokument wymagań produktu (PRD) - 10x-Cards

## 1. Przegląd produktu

Aplikacja ma na celu ułatwienie tworzenia wysokiej jakości fiszek edukacyjnych poprzez wykorzystanie technologii AI oraz umożliwienie ręcznego dodawania fiszek. Produkt jest webową platformą, która integruje gotowy algorytm powtórek, wspierając technikę spaced repetition i eliminując czasochłonność tradycyjnej, manualnej metody tworzenia fiszek. Minimalistyczny interfejs zapewnia prostotę użytkowania, a rygorystyczne walidacje gwarantują spójność i jakość danych.

## 2. Problem użytkownika

Użytkownicy napotykają istotne problemy przy manualnym tworzeniu fiszek. Kluczowe kwestie to:

- Czasochłonność analizy i podziału tekstu w celu wyodrębnienia treści do fiszek.
- Brak jasnych wytycznych dla początkujących użytkowników co do optymalnego dzielenia informacji.
- Potrzeba szybkiej generacji i weryfikacji treści do nauki przy użyciu techniki spaced repetition.

## 3. Wymagania funkcjonalne

- Automatyczne generowanie fiszek przez AI na podstawie wprowadzonego tekstu (zakres 1000–10 000 znaków).
- Obsługa ręcznego tworzenia fiszek przez użytkownika.
- Przeglądanie, edycja i usuwanie fiszek.
- Minimalistyczny interfejs umożliwiający edycję fiszek z ograniczeniami: przód do 200 znaków, tył do 500 znaków.
- System kont użytkowników do przechowywania fiszek.
- Integracja z zewnętrzną, dobrze udokumentowaną biblioteką do algorytmu powtórek.
- Proces weryfikacji fiszek wygenerowanych przez AI: prezentacja pojedynczych fiszek z opcjami akceptacji, odrzucenia i edycji (wymagającej zatwierdzenia zmian).

## 4. Granice produktu

- Brak wdrożenia własnego zaawansowanego algorytmu powtórek (np. SuperMemo, Anki).
- Wyłączenie importu fiszek z różnych formatów (PDF, DOCX, itp.).
- Brak możliwości współdzielenia zestawów fiszek między użytkownikami.
- Brak integracji z innymi platformami edukacyjnymi.
- Pierwsza wersja produktu przeznaczona wyłącznie na platformę web (bez aplikacji mobilnych).
- Szczegółowa konfiguracja integracji z zewnętrzną biblioteką do powtórek pozostaje do ustalenia.

## 5. Historyjki użytkowników

US-001  
Tytuł: Automatyczne generowanie fiszek  
Opis: Jako użytkownik chcę wprowadzić tekst o długości 1000–10 000 znaków, aby system mógł zaproponować fiszki generowane przez AI, prezentowane pojedynczo do akceptacji.  
Kryteria akceptacji:

- Użytkownik może wprowadzić tekst mieszczący się w przedziale 1000–10 000 znaków.
- System automatycznie generuje propozycje fiszek.
- Fiszki są prezentowane pojedynczo z opcjami: akceptacja, odrzucenie, edycja.
- Minimum 75% wygenerowanych fiszek musi być akceptowanych przez użytkownika.
- Funkcjonalność nie jest dostępna bez logowania się do systemu (US-004).

US-002  
Tytuł: Ręczne tworzenie fiszek  
Opis: Jako użytkownik chcę mieć możliwość ręcznego dodania fiszki, aby dostosować treść według własnych potrzeb.  
Kryteria akceptacji:

- Użytkownik ma możliwość ręcznego dodania fiszki.
- Interfejs umożliwia wpisanie przodu fiszki (do 200 znaków) oraz tyłu (do 500 znaków).
- Walidacja długości treści jest egzekwowana podczas tworzenia nowej fiszki.
- Funkcjonalność nie jest dostępna bez logowania się do systemu (US-004).

US-003  
Tytuł: Edycja fiszek  
Opis: Jako użytkownik chcę edytować istniejące fiszki, aby wprowadzić korekty zgodne z ustalonymi ograniczeniami znaków.  
Kryteria akceptacji:

- Użytkownik może wybrać fiszkę do edycji.
- System umożliwia modyfikację przodu (do 200 znaków) i tyłu (do 500 znaków) fiszki.
- Edytowana fiszka podlega potwierdzeniu zmian przed zapisaniem.
- Funkcjonalność nie jest dostępna bez logowania się do systemu (US-004).

US-004  
Tytuł: Zarządzanie kontem użytkownika i bezpieczny dostęp  
Opis: Jako użytkownik chcę mieć możliwość rejestracji i logowania, aby bezpiecznie przechowywać i zarządzać swoimi fiszkami.  
Kryteria akceptacji:

- System umożliwia rejestrację, logowanie i zarządzanie kontem.
- Proces uwierzytelniania jest zabezpieczony i zgodny z najlepszymi praktykami.
- Logowanie i rejestracja odbywają się na dedykowanych stronach.
- Logowanie wymaga podania adresu email i hasła.
- Rejestracja wymaga podania adresu email, hasła i potwierdzenia hasła.
- Użytkownik NIE MOŻE korzystać z funkcji Automatyczne generowanie fiszek bez logowania się do systemu (US-001).
- Użytkownik NIE MOŻE korzystać z funkcji Ręczne tworzenie fiszek bez logowania się do systemu (US-002).
- Użytkownik NIE MOŻE korzystać z funkcji Edycja fiszek bez logowania się do systemu (US-003).
- Użytkownik NIE MOŻE korzystać z funkcji Zarządzanie fiszkami uzytkownika bez logowania się do systemu (US-005).
- Użytkownik NIE MOŻE korzystać z funkcji Sesja nauki z algorytmem powtórek bez logowania się do systemu (US-006).
- Użytkownik NIE MOŻE korzystać z funkcji Dashboard / ekran główny bez logowania się do systemu
- Użytkownik może logować się do systemu poprzez przycisk w prawym górnym rogu (w TopBar).
- Użytkownik może się wylogować z systemu poprzez przycisk w prawym górnym rogu w głównym @Layout.astro w TopBar
- Nie korzystamy z zewnętrznych serwisów logowania (np. Google, GitHub).
- Odzyskiwanie hasła powinno być możliwe.

US-005  
Tytuł: Zarządzanie fiszkami uzytkownika
Opis: Jako użytkownik chcę mieć możliwość zarzadzania listą fiszek (zarówno manualnych, jak i AI-wygenerowanych) z możliwością edycji, usuwania.
Kryteria akceptacji:

- Widoczna lista fiszek uzytkownika z informacjami (front, status, data utworzenia)
- Na kazdym wierszu kontekstowe menu akcji (edytuj, usuń)
- Funkcjonalność nie jest dostępna bez logowania się do systemu (US-004).

US-006  
Tytuł: Sesja nauki z algorytmem powtórek  
Opis: Jako użytkownik chcę, aby dodane fiszki były dostępne w widoku "Sesja nauki" opartym na zewnętrznym algorytmie spaced repetition, aby zoptymalizować proces nauki.  
Kryteria akceptacji:

- W widoku "Sesja nauki" algorytm przygotowuje dla mnie sesję nauki fiszek
- Na start wyświetlany jest przód fiszki, poprzez interakcję użytkownik wyświetla jej tył
- Użytkownik ocenia zgodnie z oczekiwaniami algorytmu na ile przyswoił fiszkę
- Następnie algorytm pokazuję kolejną fiszkę w ramach nauki
- Funkcjonalność nie jest dostępna bez logowania się do systemu (US-004).

## 6. Metryki sukcesu

- 75% fiszek generowanych przez AI jest akceptowanych przez użytkownika.
- Minimum 75% wszystkich tworzonych fiszek pochodzi z generowania przez AI.
