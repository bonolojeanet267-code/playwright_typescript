import { test, expect, Page } from '@playwright/test';

const URL = 'https://www.qapractice.com/practice-login-form';

async function login(page: Page, email: string, password: string) {
  await page.getByPlaceholder('Enter your email').fill(email);
  await page.getByPlaceholder('Enter your password').fill(password);

  const signInButton = page.getByRole('button', { name: 'Sign in' });
  await signInButton.scrollIntoViewIfNeeded();
  await signInButton.click();
}

test('TC01 - valid login', async ({ page }) => {
  await page.goto(URL);
  await login(page, 'user@premiumbank.com', 'Bank@123');

  await expect(page.locator('body')).toContainText('Login Successful! Welcome to Premium Banking.');
});

test('TC02 - both fields empty', async ({ page }) => {
  await page.goto(URL);

  const signInButton = page.getByRole('button', { name: 'Sign in' });
  await signInButton.scrollIntoViewIfNeeded();
  await signInButton.click();

  await expect(page.locator('body')).toContainText('Email and Password are required');
});

test('TC03 - missing password', async ({ page }) => {
  await page.goto(URL);
  await login(page, 'user@premiumbank.com', '');

  await expect(page.locator('body')).toContainText('Password is required');
});

test('TC04 - missing email', async ({ page }) => {
  await page.goto(URL);
  await login(page, '', 'Bank@123');

  await expect(page.locator('body')).toContainText('Email is required');
});

test('TC05 - invalid credentials', async ({ page }) => {
  await page.goto(URL);
  await login(page, 'wrong@example.com', 'wrongpassword');

  await expect(page.locator('body')).toContainText('Invalid email id and password');
});

test('TC06 - password is masked', async ({ page }) => {
  await page.goto(URL);

  const passwordField = page.getByPlaceholder('Enter your password');
  await passwordField.fill('Bank@123');

  await expect(passwordField).toHaveAttribute('type', 'password');
});

test('TC07 - forgot password navigation', async ({ page }) => {
  await page.goto(URL);

  await page.getByRole('link', { name: 'Forgot password?' }).click();

  await expect(page).toHaveURL(/\/forget-password/);
});

test('TC08 - register navigation', async ({ page }) => {
  await page.goto(URL);

  await page.getByRole('link', { name: 'Register now' }).click();

  await expect(page).toHaveURL(/\/register/);
});