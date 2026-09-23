import { expect, type Locator, type Page } from '@playwright/test';

export default class FacebookPage {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly createAccountButton: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.getByRole('textbox', {
      name: /email address or mobile number/i,
    });
    this.passwordInput = page.getByRole('textbox', { name: /password/i });
    this.loginButton = page.getByRole('button', { name: /log in/i });
    this.createAccountButton = page.getByRole('link', {
      name: /create new account/i,
    });
  }

  async goto() {
    await this.page.goto('https://www.facebook.com/');
    await expect(this.loginButton).toBeVisible();
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async openSignUpForm() {
    await this.createAccountButton.click({ noWaitAfter: true });
    await expect(this.page).toHaveURL(/\/reg\//);
  }

  async expectSignUpFormVisible() {
    await expect(this.page.getByRole('textbox', { name: /name/i }).first()).toBeVisible();
    await expect(this.page.getByRole('textbox', { name: /surname/i })).toBeVisible();
    await expect(this.page.getByRole('textbox', {
      name: /mobile number or email address/i,
    })).toBeVisible();
    await expect(this.page.getByRole('textbox', { name: /password/i }).last()).toBeVisible();
    await expect(this.page.getByRole('button', { name: /submit/i })).toBeVisible();
  }
}