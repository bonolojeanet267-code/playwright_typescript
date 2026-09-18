import { test as base, expect, type Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const username = process.env.SAUCE_USERNAME ?? 'standard_user';
const password = process.env.SAUCE_PASSWORD ?? 'secret_sauce';

type AuthenticatedPageFixture = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthenticatedPageFixture>({
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(username, password);
    await use(page);
  },
});

export { expect };