import { type Locator, type Page, expect } from "@playwright/test";

export class DashboardPage {
  readonly page: Page;
  readonly actionsContainer: Locator;
  readonly generateButton: Locator;
  readonly viewFlashcardsButton: Locator;
  readonly startStudyButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.actionsContainer = page.getByTestId("dashboard-actions");
    this.generateButton = page.getByTestId("generate-flashcards-button");
    this.viewFlashcardsButton = page.getByTestId("view-flashcards-button");
    this.startStudyButton = page.getByTestId("start-study-button");
  }

  async goto() {
    await this.page.goto("/dashboard");
  }

  async navigateToFlashcards() {
    await this.viewFlashcardsButton.click();
    await expect(this.page).toHaveURL("/flashcards");
  }

  async navigateToGenerate() {
    await this.generateButton.click();
    await expect(this.page).toHaveURL("/generate");
  }

  async navigateToStudy() {
    await this.startStudyButton.click();
    await expect(this.page).toHaveURL("/study");
  }

  async expectActionsVisible() {
    await expect(this.actionsContainer).toBeVisible();
    await expect(this.generateButton).toBeVisible();
    await expect(this.viewFlashcardsButton).toBeVisible();
    await expect(this.startStudyButton).toBeVisible();
  }

  async expectActionsEnabled() {
    const buttons = this.page.getByTestId("dashboard-actions").getByRole("button");
    await expect(buttons).toHaveCount(3);
    for (const button of await buttons.all()) {
      await expect(button).not.toBeDisabled();
    }
  }

  async expectActionsDisabled() {
    const buttons = this.page.getByTestId("dashboard-actions").getByRole("button");
    await expect(buttons).toHaveCount(3);

    // Wait for loading state to be visible first
    await this.page.waitForSelector('[data-testid="dashboard-actions"] button[disabled]', {
      state: "attached",
      timeout: 2000,
    });

    for (const button of await buttons.all()) {
      await expect(button).toBeDisabled();
    }
  }

  async waitForLoad() {
    // Wait for loading state to complete
    await this.page.waitForSelector('[data-testid="dashboard-actions"] button:not([disabled])');
  }
}
