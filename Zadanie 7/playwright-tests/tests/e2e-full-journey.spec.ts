import { test, expect } from '@playwright/test';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

const suffix = Date.now().toString(36) + Math.floor(Math.random() * 10000).toString(36);
const user = {
  email: `e2e_${suffix}@example.com`,
  password: 'PlaywrightPass1',
  fullName: `Tester ${suffix}`
};

test.beforeAll(async ({ request }) => {
  const r = await request.post(`${BACKEND_URL}/api/_test/reset`);
  expect(r.ok()).toBeTruthy();
});

test('pelny przeplyw uzytkownika', async ({ page, context }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Shop/i);
  await expect(page.getByTestId('nav-products')).toBeVisible();
  await expect(page.getByTestId('nav-cart')).toBeVisible();
  await expect(page.getByTestId('nav-login')).toBeVisible();
  await expect(page.getByTestId('nav-register')).toBeVisible();
  await expect(page.getByTestId('nav-cart-count')).toHaveText('0');
  await expect(page.getByTestId('products-grid')).toBeVisible();

  const cards = page.locator('[data-testid^="product-"][data-testid$="-name"]');
  await expect(cards).toHaveCount(5);
  await expect(page.getByTestId('product-1-name')).toHaveText('Laptop');
  await expect(page.getByTestId('product-1-price')).toHaveText('$999.99');
  await expect(page.getByTestId('product-2-name')).toHaveText('Mouse');
  await expect(page.getByTestId('product-2-price')).toHaveText('$29.99');
  await expect(page.getByTestId('product-3-name')).toHaveText('Keyboard');
  await expect(page.getByTestId('product-5-name')).toHaveText('Headphones');

  await page.getByTestId('nav-register').click();
  await expect(page).toHaveURL(/\/register$/);
  await expect(page.getByTestId('register-form')).toBeVisible();
  await expect(page.getByTestId('register-submit')).toBeEnabled();

  await page.getByTestId('register-submit').click();
  await expect(page.getByTestId('register-error')).toContainText(/required/i);
  await expect(page).toHaveURL(/\/register$/);

  await page.getByTestId('register-fullName').fill('Test User');
  await page.getByTestId('register-email').fill('not-an-email');
  await page.getByTestId('register-password').fill('StrongPass1');
  await page.getByTestId('register-confirmPassword').fill('StrongPass1');
  await page.getByTestId('register-submit').click();
  await expect(page.getByTestId('register-error')).toContainText(/email/i);

  await page.getByTestId('register-email').fill(user.email);
  await page.getByTestId('register-confirmPassword').fill('Different1');
  await page.getByTestId('register-submit').click();
  await expect(page.getByTestId('register-error')).toContainText(/match/i);

  await page.getByTestId('register-fullName').fill(user.fullName);
  await page.getByTestId('register-email').fill(user.email);
  await page.getByTestId('register-password').fill(user.password);
  await page.getByTestId('register-confirmPassword').fill(user.password);
  await page.getByTestId('register-submit').click();
  await expect(page.getByTestId('register-success')).toBeVisible();
  await expect(page.getByTestId('register-success')).toContainText(/successful/i);
  await page.waitForURL(/\/login$/);
  await expect(page).toHaveURL(/\/login$/);

  await expect(page.getByTestId('login-form')).toBeVisible();

  await page.getByTestId('login-email').fill(user.email);
  await page.getByTestId('login-password').fill('WrongPassword');
  await page.getByTestId('login-submit').click();
  await expect(page.getByTestId('login-error')).toBeVisible();
  await expect(page.getByTestId('login-error')).toContainText(/invalid/i);

  await page.getByTestId('login-password').fill(user.password);
  await page.getByTestId('login-submit').click();

  await page.waitForURL(/\/account$/);
  await expect(page).toHaveURL(/\/account$/);
  await expect(page.getByTestId('nav-user')).toHaveText(user.email);
  await expect(page.getByTestId('nav-logout')).toBeVisible();
  await expect(page.getByTestId('nav-login')).toHaveCount(0);
  await expect(page.getByTestId('nav-register')).toHaveCount(0);

  await expect(page.getByTestId('account-email')).toHaveText(user.email);
  await expect(page.getByTestId('account-fullName')).toHaveValue(user.fullName);
  await expect(page.getByTestId('account-address')).toHaveValue('');
  await expect(page.getByTestId('account-notificationsEmail')).toHaveValue(user.email);

  const newAddress = 'Baker Street 221B';
  const newNotif = `notif_${suffix}@example.com`;
  await page.getByTestId('account-address').fill(newAddress);
  await page.getByTestId('account-notificationsEmail').fill(newNotif);
  await page.getByTestId('account-submit').click();
  await expect(page.getByTestId('account-saved')).toBeVisible();
  await expect(page.getByTestId('account-saved')).toContainText(/saved/i);

  await page.reload();
  await expect(page.getByTestId('account-address')).toHaveValue(newAddress);
  await expect(page.getByTestId('account-notificationsEmail')).toHaveValue(newNotif);

  await page.getByTestId('nav-products').click();
  await page.waitForURL(/\/$/);
  await expect(page.getByTestId('products-grid')).toBeVisible();
  await expect(page.getByTestId('nav-cart-count')).toHaveText('0');

  await page.getByTestId('product-1-add').click();
  await expect(page.getByTestId('nav-cart-count')).toHaveText('1');
  await expect(page.getByTestId('products-added')).toContainText('Laptop');

  await page.getByTestId('product-2-add').click();
  await page.getByTestId('product-2-add').click();
  await expect(page.getByTestId('nav-cart-count')).toHaveText('3');

  await page.getByTestId('product-3-add').click();
  await expect(page.getByTestId('nav-cart-count')).toHaveText('4');

  await page.getByTestId('nav-cart').click();
  await page.waitForURL(/\/cart$/);
  await expect(page.getByTestId('cart-table')).toBeVisible();
  await expect(page.getByTestId('cart-total-items')).toHaveText('4');

  await expect(page.getByTestId('cart-name-1')).toHaveText('Laptop');
  await expect(page.getByTestId('cart-qty-1')).toHaveValue('1');
  await expect(page.getByTestId('cart-line-total-1')).toHaveText('$999.99');

  await expect(page.getByTestId('cart-name-2')).toHaveText('Mouse');
  await expect(page.getByTestId('cart-qty-2')).toHaveValue('2');
  await expect(page.getByTestId('cart-line-total-2')).toHaveText('$59.98');

  await expect(page.getByTestId('cart-name-3')).toHaveText('Keyboard');
  await expect(page.getByTestId('cart-qty-3')).toHaveValue('1');
  await expect(page.getByTestId('cart-line-total-3')).toHaveText('$79.99');

  const total1 = (999.99 + 29.99 * 2 + 79.99).toFixed(2);
  await expect(page.getByTestId('cart-grand-total')).toHaveText(`$${total1}`);

  await page.getByTestId('cart-qty-1').fill('2');
  await page.getByTestId('cart-qty-1').press('Tab');
  await expect(page.getByTestId('cart-line-total-1')).toHaveText('$1999.98');
  await expect(page.getByTestId('nav-cart-count')).toHaveText('5');

  await page.getByTestId('cart-remove-3').click();
  await expect(page.locator('[data-testid="cart-row-3"]')).toHaveCount(0);
  await expect(page.getByTestId('nav-cart-count')).toHaveText('4');

  const total2 = (999.99 * 2 + 29.99 * 2).toFixed(2);
  await expect(page.getByTestId('cart-grand-total')).toHaveText(`$${total2}`);

  const tab2 = await context.newPage();
  await tab2.goto('/cart');
  await expect(tab2.getByTestId('cart-table')).toBeVisible();
  await expect(tab2.getByTestId('cart-total-items')).toHaveText('4');
  await expect(tab2.getByTestId('cart-grand-total')).toHaveText(`$${total2}`);

  await tab2.getByTestId('cart-qty-2').fill('5');
  await tab2.getByTestId('cart-qty-2').press('Tab');
  await expect(page.getByTestId('nav-cart-count')).toHaveText('7');
  const total3 = (999.99 * 2 + 29.99 * 5).toFixed(2);
  await expect(page.getByTestId('cart-grand-total')).toHaveText(`$${total3}`);
  await tab2.close();

  await page.getByTestId('cart-clear').click();
  await expect(page.getByTestId('cart-empty')).toBeVisible();
  await expect(page.getByTestId('cart-total-items')).toHaveText('0');
  await expect(page.getByTestId('nav-cart-count')).toHaveText('0');

  await page.getByTestId('nav-logout').click();
  await expect(page.getByTestId('nav-login')).toBeVisible();
  await expect(page.getByTestId('nav-register')).toBeVisible();
  await expect(page.getByTestId('nav-logout')).toHaveCount(0);
  await expect(page.getByTestId('nav-account')).toHaveCount(0);

  await page.goto('/account');
  await page.waitForURL(/\/login$/);
  await expect(page).toHaveURL(/\/login$/);

  const health = await page.request.get(`${BACKEND_URL}/api/health`);
  expect(health.status()).toBe(200);
  const productsRes = await page.request.get(`${BACKEND_URL}/api/products`);
  expect(productsRes.status()).toBe(200);
  const productsJson = await productsRes.json();
  expect(Array.isArray(productsJson)).toBe(true);
  expect(productsJson.length).toBe(5);
});
