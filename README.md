# 10x-Cards

## Project Description

10x-Cards is a web application designed to simplify the creation and management of high-quality educational flashcards leveraging AI technology. Additionally, the platform integrates with an external spaced repetition algorithm to optimize learning sessions.

## Tech Stack

- **Frontend:** Astro 5, React 19, TypeScript 5, Tailwind CSS 4, Shadcn/ui
- **Backend:** Supabase (PostgreSQL, Authentication)
- **AI Integration:** Uses Openrouter.ai to interface with models like OpenAI, Anthropic, and Google
- **Testing:** Vitest, React Testing Library for unit tests, Playwright for E2E testing
- **CI/CD & Hosting:** GitHub Actions, DigitalOcean (Docker)

## Getting Started Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/wojciechcudeckikitopi/10x-cards.git
   ```
2. **Navigate to the project directory:**
   ```bash
   cd 10x-cards
   ```
3. **Use the correct Node version:**
   Ensure you have the Node version specified in the `.nvmrc` file (22.14.0):
   ```bash
   nvm use
   ```
4. **Install dependencies:**
   ```bash
   npm install
   ```
5. **Run the development server:**
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` – Starts the Astro development server.
- `npm run build` – Builds the project for production.
- `npm run preview` – Previews the production build.
- `npm run astro` – Runs Astro CLI commands.
- `npm run lint` – Runs ESLint to check code quality.
- `npm run lint:fix` – Automatically fixes linting errors.
- `npm run format` – Formats the codebase using Prettier.

## Project Scope

10x-Cards is focused on empowering users to create and manage flashcards efficiently. The scope includes:

- **AI-Generated Flashcards:** Automatically generate flashcard proposals from provided text (1,000–10,000 characters).
- **Manual Flashcard Creation:** Allow users to manually create flashcards with enforced character limits (front: up to 200 characters, back: up to 500 characters).
- **Flashcard Review Process:** Provide individual flashcards for acceptance, rejection, or editing to ensure quality.
- **User Account Management:** Securely register, log in, and manage user accounts for personalized flashcard storage.
- **Learning Session:** Integrate a spaced repetition algorithm to optimize study sessions.

## Project Status

The project is currently in active development.

## License

This project is licensed under the MIT License.

## Testing Guide

The project uses Vitest for unit/integration tests and Playwright for E2E tests.

### Running Tests

- **Unit tests**: `npm test` to run all unit tests once, or `npm run test:watch` for watch mode
- **E2E tests**: `npm run test:e2e` to run all end-to-end tests
- **Coverage report**: `npm run test:coverage` to generate a coverage report

### Test Structure

- Unit tests: `src/tests/unit/`
- E2E tests: `src/tests/e2e/`
- Test utilities: `src/tests/utils/`
- API mocks: `src/tests/mocks/`

### Test Best Practices

Unit tests:
- Use `describe` blocks to group related tests
- Keep tests focused on one functionality
- Use descriptive test names
- Follow the Arrange-Act-Assert pattern
- Use `vi.fn()` for simple function mocks
- Use `vi.spyOn()` to monitor existing functions
- Use factory patterns with `vi.mock()` for module mocks

E2E tests:
- Use Page Object Model for maintainable tests
- Use locators for resilient element selection
- Leverage API mocking for controlled environment
- Implement visual comparison with `expect(page).toHaveScreenshot()`
- Use test hooks for setup and teardown
