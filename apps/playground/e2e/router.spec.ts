import { expect, test, type Page } from '@playwright/test';

// The collapse / expand across real routes (React Router): the source unmounts with its route, the next route
// plays the transition from the nodes measured before the navigation.

const tile = (page: Page, name: string) =>
  page.getByRole('main').getByRole('button', { name, exact: true });
const crumb = (page: Page, name: string) =>
  page.getByRole('navigation').getByRole('button', { name, exact: true });
const back = (page: Page) => page.getByRole('navigation').getByRole('button', { name: 'Indietro' });
const overlay = (page: Page) => page.locator('[data-slurp-overlay]');
const grid = (page: Page) => page.getByRole('heading', { name: 'Di cosa hai bisogno?' });

const seek = (page: Page, fraction: number) =>
  page.evaluate((f) => {
    for (const a of document.getAnimations()) {
      a.pause();
      a.currentTime = Number(a.effect?.getComputedTiming().duration ?? 0) * f;
    }
  }, fraction);

const resume = (page: Page) =>
  page.evaluate(() => {
    for (const a of document.getAnimations()) a.play();
  });

/** Computed opacity of the element matched by `selector`. */
const opacity = (page: Page, selector: string) =>
  page
    .locator(selector)
    .first()
    .evaluate((el) => Number(getComputedStyle(el).opacity));

async function expectClean(page: Page) {
  await expect(overlay(page)).toHaveCount(0);
  await expect(page.locator('[data-animation-state]')).toHaveCount(0);
  await expect(page.locator('[aria-busy], [inert]:not(.slurp-dock-panel)')).toHaveCount(0);
}

test('forward: the tiles of /router collapse into the crumb of /router/audio', async ({
  page,
}, info) => {
  await page.goto('/router');
  await expect(tile(page, 'Audio')).toBeVisible();
  await tile(page, 'Audio').click();
  await expect(page).toHaveURL(/\/router\/audio$/);
  // The grid is gone already: the droplets travel from where its tiles were.
  await expect(overlay(page)).toHaveCount(1);
  await expect(tile(page, 'Smartphone')).toHaveCount(0);
  // The new page is hidden while the droplets travel and fades in while they land (last 40%).
  const shown: number[] = [];
  for (const pct of [25, 50, 75]) {
    await seek(page, pct / 100);
    shown.push(await opacity(page, 'main section'));
    await info.attach(`forward-${pct}`, {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
  }
  expect(shown[0]).toBe(0);
  expect(shown[1]).toBe(0);
  expect(shown[2]).toBeGreaterThan(0);
  expect(shown[2]).toBeLessThan(1);
  await resume(page);
  await expect.poll(() => opacity(page, 'main section')).toBe(1);
  await expect(crumb(page, 'Audio')).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('heading', { name: 'Audio' })).toBeFocused();
  await expectClean(page);
});

test('back: the crumb bursts into the tiles of the route it returns to', async ({ page }, info) => {
  await page.goto('/router');
  await tile(page, 'Laptop').click();
  await expect(page.getByRole('heading', { name: 'Laptop' })).toBeVisible();
  await expectClean(page);

  await back(page).click();
  await expect(page).toHaveURL(/\/router$/);
  await expect(overlay(page)).toHaveCount(1);
  for (const pct of [25, 50, 75]) {
    await seek(page, pct / 100);
    await info.attach(`back-${pct}`, { body: await page.screenshot(), contentType: 'image/png' });
  }
  // Only the title and the text fade: the tiles are where the droplets land.
  await seek(page, 0.25);
  expect(await opacity(page, 'main section > div')).toBe(0);
  await resume(page);
  await expect.poll(() => opacity(page, 'main section > div')).toBe(1);
  await expect(grid(page)).toBeFocused();
  for (const name of ['Smartphone', 'Laptop', 'Audio', 'Casa', 'Giochi', 'Foto']) {
    await expect(tile(page, name)).toBeVisible();
  }
  await expectClean(page);
});

test('a direct visit and the browser history only render the route', async ({ page }) => {
  await page.goto('/router/photo');
  await expect(page.getByRole('heading', { name: 'Foto' })).toBeVisible();
  // First load: no handoff, nothing moves, focus stays where the browser puts it.
  await expect(overlay(page)).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Foto' })).not.toBeFocused();

  await back(page).click();
  await expect(grid(page)).toBeVisible();
  await expectClean(page);
  // The browser's back and forward leave no handoff: the routes just swap.
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Foto' })).toBeVisible();
  await expect(overlay(page)).toHaveCount(0);
  await page.goForward();
  await expect(grid(page)).toBeVisible();
  await expectClean(page);
});

test('reduced motion: the next route fades in, no droplets', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/router');
  await tile(page, 'Casa').click();
  await expect(overlay(page)).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Casa' })).toBeVisible({ timeout: 1000 });
  await back(page).click();
  await expect(tile(page, 'Casa')).toBeVisible({ timeout: 1000 });
  await expectClean(page);
});
