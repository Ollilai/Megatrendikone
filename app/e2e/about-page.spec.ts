/**
 * E2E tests for About page
 */

import { test, expect } from '@playwright/test';

test.describe('About Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/about');
    });

    test('should load about page successfully', async ({ page }) => {
        await expect(page).toHaveURL(/\/about/);
        await expect(page).toHaveTitle(/Megatrendikone/);
    });

    test('should display main heading', async ({ page }) => {
        const heading = page.getByRole('heading', { name: /tietoa palvelusta/i });
        await expect(heading).toBeVisible();
    });

    test('should have back link to homepage', async ({ page }) => {
        const backLink = page.getByRole('link', { name: /takaisin etusivulle/i });
        await expect(backLink).toBeVisible();
        await backLink.click();
        await expect(page).toHaveURL('/');
    });

    test('should display information about Megatrendikone', async ({ page }) => {
        await expect(page.getByText(/Mikä on Megatrendikone/i)).toBeVisible();
        await expect(page.getByText(/Sitra/i)).toBeVisible();
        await expect(page.getByText(/megatrend/i)).toBeVisible();
    });

    test('should display consultant information', async ({ page }) => {
        await expect(page.getByText(/Olli Laitinen/i)).toBeVisible();
        await expect(page.getByText(/tekoälykonsultti/i)).toBeVisible();
    });

    test('should have external links', async ({ page }) => {
        const linkedInLink = page.getByRole('link', { name: /linkedin/i });
        await expect(linkedInLink).toBeVisible();
        await expect(linkedInLink).toHaveAttribute('target', '_blank');
        await expect(linkedInLink).toHaveAttribute('rel', /noopener noreferrer/);

        const githubLink = page.getByRole('link', { name: /github/i });
        await expect(githubLink).toBeVisible();
        await expect(githubLink).toHaveAttribute('target', '_blank');
    });

    test('should be responsive on mobile', async ({ page, viewport }) => {
        if (viewport && viewport.width < 768) {
            const heading = page.getByRole('heading', { name: /tietoa palvelusta/i });
            await expect(heading).toBeVisible();

            const content = page.locator('section');
            await expect(content).toBeVisible();
        }
    });

    test('should support keyboard navigation', async ({ page }) => {
        await page.keyboard.press('Tab');
        const backLink = page.getByRole('link', { name: /takaisin etusivulle/i });
        await expect(backLink).toBeFocused();
    });
});
