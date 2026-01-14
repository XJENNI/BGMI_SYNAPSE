const { test, expect } = require('@playwright/test');

test.describe('Site navigation & pages', () => {
  const removeBanner = async (page) => {
    await page.evaluate(() => {
      const banner = document.getElementById('registrationBanner');
      if (banner) banner.remove();
    });
  };

  test('Primary navigation works without Cyber-Hub', async ({ page, baseURL }) => {
    await page.goto(baseURL + '/index.html');

    const hub = page.locator('.cyber-nav-hub');
    await expect(hub).toHaveCount(0);

    const items = page.locator('.main-nav .nav-link');
    await expect(items).toHaveCount(5);

    await removeBanner(page);

    await items.nth(1).click(); // Teams
    await expect(page).toHaveURL(/.*teams.html$/);
  });

  test('Mobile nav controls render on small viewports', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone-ish
    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');

    await removeBanner(page);

    const body = page.locator('body');
    const mainNav = page.locator('#mainNav');

    await expect(mainNav).toHaveCount(1);
    await expect(mainNav).toBeVisible();
    await expect(body).toHaveClass(/animations-softened/);
    await expect(page.locator('.menu-toggle')).toBeVisible();
    await expect(page.locator('#navClose')).toHaveCount(1);
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
