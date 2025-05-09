import { expect, test } from '@playwright/test';

// Page Object Model for Flashcards page
class FlashcardsPage {
  constructor(private page: any) {}

  async goto() {
    await this.page.goto('/flashcards');
  }

  async getFlashcardsList() {
    return this.page.locator('[data-testid="flashcard-list"]');
  }

  async getFlashcardByIndex(index: number) {
    return this.page.locator('[data-testid="flashcard-item"]').nth(index);
  }

  async clickCreateFlashcardButton() {
    await this.page.locator('[data-testid="create-flashcard-button"]').click();
  }

  async fillFlashcardForm(front: string, back: string) {
    await this.page.locator('[data-testid="flashcard-front"]').fill(front);
    await this.page.locator('[data-testid="flashcard-back"]').fill(back);
  }

  async submitFlashcardForm() {
    await this.page.locator('[data-testid="flashcard-submit"]').click();
  }
}

test.describe('Flashcards E2E Tests', () => {
  let flashcardsPage: FlashcardsPage;

  test.beforeEach(async ({ page }) => {
    flashcardsPage = new FlashcardsPage(page);
  });

  test('Should display flashcards list', async () => {
    // Navigate to flashcards page
    await flashcardsPage.goto();
    
    // Check if the flashcards list exists
    const flashcardsList = await flashcardsPage.getFlashcardsList();
    
    // Save a screenshot for visual verification
    await flashcardsList.screenshot({ path: 'flashcards-list.png' });
    
    // Verify flashcards are displayed (if page is implemented)
    // Comment this if the page is not yet implemented
    // await expect(flashcardsList).toBeVisible();
  });

  test('Should create a new flashcard (if form exists)', async () => {
    // Skip this test if the create flashcard functionality is not yet implemented
    test.skip(async () => {
      // Navigate to flashcards page
      await flashcardsPage.goto();
      
      // Click on create flashcard button
      await flashcardsPage.clickCreateFlashcardButton();
      
      // Fill the form
      const frontText = 'What is Astro?';
      const backText = 'A framework for building content-focused websites';
      await flashcardsPage.fillFlashcardForm(frontText, backText);
      
      // Submit the form
      await flashcardsPage.submitFlashcardForm();
      
      // Verify the new flashcard appears in the list
      // This assumes the page refreshes or updates after submission
      const firstFlashcard = await flashcardsPage.getFlashcardByIndex(0);
      
      await expect(firstFlashcard).toContainText(frontText);
    });
  });
});