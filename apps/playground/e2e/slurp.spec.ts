import { expect, test, type Page } from '@playwright/test';

// The transitions run on Web Animations, which page.clock does not drive: frames are taken by pausing every
// animation and seeking it, so each screenshot shows an exact point of the timeline.

const tile = (page: Page, name: string) =>
  page.getByRole('main').getByRole('button', { name, exact: true });
const crumb = (page: Page, name: string) =>
  page.getByRole('navigation').getByRole('button', { name, exact: true });
const back = (page: Page) => page.getByRole('navigation').getByRole('button', { name: 'Indietro' });
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

/** Nothing left behind: no overlay, no hidden element, no blocked region (closed panels are inert by design). */
async function expectClean(page: Page) {
  await expect(overlay(page)).toHaveCount(0);
  await expect(page.locator('[data-animation-state]')).toHaveCount(0);
  await expect(
    page.locator('[aria-busy], [inert]:not(.slurp-bloom-panel, .slurp-dock-panel)'),
  ).toHaveCount(0);
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

  await back(page).click();
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

// Performance is checked as work, not as time: a shared CI machine (software rendering, other jobs) changes the
// frame rate, not how much the engine does. After measuring at the start the transition belongs to Web Animations,
// so while the droplets fly there is no layout and at most one style recalculation per frame (radius and colour run
// on the main thread). Frame rate and script time grow with the machine's load: they are reported, not asserted;
// the playground shows the frame rate live.

/** Properties a transition may animate: none of them changes layout. */
const ANIMATED = new Set(['transform', 'opacity', 'borderRadius', 'backgroundColor', 'fill']);
const FRAME_MS = 1000 / 60;

/**
 * Resolves once the transition has played `share` of its duration (read on a droplet: the page's own CSS transitions
 * and animations keep other clocks), checked in the page every frame. With `pause`, every animation stops right
 * there: what is measured next cannot include the cleanup.
 */
const reach = (page: Page, share: number, pause = false) =>
  page.evaluate(
    ({ share, pause }) =>
      new Promise<void>((done, fail) => {
        let seen = false;
        const check = () => {
          const layer = document.querySelector('[data-slurp-overlay]');
          if (!layer && seen) return fail(new Error(`the transition ended before ${share * 100}%`));
          seen ||= !!layer;
          const a = layer?.getAnimations({ subtree: true })[0];
          const total = Number(a?.effect?.getComputedTiming().duration ?? 0);
          if (a && total > 0 && Number(a.currentTime ?? 0) >= total * share) {
            if (pause) for (const x of document.getAnimations()) x.pause();
            done();
          } else requestAnimationFrame(check);
        };
        check();
      }),
    { share, pause },
  );

for (const goo of ['false', 'true']) {
  test(`does no layout while the droplets fly${goo === 'true' ? ', liquid bridges on' : ''}`, async ({
    page,
  }) => {
    await page.getByLabel('Ponti liquidi (goo)').selectOption(goo);
    // Longer than the default: more frames to measure on a slow machine; the work per frame is the same.
    await page.getByLabel(/Durata/).fill('1500');
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Performance.enable');
    const metrics = async () => {
      const { metrics: list } = await cdp.send('Performance.getMetrics');
      return Object.fromEntries(list.map((m) => [m.name, m.value]));
    };

    for (const [name, control] of [
      ['collapse', () => tile(page, 'Casa')],
      ['expand', () => back(page)],
    ] as const) {
      // From the keyboard: a mouse leaves the tile hovered and pressed, and its own CSS transition (a lift) ends
      // mid-flight with a layout that is not the engine's.
      await control().focus();
      await page.keyboard.press('Enter');
      // The app's own work at the start (the Controls re-render) settles first; the flight is measured from 10% to
      // 70%, where the timeline is paused.
      await expect(stats(page)).toHaveText('In corso…');
      await reach(page, 0.1);
      const from = await metrics();
      await reach(page, 0.7, true);
      const to = await metrics();
      const elapsed = ((to.Timestamp ?? 0) - (from.Timestamp ?? 0)) * 1000;
      const frames = Math.ceil(elapsed / FRAME_MS) + 2;
      const layouts = (to.LayoutCount ?? 0) - (from.LayoutCount ?? 0);
      const styles = (to.RecalcStyleCount ?? 0) - (from.RecalcStyleCount ?? 0);
      const script = ((to.ScriptDuration ?? 0) - (from.ScriptDuration ?? 0)) * 1000;

      const { properties, layer } = await page.evaluate(() => {
        const skip = new Set(['offset', 'easing', 'composite', 'computedOffset']);
        // The engine's Web Animations only: the tiles' own CSS (hover, drifting blob) is not the transition.
        const keys = document
          .getAnimations()
          .filter((a) => !(a instanceof CSSAnimation || a instanceof CSSTransition))
          .flatMap((a) => (a.effect as KeyframeEffect).getKeyframes())
          .flatMap((k) => Object.keys(k).filter((key) => !skip.has(key)));
        const r = document.querySelector('[data-slurp-overlay]')?.getBoundingClientRect();
        return {
          properties: [...new Set(keys)],
          layer: r && { width: r.width, height: r.height },
        };
      });
      const viewport = page.viewportSize();
      await resume(page);

      expect(layouts, `${name}: layouts while flying`).toBe(0);
      expect(styles, `${name}: style recalculations in ${frames} frames`).toBeLessThanOrEqual(
        frames,
      );
      expect(
        properties.filter((p) => !ANIMATED.has(p)),
        `${name}: animated properties`,
      ).toEqual([]);
      expect(layer, `${name}: overlay`).toBeTruthy();
      expect(layer?.width ?? Infinity).toBeLessThanOrEqual(viewport?.width ?? 0);
      expect(layer?.height ?? Infinity).toBeLessThanOrEqual(viewport?.height ?? 0);

      await expect(stats(page)).toContainText('completata');
      test.info().annotations.push({
        type: 'performance',
        description: `${name}: ${(await stats(page).textContent()) ?? ''}; while flying ${styles} style recalculations, ${script.toFixed(1)} ms of script in ${Math.round(elapsed)} ms`,
      });
      await expect(overlay(page)).toHaveCount(0);
    }
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

test('back pressed during the collapse plays it back (interrupt: reverse)', async ({ page }) => {
  await page.getByLabel(/Durata/).fill('1500');
  await tile(page, 'Smartphone').click();
  await page.waitForTimeout(400);
  await back(page).click();
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

test('list → detail → back: cards collapse into the item crumb, find in page, the crumb bursts back', async ({
  page,
}) => {
  await tile(page, 'Audio').click();
  await expect(page.getByRole('heading', { name: 'Audio' })).toBeFocused();
  const cards = page.getByRole('main').getByRole('button', { name: /Cuffie/ });
  await expect(cards).toHaveCount(7);
  await cards.first().click();
  await expect(page.getByRole('heading', { name: 'Lumen Cuffie 1' })).toBeFocused();
  await expect(crumb(page, 'Lumen Cuffie 1')).toHaveAttribute('aria-current', 'page');
  await expectClean(page);

  const search = page.getByRole('searchbox', { name: 'Cerca' });
  await search.fill('più');
  const counter = page.getByRole('button', { name: /Vai alla prossima corrispondenza/ });
  await expect(counter).toHaveText('1/2');
  await expect(page.locator('mark[data-active]')).toHaveCount(1);
  await search.press('Enter');
  await expect(counter).toHaveText('2/2');

  await back(page).click();
  await expect(page.getByRole('heading', { name: 'Audio' })).toBeFocused();
  await expect(cards).toHaveCount(7);
  await expect(crumb(page, 'Lumen Cuffie 1')).toHaveCount(0);
  await expectClean(page);
});

test('filters in the Dock panel narrow the list; nothing found offers one way out', async ({
  page,
}) => {
  await tile(page, 'Laptop').click();
  await expect(page.getByRole('heading', { name: 'Laptop' })).toBeVisible();
  await page.getByRole('button', { name: 'Filtri' }).click();
  const panel = page.getByRole('region', { name: 'Filtri' });
  await panel.getByRole('button', { name: 'Sotto i 500 €' }).click();
  await expect(page.getByRole('button', { name: 'Filtri, 1 attivo' })).toBeVisible();
  await expect(page.getByText('Nessun risultato')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(panel).toHaveCount(0);
  await page.getByRole('main').getByRole('button', { name: 'Azzera filtri' }).click();
  await expect(page.getByRole('main').getByRole('button', { name: /Laptop/ })).toHaveCount(6);
});
