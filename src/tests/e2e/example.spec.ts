import { expect, test } from '@playwright/test';

test('Homepage loads correctly', async ({ page }) => {
  // Navigate to the homepage
  await page.goto('/');
  
  // Check if the page has expected content
  await expect(page).toHaveTitle(/10x-cards/);
  
  // Take a screenshot for visual verification
  await page.screenshot({ path: 'homepage.png' });
});

test('Navigation works correctly', async ({ page }) => {
  // Navigate to the homepage
  await page.goto('/');
  
  // Find and click a navigation link (if exists)
  // This is just an example, adjust according to your actual navigation structure
  const navLink = page.getByRole('link', { name: /about/i });
  if (await navLink.count() > 0) {
    await navLink.click();
    
    // Check if we've navigated to the expected page
    await expect(page.url()).toContain('/about');
  } else {
    console.log('Navigation link not found, skipping this test');
  }
}); 