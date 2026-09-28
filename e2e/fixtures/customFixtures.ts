import { test as base, type APIRequestContext } from '@playwright/test';
import LoginPage from '@pages/loginPage';
import InventoryPage from '@pages/inventoryPage';
import { Env } from '@e2e/frameworkConfig/env';

interface PageFixtures {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  api: APIRequestContext;
}

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  api: async ({ playwright }, use) => {
    const api = await playwright.request.newContext({ baseURL: Env.BASE_URL });
    try {
      await use(api);
    } finally {
      await api.dispose();
    }
  },
});

export { expect } from '@playwright/test';
