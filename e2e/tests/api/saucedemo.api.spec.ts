import { test, expect } from '@e2e/fixtures/customFixtures';

test.describe('SauceDemo API smoke checks', () => {
  test('site serves the login page', async ({ api }) => {
    const response = await api.get('/');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');
    expect(await response.text()).toContain('Swag Labs');
  });

  test('login page supports a HEAD request', async ({ api }) => {
    const response = await api.head('/');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');
  });

  test('returns not found for an unknown route', async ({ api }) => {
    const response = await api.get('/does-not-exist');

    expect(response.status()).toBe(404);
  });
});
