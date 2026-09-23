import { test, expect } from '@playwright/test';
import FacebookPage from '@pages/facebookPage';

test.describe('Facebook authentication', () => {
  test('should display the sign-up form', async ({ page }) => {
    const facebookPage = new FacebookPage(page);

    await facebookPage.goto();
    await facebookPage.openSignUpForm();
    await facebookPage.expectSignUpFormVisible();
  });

  test('should reject invalid login credentials', async ({ page }) => {
    const facebookPage = new FacebookPage(page);

    await facebookPage.goto();
    await facebookPage.login('facebook-test-invalid@example.com', 'invalid-password');

    await expect(page.getByRole('textbox', {
      name: /email address or mobile number/i,
    })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /password/i })).toBeVisible();
  });
});