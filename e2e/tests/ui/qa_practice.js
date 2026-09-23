const { test, expect } = require('@playwright/test');

const URL = 'https://www.qapractice.com/practice-login-form';

test('valid credentials logs the user in', async ({ page }) => {
  await page.goto(URL);

  await page.getByTestId('login-email').fill('user@premiumbank.com');
  await page.getByTestId('login-password').fill('Bank@123');
  await page.getByTestId('login-button').click();

  await expect(page.getByTestId('login-success')).toContainText('Login Successful');
});

test('invalid credentials shows an error message', async ({ page }) => {
  await page.goto(URL);

  await page.getByTestId('login-email').fill('wrong@example.com');
  await page.getByTestId('login-password').fill('wrongpassword');
  await page.getByTestId('login-button').click();

  await expect(page.getByTestId('login-error')).toContainText('Invalid');
});

test('submitting empty fields is rejecting', async ({ page }) => {
  await page.goto(URL);
  await page.getByTestId('login-button').click();
  await expect(page.getByTestId('login-error')).toContainText('Invalid');
});
