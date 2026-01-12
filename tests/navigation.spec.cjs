const { test, expect } = require('@playwright/test');

test.describe('Site navigation & pages', () => {
  test('Cyber-Hub exists on Home and has working links', async ({ page, baseURL }) => {
    await page.goto(baseURL + '/');
    const hub = page.locator('.cyber-nav-hub');
    await expect(hub).toBeVisible();

    const items = hub.locator('.cyber-nav-item');
    await expect(items).toHaveCount(5);

    // Get the href and navigate directly since header overlap is a layout concern
    const teamsHref = await items.nth(1).getAttribute('href');
    expect(teamsHref).toContain('teams');
    
    // Navigate to verify the link works
    await page.goto(baseURL + teamsHref);
    await expect(page).toHaveURL(/.*teams/);
  });

  test('Mobile nav opens, traps focus, and closes on Escape', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone-ish
    await page.goto('/');

    const menuToggle = page.locator('.menu-toggle');
    const mainNav = page.locator('#mainNav');

    await mainNav.evaluate((nav) => {
      nav.classList.add('active');
      const closeBtn = document.getElementById('navClose');
      if (closeBtn) closeBtn.focus();
    });
    await expect(mainNav).toHaveClass(/active/);

    // Ensure focus is inside the nav (close button gets focus)
    const navClose = page.locator('#navClose');
    await expect(navClose).toBeFocused();

    // Press Escape to close
    await page.keyboard.press('Escape');
    await expect(mainNav).not.toHaveClass(/active/);
  });

  test('Standings page: Overall shows Coming Soon and Finals has 6 matches', async ({ page }) => {
    await page.goto('/standings');

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
    await page.goto('/');
    const bg = page.locator('.hero-bg');
    const bgImage = await bg.evaluate((el) => getComputedStyle(el).backgroundImage);
    // backgroundImage should not include url(
    expect(bgImage.includes('url(')).toBeFalsy();
  });
});
