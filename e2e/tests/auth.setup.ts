import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { test as setup, expect } from '@playwright/test';
import LoginPage from '@pages/loginPage';
import { Env } from '@e2e/frameworkConfig/env';

const authFile = resolve('playwright/.auth/user.json');

setup('authenticate SauceDemo user', async ({ page }) => {
  await mkdir(dirname(authFile), { recursive: true });

  const loginPage = new LoginPage(page);
  await page.goto(Env.BASE_URL);
  await loginPage.login(Env.USERNAME, Env.PASSWORD);
  await expect(page).toHaveURL(/inventory.html/);
  await page.context().storageState({ path: authFile });
});