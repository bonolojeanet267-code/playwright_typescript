import { test, expect } from '@playwright/test';
import { Env } from '@e2e/frameworkConfig/env';
import LoginPage from '@pages/loginPage';
import InventoryPage from '@pages/inventoryPage';

test.describe('SauceDemo inventory UI', () => {
  test('logs in and displays the inventory', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto(Env.BASE_URL);
    const inventoryPage = await loginPage.login(Env.USERNAME, Env.PASSWORD);

    await expect(page).toHaveURL(/inventory.html/);
    await expect(inventoryPage.productsHeader).toBeVisible();
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
  });

  test('sorts products by price from low to high', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto(Env.BASE_URL);
    const inventoryPage = await loginPage.login(Env.USERNAME, Env.PASSWORD);

    await inventoryPage.sortDropdown.selectOption('lohi');
    await expect(inventoryPage.productNames.first()).toHaveText('Sauce Labs Onesie');
    await expect(inventoryPage.productNames.last()).toHaveText('Sauce Labs Fleece Jacket');
  });

  test('adds and removes an item from the cart', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto(Env.BASE_URL);
    const inventoryPage = await loginPage.login(Env.USERNAME, Env.PASSWORD);

    await inventoryPage.addBackpackButton.click();
    await expect(inventoryPage.cartBadge).toHaveText('1');
    await inventoryPage.cartLink.click();
    await inventoryPage.removeButton.click();
    await expect(inventoryPage.cartBadge).toHaveCount(0);
    await expect(inventoryPage.backpackText).toHaveCount(0);
  });

  test('requires checkout information', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto(Env.BASE_URL);
    const inventoryPage = await loginPage.login(Env.USERNAME, Env.PASSWORD);

    await inventoryPage.addBackpackButton.click();
    await inventoryPage.cartLink.click();
    await inventoryPage.checkoutButton.click();
    await inventoryPage.continueButton.click();
    await expect(inventoryPage.firstNameError).toBeVisible();
  });

  test('adds an item and completes checkout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto(Env.BASE_URL);
    const inventoryPage = await loginPage.login(Env.USERNAME, Env.PASSWORD);

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

test('rejects invalid login credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await page.goto(Env.BASE_URL);
  await loginPage.login('standard_user', 'incorrect_password');

  await expect(page.getByRole('alert')).toContainText('Username and password do not match any user');
});
