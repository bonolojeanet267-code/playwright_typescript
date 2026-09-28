import { test, expect } from '@e2e/fixtures/customFixtures';

test.describe('SauceDemo inventory UI', () => {
  test('reuses the authenticated session and displays the inventory', async ({ page, inventoryPage }) => {
    await page.goto('/inventory.html');

    await expect(page).toHaveURL(/inventory.html/);
    await expect(inventoryPage.productsHeader).toBeVisible();
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
  });

  test('sorts products by price from low to high', async ({ page, inventoryPage }) => {
    await page.goto('/inventory.html');

    await inventoryPage.sortDropdown.selectOption('lohi');
    await expect(inventoryPage.productNames.first()).toHaveText('Sauce Labs Onesie');
    await expect(inventoryPage.productNames.last()).toHaveText('Sauce Labs Fleece Jacket');
  });

  test('adds and removes an item from the cart', async ({ page, inventoryPage }) => {
    await page.goto('/inventory.html');

    await inventoryPage.addBackpackButton.click();
    await expect(inventoryPage.cartBadge).toHaveText('1');
    await inventoryPage.cartLink.click();
    await inventoryPage.removeButton.click();
    await expect(inventoryPage.cartBadge).toHaveCount(0);
    await expect(inventoryPage.backpackText).toHaveCount(0);
  });

  test('requires checkout information', async ({ page, inventoryPage }) => {
    await page.goto('/inventory.html');

    await inventoryPage.addBackpackButton.click();
    await inventoryPage.cartLink.click();
    await inventoryPage.checkoutButton.click();
    await inventoryPage.continueButton.click();
    await expect(inventoryPage.firstNameError).toBeVisible();
  });

  test('adds an item and completes checkout', async ({ page, inventoryPage }) => {
    await page.goto('/inventory.html');

    await inventoryPage.addBackpackButton.click();
    await expect(inventoryPage.cartBadge).toHaveText('1');
    await inventoryPage.cartLink.click();
    await inventoryPage.checkoutButton.click();
    await inventoryPage.firstNameInput.fill('Playwright');
    await inventoryPage.lastNameInput.fill('Tester');
    await inventoryPage.zipInput.fill('00001');
    await inventoryPage.continueButton.click();
    await expect(inventoryPage.paymentInformationText).toBeVisible();
    await inventoryPage.finishButton.click();
    await expect(inventoryPage.thankYouMessage).toBeVisible();
  });
});

test.describe('SauceDemo login validation', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('rejects invalid login credentials', async ({ page, loginPage }) => {
    await page.goto('/');
    await loginPage.login('standard_user', 'incorrect_password');

    await expect(page.getByRole('alert')).toContainText('Username and password do not match any user');
  });
});
