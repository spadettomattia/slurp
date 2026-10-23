import { expect, test, type Page } from '@playwright/test';

// The transitions run on Web Animations, which page.clock does not drive: frames are taken by pausing every
// animation and seeking it, so each screenshot shows an exact point of the timeline.

const tile = (page: Page, name: string) =>
  page.getByRole('main').getByRole('button', { name, exact: true });
const crumb = (page: Page, name: string) =>
  page.getByRole('navigation').getByRole('button', { name, exact: true });
const overlay = (page: Page) => page.locator('[data-slurp-overlay]');
const stats = (page: Page) => page.getByTestId('stats');

/** Pauses every running animation at `fraction` of its duration. */
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

/** Mean distance of the droplets from the centre of the target, in px. */
const spread = (page: Page, target: string) =>
  page.evaluate((name) => {
    const to = [...document.querySelectorAll('nav button')].find((b) => b.textContent === name);
    const t = to?.getBoundingClientRect();
    const drops = [...(document.querySelector('[data-slurp-overlay]')?.children ?? [])].slice(
      0,
      -1,
    );
    if (!t || !drops.length) return -1;
    const d = drops.map((el) => {
      const r = el.getBoundingClientRect();
      return Math.hypot(
        r.x + r.width / 2 - (t.x + t.width / 2),
        r.y + r.height / 2 - (t.y + t.height / 2),
      );
    });
    return d.reduce((a, b) => a + b, 0) / d.length;
  }, target);

/** Nothing left behind: no overlay, no hidden element, no blocked region. */
async function expectClean(page: Page) {
  await expect(overlay(page)).toHaveCount(0);
  await expect(page.locator('[data-animation-state]')).toHaveCount(0);
  await expect(page.locator('[inert], [aria-busy]')).toHaveCount(0);
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(tile(page, 'Audio')).toBeVisible();
});

test('collapse n → 1: frames at 0 / 25 / 50 / 75 / 100%, then the list', async ({ page }, info) => {
  await tile(page, 'Audio').click();
  await expect(overlay(page)).toHaveCount(1);
  const distances: number[] = [];
  for (const pct of [0, 25, 50, 75, 100]) {
    await seek(page, pct / 100);
    distances.push(await spread(page, 'Audio'));
    await info.attach(`collapse-${pct}`, {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
  }
  // The droplets close in on the crumb all the way.
  for (let i = 1; i < distances.length; i++)
    expect(distances[i]).toBeLessThan(distances[i - 1] ?? 0);

  await resume(page);
  await expect(page.getByRole('heading', { name: 'Audio' })).toBeFocused();
  await expectClean(page);
});

test('expand 1 → n: the crumb bursts back into the tiles, all visible at the end', async ({
  page,
}, info) => {
  await tile(page, 'Laptop').click();
  await expect(page.getByRole('heading', { name: 'Laptop' })).toBeVisible();
  await expectClean(page);

  await crumb(page, 'Laptop').click();
  await expect(overlay(page)).toHaveCount(1);
  for (const pct of [25, 50, 75]) {
    await seek(page, pct / 100);
    await info.attach(`expand-${pct}`, { body: await page.screenshot(), contentType: 'image/png' });
  }
  await resume(page);
  await expect(page.getByRole('heading', { name: 'Di cosa hai bisogno?' })).toBeFocused();
  for (const name of ['Smartphone', 'Laptop', 'Audio', 'Casa', 'Giochi', 'Foto']) {
    await expect(tile(page, name)).toBeVisible();
  }
  await expect(crumb(page, 'Laptop')).toHaveCount(0);
  await expectClean(page);
});

// Headless Chromium rasterises in software, where the SVG goo filter is the cost: frame rate is checked with the
// bridges off (the engine itself), the main thread with them on. With a GPU the playground shows the live figure.
for (const goo of ['false', 'true']) {
  test(`runs without long tasks${goo === 'false' ? ' at about 60 fps' : ', liquid bridges on'}`, async ({
    page,
  }) => {
    await page.getByLabel('Ponti liquidi (goo)').selectOption(goo);
    // Long tasks are counted only while a transition runs (overlay on screen): rendering the next view after it is
    // the app's work, not the engine's.
    await page.evaluate(() => {
      const w = window as unknown as { longTasks: number[]; running: boolean };
      w.longTasks = [];
      w.running = false;
      new MutationObserver(() => {
        w.running = !!document.querySelector('[data-slurp-overlay]');
      }).observe(document.body, { childList: true });
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) if (w.running) w.longTasks.push(e.duration);
      }).observe({ type: 'longtask' });
    });
    // Best of three round trips: a busy test machine can drop frames that the engine does not cause.
    const runs: { fps: number; slow: number }[] = [];
    for (let i = 0; i < 3; i++) {
      for (const go of [() => tile(page, 'Casa'), () => crumb(page, 'Casa')]) {
        await go().click();
        await expect(stats(page)).toContainText('completata');
        const [, fps, slow] =
          (await stats(page).textContent())?.match(/(\d+) fps, (\d+) frame/) ?? [];
        runs.push({ fps: Number(fps), slow: Number(slow) });
        await expect(overlay(page)).toHaveCount(0);
      }
    }
    if (goo === 'false') {
      const best = runs.reduce((a, b) => (b.fps > a.fps ? b : a));
      expect(best.fps).toBeGreaterThanOrEqual(50);
      expect(best.slow).toBeLessThanOrEqual(4);
    }
    const longTasks = await page.evaluate(
      () => (window as unknown as { longTasks: number[] }).longTasks,
    );
    expect(longTasks.filter((d) => d > 50)).toEqual([]);
  });
}

test('reverse half-way goes back to the grid', async ({ page }) => {
  await page.getByLabel(/Durata/).fill('1500');
  await tile(page, 'Giochi').click();
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: 'Inverti' }).click();
  await expect(stats(page)).toContainText('invertita');
  await expect(crumb(page, 'Giochi')).toHaveCount(0);
  await expect(tile(page, 'Giochi')).toBeVisible();
  await expectClean(page);
});

test('cancel stops at once and restores everything', async ({ page }) => {
  await page.getByLabel(/Durata/).fill('1500');
  await tile(page, 'Foto').click();
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: 'Annulla' }).click();
  await expect(stats(page)).toContainText('annullata');
  await expect(tile(page, 'Foto')).toBeVisible();
  await expectClean(page);
});

test('the crumb pressed during the collapse plays it back (interrupt: reverse)', async ({
  page,
}) => {
  await page.getByLabel(/Durata/).fill('1500');
  await tile(page, 'Smartphone').click();
  await page.waitForTimeout(400);
  await crumb(page, 'Smartphone').click();
  await expect(crumb(page, 'Smartphone')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Di cosa hai bisogno?' })).toBeVisible();
  await expectClean(page);
});

test('reduced motion: a short fade, no droplets', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await tile(page, 'Audio').click();
  await expect(overlay(page)).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Audio' })).toBeVisible({ timeout: 1000 });
  await expectClean(page);
});
