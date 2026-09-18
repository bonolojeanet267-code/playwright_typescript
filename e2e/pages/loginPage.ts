import { type Page } from '@playwright/test';
import InventoryPage from './inventoryPage';
import { Env } from '../frameworkConfig/env';

class LoginPage {
  constructor(private readonly page: Page) {}

  private usernameInput!: ReturnType<Page['getByPlaceholder']>;
  private passwordInput!: ReturnType<Page['getByPlaceholder']>;
  private loginButton!: ReturnType<Page['getByRole']>;

  async initialize() {
    this.usernameInput = this.page.getByPlaceholder('Username');
    this.passwordInput = this.page.getByPlaceholder('Password');
    this.loginButton = this.page.getByRole('button', { name: 'Login' });
  }

  async visit() {
    await this.page.goto(Env.BASE_URL);
  }

  async login(username: string, password: string) {
    await this.initialize();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    return new InventoryPage(this.page);
  }
}

export default LoginPage;
