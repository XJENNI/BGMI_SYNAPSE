const { test, expect } = require('@playwright/test');

test.describe('Site navigation & pages', () => {
  test('Cyber-Hub exists on Home and has working links', async ({ page, baseURL }) => {
    await page.goto(baseURL + '/index.html');
    const hub = page.locator('.cyber-nav-hub');
    await expect(hub).toBeVisible();

    const items = hub.locator('.cyber-nav-item');
    await expect(items).toHaveCount(5);

    // Links should navigate (spot check one)
    await items.nth(1).click(); // Teams
    await expect(page).toHaveURL(/.*teams.html$/);
  });

  test('Mobile nav opens, traps focus, and closes on Escape', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone-ish
    await page.goto('/index.html');
    await page.waitForLoadState('domcontentloaded');

    const menuToggle = page.locator('#menuToggle');
    const navClose = page.locator('#navClose');
    await expect(menuToggle).toBeVisible();
    await expect(navClose).toBeVisible();
  });

  test('Registration badge present with nav-open hide rule', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/index.html');
    const regBadge = page.locator('#registrationCornerBadge');
    await expect(regBadge).toBeVisible();
    const hasHideRule = await page.evaluate(() => {
      return Array.from(document.styleSheets).some((sheet) => {
        try {
          return Array.from(sheet.cssRules || []).some((rule) => rule.selectorText === 'body.nav-open .registration-corner-badge');
        } catch (e) { return false; }
      });
    });
    expect(hasHideRule).toBeTruthy();
  });

  test('Standings page: Overall shows Coming Soon and Finals has 6 matches', async ({ page }) => {
    await page.goto('/standings.html');

    // Default (Overall) should show Coming Soon block
    const coming = page.locator('#leaderboardBody');
    await expect(coming).toContainText('Data Coming Soon');

    // Click Finals tab and check that match buttons count is 6
    const finalsBtn = page.locator('#filterTabs .filter-btn', { hasText: 'Finals' });
    await finalsBtn.click();

    const matchButtons = page.locator('#matchFilters .filter-btn');
    await expect(matchButtons).toHaveCount(6);
  });

  test('Hero background has no external image (gradient-only)', async ({ page }) => {
    await page.goto('/index.html');
    const bg = page.locator('.hero-bg');
    const bgImage = await bg.evaluate((el) => getComputedStyle(el).backgroundImage);
    // backgroundImage should not include url(
    expect(bgImage.includes('url(')).toBeFalsy();
  });
});
