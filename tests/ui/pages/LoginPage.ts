import type { Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get usernameInput() {
    return this.page.getByPlaceholder('Username');
  }

  get passwordInput() {
    return this.page.getByPlaceholder('Password');
  }

  get loginButton() {
    return this.page.getByRole('button', { name: 'Login' });
  }

  get errorMessage() {
    return this.page.getByRole('alert');
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
