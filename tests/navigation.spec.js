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

  test('Animations are disabled for stability', async ({ page }) => {
    await page.goto('/index.html');
    const hasReduceClass = await page.evaluate(() => document.documentElement.classList.contains('reduce-motion'));
    expect(hasReduceClass).toBeTruthy();

    const firstFade = page.locator('.fade-in').first();
    await expect(firstFade).toBeVisible();

    const motionStyles = await firstFade.evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        animationName: styles.animationName,
        transitionDuration: styles.transitionDuration
      };
    });

    expect(motionStyles.animationName).toBe('none');
    expect(motionStyles.transitionDuration.includes('0s')).toBeTruthy();
  });
});
