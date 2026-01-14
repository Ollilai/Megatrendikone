/**
 * E2E tests for Homepage
 */

import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should load homepage successfully', async ({ page }) => {
        await expect(page).toHaveTitle(/Megatrendikone/);
    });

    test('should display main heading', async ({ page }) => {
        const heading = page.getByRole('heading', { name: /Miten megatrendit vaikuttavat/i });
        await expect(heading).toBeVisible();
    });

    test('should have company name input field', async ({ page }) => {
        const input = page.getByLabel(/organisaation nimi/i);
        await expect(input).toBeVisible();
        await expect(input).toBeEditable();
    });

    test('should have website URL input field', async ({ page }) => {
        const input = page.getByLabel(/verkkosivujen osoite/i);
        await expect(input).toBeVisible();
        await expect(input).toBeEditable();
    });

    test('should have analyze button', async ({ page }) => {
        const button = page.getByRole('button', { name: /analysoi/i });
        await expect(button).toBeVisible();
        await expect(button).toBeEnabled();
    });

    test('should have link to about page', async ({ page }) => {
        const link = page.getByRole('link', { name: /tietoa palvelusta/i });
        await expect(link).toBeVisible();
    });

    test('should show validation error for empty form', async ({ page }) => {
        const button = page.getByRole('button', { name: /analysoi/i });
        await button.click();

        const error = page.getByRole('alert');
        await expect(error).toBeVisible();
        await expect(error).toHaveText(/täytä molemmat kentät/i);
    });

    test('should show validation error for invalid URL', async ({ page }) => {
        await page.getByLabel(/organisaation nimi/i).fill('Test Company');
        await page.getByLabel(/verkkosivujen osoite/i).fill('not-a-valid-url');
        await page.getByRole('button', { name: /analysoi/i }).click();

        const error = page.getByRole('alert');
        await expect(error).toBeVisible();
        await expect(error).toHaveText(/tarkista verkkosivun osoite/i);
    });

    test('should navigate to about page', async ({ page }) => {
        await page.getByRole('link', { name: /tietoa palvelusta/i }).click();
        await expect(page).toHaveURL(/\/about/);
        await expect(page.getByRole('heading', { name: /tietoa palvelusta/i })).toBeVisible();
    });

    test('should be responsive on mobile', async ({ page, viewport }) => {
        if (viewport && viewport.width < 768) {
            const heading = page.getByRole('heading', { name: /Miten megatrendit vaikuttavat/i });
            await expect(heading).toBeVisible();

            const form = page.locator('form');
            await expect(form).toBeVisible();
        }
    });

    test('should support keyboard navigation', async ({ page }) => {
        // Tab through form elements
        await page.keyboard.press('Tab'); // Focus company name
        await expect(page.getByLabel(/organisaation nimi/i)).toBeFocused();

        await page.keyboard.press('Tab'); // Focus website URL
        await expect(page.getByLabel(/verkkosivujen osoite/i)).toBeFocused();

        await page.keyboard.press('Tab'); // Focus button
        await expect(page.getByRole('button', { name: /analysoi/i })).toBeFocused();
    });

    test('should have proper ARIA attributes', async ({ page }) => {
        const form = page.locator('form');
        await expect(form).toBeVisible();

        const inputs = await form.getByRole('textbox').all();
        expect(inputs.length).toBeGreaterThanOrEqual(2);

        for (const input of inputs) {
            await expect(input).toHaveAttribute('id');
        }
    });

    test('should display background decorations', async ({ page }) => {
        const body = page.locator('body');
        await expect(body).toHaveClass(/noise/);
    });
});
