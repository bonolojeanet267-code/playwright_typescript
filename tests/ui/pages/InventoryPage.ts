import type { Page } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get productsHeader() {
    return this.page.getByText('Products');
  }

  get inventoryItems() {
    return this.page.locator('[data-test="inventory-item"]');
  }

  get sortDropdown() {
    return this.page.locator('[data-test="product-sort-container"]');
  }

  get productNames() {
    return this.page.locator('[data-test="inventory-item-name"]');
  }

  get addBackpackButton() {
    return this.page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
  }

  get cartBadge() {
    return this.page.locator('[data-test="shopping-cart-badge"]');
  }

  get cartLink() {
    return this.page.locator('[data-test="shopping-cart-link"]');
  }

  get removeButton() {
    return this.page.getByRole('button', { name: 'Remove' });
  }

  get checkoutButton() {
    return this.page.getByRole('button', { name: 'Checkout' });
  }

  get continueButton() {
    return this.page.getByRole('button', { name: 'Continue' });
  }

  get firstNameInput() {
    return this.page.getByPlaceholder('First Name');
  }

  get lastNameInput() {
    return this.page.getByPlaceholder('Last Name');
  }

  get zipInput() {
    return this.page.getByPlaceholder('Zip/Postal Code');
  }

  get finishButton() {
    return this.page.getByRole('button', { name: 'Finish' });
  }

  get paymentInformationText() {
    return this.page.getByText('Payment Information');
  }

  get thankYouMessage() {
    return this.page.getByText('Thank you for your order!');
  }

  get firstNameError() {
    return this.page.getByText('Error: First Name is required');
  }

  get backpackText() {
    return this.page.getByText('Sauce Labs Backpack');
  }
}
