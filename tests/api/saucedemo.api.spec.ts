import { test, expect } from '@playwright/test';

test.describe('SauceDemo API smoke checks', () => {
  test('site serves the login page', async ({ request }) => {
    const response = await request.get('/');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');
    expect(await response.text()).toContain('Swag Labs');
  });

  test('login page supports a HEAD request', async ({ request }) => {
    const response = await request.head('/');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');
  });

  test('returns not found for an unknown route', async ({ request }) => {
    const response = await request.get('/does-not-exist');

    expect(response.status()).toBe(404);
  });
});
