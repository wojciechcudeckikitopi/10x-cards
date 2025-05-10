import { type Locator, type Page, expect } from "@playwright/test";

export class FlashcardsPage {
  readonly page: Page;
  readonly container: Locator;
  readonly table: Locator;
  readonly loadingIndicator: Locator;
  readonly errorMessage: Locator;
  readonly retryButton: Locator;
  readonly noFlashcardsMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.getByTestId("flashcards-container");
    this.table = page.getByTestId("flashcard-table");
    this.loadingIndicator = page.getByTestId("flashcards-loading");
    this.errorMessage = page.getByTestId("flashcards-error");
    this.retryButton = page.getByTestId("flashcards-retry-button");
    this.noFlashcardsMessage = page.getByTestId("no-flashcards-message");
  }

  async goto() {
    await this.page.goto("/flashcards");
  }

  async waitForLoad() {
    await expect(this.loadingIndicator).not.toBeVisible();
    await expect(this.container).toBeVisible();
  }

  async getFlashcardRow(id: string) {
    return this.page.getByTestId(`flashcard-row-${id}`);
  }

  async getFlashcardStatus(id: string) {
    return this.page.getByTestId(`flashcard-status-${id}`);
  }

  async expectFlashcardVisible(id: string) {
    const row = await this.getFlashcardRow(id);
    await expect(row).toBeVisible();
  }

  async expectFlashcardStatus(id: string, status: "accepted" | "rejected" | "pending") {
    const statusElement = await this.getFlashcardStatus(id);
    await expect(statusElement).toHaveText(status, { ignoreCase: true });
  }

  async expectNoFlashcards() {
    await expect(this.noFlashcardsMessage).toBeVisible();
  }

  async expectError() {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.retryButton).toBeVisible();
  }

  async retry() {
    await this.retryButton.click();
    await this.waitForLoad();
  }
}
