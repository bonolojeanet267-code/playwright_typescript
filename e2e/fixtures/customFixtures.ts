import { test as base } from '@playwright/test';
import LoginPage from '@pages/loginPage';
import InventoryPage from '@pages/inventoryPage';

interface PageFixtures {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
}

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
});

export { expect } from '@playwright/test';
