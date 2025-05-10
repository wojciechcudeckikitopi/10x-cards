import { expect, test } from "@playwright/test";
import { getTestCredentials } from "../config/env";
import { DashboardPage } from "../pages/DashboardPage";
import { FlashcardsPage } from "../pages/FlashcardsPage";
import { LoginPage } from "../pages/LoginPage";

test.describe("View Flashcards Scenario", () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let flashcardsPage: FlashcardsPage;
  const credentials = getTestCredentials();

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    flashcardsPage = new FlashcardsPage(page);
  });

  test("should navigate to flashcards list through dashboard", async () => {
    // Given: User starts at login page
    await loginPage.goto();

    // When: User logs in with valid credentials
    await loginPage.login(credentials.username, credentials.password);

    // Then: User should be redirected to dashboard
    await loginPage.expectSuccessfulRedirect();

    // And: Dashboard actions should be visible and enabled after loading
    await dashboardPage.expectActionsVisible();
    await dashboardPage.expectActionsEnabled();

    // When: User clicks on view flashcards button
    await dashboardPage.navigateToFlashcards();

    // Then: Flashcards page should load successfully
    await flashcardsPage.waitForLoad();
    await expect(flashcardsPage.table).toBeVisible();
  });

  test("should handle empty flashcards list", async () => {
    // Given: User is logged in and on flashcards page
    await loginPage.goto();
    await loginPage.login(credentials.username, credentials.password);
    await dashboardPage.navigateToFlashcards();

    // Then: Should show no flashcards message
    await flashcardsPage.waitForLoad();
    await flashcardsPage.expectNoFlashcards();
  });

  test("should handle error state", async ({ page }) => {
    // Given: User is logged in
    await loginPage.goto();
    await loginPage.login(credentials.username, credentials.password);

    // And: Dashboard actions should be visible and enabled after loading
    await dashboardPage.expectActionsVisible();
    await dashboardPage.expectActionsEnabled();

    // When: User navigates to flashcards with server error
    // Mock API to return error
    await page.route("/api/flashcards*", (route) => route.abort());
    await dashboardPage.navigateToFlashcards();

    // Then: Should show error state
    await flashcardsPage.expectError();

    // When: User clicks retry
    // Restore API mock to success
    await page.unroute("/api/flashcards*");
    await flashcardsPage.retry();

    // Then: Should load flashcards
    await flashcardsPage.waitForLoad();
    await expect(flashcardsPage.table).toBeVisible();
  });

  test("should disable action buttons during loading", async () => {
    // Given: User starts at login page
    await loginPage.goto();

    // When: User logs in
    await loginPage.login(credentials.username, credentials.password);

    // Then: Action buttons should be disabled during initial load
    await dashboardPage.expectActionsVisible();
    await dashboardPage.expectActionsDisabled();

    // When: Loading completes
    await dashboardPage.waitForLoad();

    // Then: Action buttons should be enabled
    await dashboardPage.expectActionsEnabled();
  });
});
