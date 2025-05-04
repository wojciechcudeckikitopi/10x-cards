# Usługa OpenRouter – Kompleksowy przewodnik implementacji

## 1. Opis usługi
`OpenRouterService` to moduł w TypeScript, który umożliwia komunikację z API OpenRouter w celu wymiany wiadomości z LLM. Usługa udostępnia czytelny interfejs do:

1. Konfigurowania klucza API i endpointu.
2. Tworzenia i wysyłania zapytań chatowych (wiadomość systemowa + wiadomość użytkownika).
3. Walidacji i strukturyzacji odpowiedzi zgodnie z JSON Schema.
4. Obsługi błędów sieciowych i biznesowych.

## 2. Opis konstruktora

```ts
constructor(config: { apiKey: string; baseURL: string })
```
- `apiKey`: klucz API OpenRouter (zabezpieczony w zmiennych środowiskowych).
- `baseURL`: adres bazowego endpointu usługi (np. `https://api.openrouter.ai/v1`).

Konstruktor inicjalizuje wewnętrzne pola:
- `private apiKey: string`
- `private baseURL: string`

## 3. Publiczne metody i pola

```ts
public async sendMessage<T>(options: {
  systemMessage: string;
  userMessage: string;
  responseFormat: ResponseFormat;
  modelName: string;
  modelParams?: ModelParams;
}): Promise<ChatResponse<T>>
```
1. `systemMessage`: sterujący prompt (np. "You are an educational assistant...").
2. `userMessage`: treść zapytania od użytkownika.
3. `responseFormat`: struktura odpowiedzi w formacie JSON Schema, np.:
   ```ts
   const responseFormat = {
     type: 'json_schema',
     json_schema: {
       name: 'flashcardSchema',
       strict: true,
       schema: {
         question: { type: 'string' },
         answer: { type: 'string' }
       }
     }
   };
   ```
4. `modelName`: identyfikator modelu (np. `openai/gpt-4o`).
5. `modelParams`: opcjonalne parametry modelu (temperatura, max_tokens, itp.).

Metoda zwraca `ChatResponse<T>` z polami:
- `data`: sparsowany obiekt zgodny ze schematem.
- `raw`: oryginalna odpowiedź API.

## 4. Prywatne metody i pola

```ts
private buildPayload(options: SendMessageOptions): OpenRouterRequest
```
- Składa JSON z wiadomości: system + user, modelName, format odpowiedzi i parametry.

```ts
private async fetchAPI(payload: OpenRouterRequest): Promise<any>
```
- Wysyła zapytanie HTTP przez `fetch`, ustawia nagłówki (Authorization: Bearer).
- Zwraca surową odpowiedź JSON.

```ts
private validateResponse<T>(raw: any, schema: JSONSchema): T
```
- Używa `zod` do walidacji.
- W razie niezgodności rzuca `ValidationError`.

```ts
private handleError(error: any): never
```
- Rzuca wyspecjalizowane błędy aplikacji (`NetworkError`, `APIError`, `ValidationError`).

## 5. Obsługa błędów

Potencjalne scenariusze i mapowane wyjątki:
1. Błąd sieci (timeout, brak połączenia) → `NetworkError`.
2. Nieautoryzowany (`401`) lub brak uprawnień → `AuthError`.
3. Limit zapytań (`429`) → `RateLimitError` z informacją o retry-after.
4. Błąd serwera (`5xx`) → `APIError`.
5. Nieprawidłowe odpowiedzi (schema mismatch) → `ValidationError`.
6. Nieobsługiwane formaty odpowiedzi → `FormatError`.

## 6. Kwestie bezpieczeństwa

- **Przechowywanie klucza**: w `.env`
- **HTTPS**: wszystkie wywołania przez TLS.
- **Minimalne uprawnienia**: ograniczyć scope API.
- **Maskowanie logów**: nie logować klucza i poufnych danych.
- **Ograniczanie dostępu**: CORS i zabezpieczenia po stronie serwera.

## 7. Plan wdrożenia krok po kroku

1. **Przygotowanie środowiska**
   - Utwórz `.env` z `OPENROUTER_API_KEY` i `OPENROUTER_BASE_URL`.

3. **Definicja typów w `src/types.ts`**
   ```ts
   export interface ResponseFormat { type: 'json_schema'; json_schema: { name: string; strict: boolean; schema: object; } }
   export interface ModelParams { temperature?: number; max_tokens?: number; top_p?: number; } 
   export interface ChatResponse<T> { data: T; raw: any; }
   ```

4. **Implementacja serwisu**
   - Utwórz plik `src/lib/services/OpenRouterService.ts`.
   - Wdróż konstruktor, publiczne i prywatne metody według powyższej specyfikacji.
   - Użyj `fetch` do zapytań.
   - Dodaj walidację `zod`.

5. **Przykład użycia**
   ```tsx
   import { OpenRouterService } from '~/lib/services/OpenRouterService';
   
   const service = new OpenRouterService({
     apiKey: import.meta.env.OPENROUTER_API_KEY,
     baseURL: import.meta.env.OPENROUTER_BASE_URL
   });
   
   const format = { type: 'json_schema', json_schema: { name: 'cardSchema', strict: true, schema: { question: { type: 'string' }, answer: { type: 'string' } } } };
   
   const result = await service.sendMessage({
     systemMessage: 'You are a helpful assistant.',
     userMessage: 'Explain photosynthesis.',
     responseFormat: format,
     modelName: 'openai/gpt-4o',
     modelParams: { temperature: 0.7, max_tokens: 300 }
   });
   
   console.log(result.data);
   ```


7. **CI/CD i wdrożenie**
   - W GitHub Actions dodaj secret `OPENROUTER_API_KEY`.
   - Zaktualizuj pipeline, aby przekazywał zmienne środowiskowe.
   - W Dockerfile lub DigitalOcean App Platform skonfiguruj env vars.

8. **Monitoring i retry**
   - Zaimplementuj exponential backoff dla błędów `429` i `5xx`.
   - Dodaj alerty na nieudane requesty (Sentry, Datadog).

---

*Ten przewodnik jest dostosowany do technologii Astro 5, TypeScript 5, React 19, Tailwind 4 oraz Architektury Shadcn/ui.*