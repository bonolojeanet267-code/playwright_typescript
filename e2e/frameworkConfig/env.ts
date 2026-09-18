export class Env {
  public static readonly BASE_URL = process.env.URL ?? 'https://www.saucedemo.com';
  public static readonly USERNAME = process.env.SAUCE_USERNAME ?? 'standard_user';
  public static readonly PASSWORD = process.env.SAUCE_PASSWORD ?? 'secret_sauce';
}
