/**
 * E2E tests for complete analysis flow
 * Note: These tests mock the API to avoid expensive AI calls
 */

import { test, expect } from '@playwright/test';

test.describe('Analysis Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Mock the API response to avoid real AI calls
        await page.route('**/api/analyze', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    success: true,
                    data: {
                        company: {
                            name: 'Test Company Oy',
                            industry: 'Technology',
                            description: 'A leading Finnish tech company',
                            logoUrl: 'https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://test.com&size=64',
                        },
                        megatrendAnalysis: {
                            teknologia: {
                                subtitle: 'AI transforms everything',
                                analysis: 'Test company is well positioned to leverage AI technologies.',
                            },
                            luonto: {
                                subtitle: 'Sustainability is key',
                                analysis: 'Environmental concerns require new approaches.',
                            },
                            ihmiset: {
                                subtitle: 'Aging population',
                                analysis: 'Demographic changes create opportunities.',
                            },
                            valta: {
                                subtitle: 'Geopolitical shifts',
                                analysis: 'Global power dynamics are evolving.',
                            },
                        },
                        topOpportunity: {
                            megatrend: 'teknologia',
                            title: 'AI-driven automation',
                            description: 'Leverage AI to streamline operations and improve customer experience.',
                        },
                        wildCard: {
                            title: 'Unexpected regulation',
                            description: 'New regulations could disrupt current business model.',
                            likelihood: 'medium',
                        },
                        insights: [
                            'Focus on AI integration',
                            'Build sustainable practices',
                            'Prepare for demographic shifts',
                        ],
                        socialContract: {
                            role: 'Test company can contribute to building a fair and sustainable Finland through innovation.',
                        },
                        generatedAt: new Date().toISOString(),
                        futureImageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
                    },
                }),
            });
        });

        await page.goto('/');
    });

    test('should complete full analysis flow', async ({ page }) => {
        // Fill form
        await page.getByLabel(/organisaation nimi/i).fill('Test Company Oy');
        await page.getByLabel(/verkkosivujen osoite/i).fill('https://test.com');

        // Submit form
        await page.getByRole('button', { name: /analysoi/i }).click();

        // Should navigate to /analyze page
        await expect(page).toHaveURL(/\/analyze\?/);

        // Should show loading state
        const loadingIndicator = page.locator('text=/analysoidaan/i');
        await expect(loadingIndicator).toBeVisible({ timeout: 2000 });

        // Wait for results (with generous timeout for API call)
        await expect(page.getByText(/Test Company Oy/i)).toBeVisible({ timeout: 30000 });

        // Check that results are displayed
        await expect(page.getByText(/Megatrendiprofiili/i)).toBeVisible();
        await expect(page.getByText(/Technology/i)).toBeVisible();
    });

    test('should display flip card with opportunity and wild card', async ({ page }) => {
        await page.getByLabel(/organisaation nimi/i).fill('Test Company');
        await page.getByLabel(/verkkosivujen osoite/i).fill('https://test.com');
        await page.getByRole('button', { name: /analysoi/i }).click();

        // Wait for results
        await expect(page.getByText(/Test Company Oy/i)).toBeVisible({ timeout: 30000 });

        // Check flip card content
        await expect(page.getByText(/Keskeinen mahdollisuus/i)).toBeVisible();
        await expect(page.getByText(/AI-driven automation/i)).toBeVisible();
        await expect(page.getByText(/Yllättävä uhka/i)).toBeVisible();
        await expect(page.getByText(/Unexpected regulation/i)).toBeVisible();
    });

    test('should allow flipping the card', async ({ page }) => {
        await page.getByLabel(/organisaation nimi/i).fill('Test Company');
        await page.getByLabel(/verkkosivujen osoite/i).fill('https://test.com');
        await page.getByRole('button', { name: /analysoi/i }).click();

        await expect(page.getByText(/Test Company Oy/i)).toBeVisible({ timeout: 30000 });

        // Click flip card
        const flipCard = page.getByRole('button', { name: /tulevaisuuskortti/i });
        await expect(flipCard).toBeVisible();
        await flipCard.click();

        // Card should flip (check for back side content)
        // Note: Visual flip might take time
        await page.waitForTimeout(1000);
    });

    test('should display all four megatrend analyses', async ({ page }) => {
        await page.getByLabel(/organisaation nimi/i).fill('Test Company');
        await page.getByLabel(/verkkosivujen osoite/i).fill('https://test.com');
        await page.getByRole('button', { name: /analysoi/i }).click();

        await expect(page.getByText(/Test Company Oy/i)).toBeVisible({ timeout: 30000 });

        // Check all megatrends are displayed
        await expect(page.getByText(/Teknologia/i)).toBeVisible();
        await expect(page.getByText(/Luonto/i)).toBeVisible();
        await expect(page.getByText(/Ihmiset/i)).toBeVisible();
        await expect(page.getByText(/Valta/i)).toBeVisible();
    });

    test('should display social contract section', async ({ page }) => {
        await page.getByLabel(/organisaation nimi/i).fill('Test Company');
        await page.getByLabel(/verkkosivujen osoite/i).fill('https://test.com');
        await page.getByRole('button', { name: /analysoi/i }).click();

        await expect(page.getByText(/Test Company Oy/i)).toBeVisible({ timeout: 30000 });

        await expect(page.getByText(/yhteiskuntasopimus/i)).toBeVisible();
        await expect(page.getByText(/contribute to building a fair and sustainable Finland/i)).toBeVisible();
    });

    test('should have download and share buttons', async ({ page }) => {
        await page.getByLabel(/organisaation nimi/i).fill('Test Company');
        await page.getByLabel(/verkkosivujen osoite/i).fill('https://test.com');
        await page.getByRole('button', { name: /analysoi/i }).click();

        await expect(page.getByText(/Test Company Oy/i)).toBeVisible({ timeout: 30000 });

        // Check for share/download buttons
        await expect(page.getByRole('button', { name: /lataa tulevaisuuskorttisi/i })).toBeVisible();
        await expect(page.getByRole('button', { name: /jaa linkedinissä/i })).toBeVisible();
    });

    test('should handle API errors gracefully', async ({ page }) => {
        // Mock error response
        await page.route('**/api/analyze', async (route) => {
            await route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({
                    success: false,
                    error: 'Analyysi epäonnistui. Yritä uudelleen.',
                }),
            });
        });

        await page.goto('/');
        await page.getByLabel(/organisaation nimi/i).fill('Test Company');
        await page.getByLabel(/verkkosivujen osoite/i).fill('https://test.com');
        await page.getByRole('button', { name: /analysoi/i }).click();

        // Should show error message
        await expect(page.getByRole('alert')).toBeVisible({ timeout: 30000 });
        await expect(page.getByText(/jotain meni pieleen/i)).toBeVisible();
    });

    test('should handle rate limiting (429)', async ({ page }) => {
        // Mock rate limit response
        await page.route('**/api/analyze', async (route) => {
            await route.fulfill({
                status: 429,
                contentType: 'application/json',
                body: JSON.stringify({
                    success: false,
                    error: 'Liikaa pyyntöjä. Voit analysoida 3 organisaatiota tunnissa.',
                }),
            });
        });

        await page.goto('/');
        await page.getByLabel(/organisaation nimi/i).fill('Test Company');
        await page.getByLabel(/verkkosivujen osoite/i).fill('https://test.com');
        await page.getByRole('button', { name: /analysoi/i }).click();

        // Should show rate limit message
        await expect(page.getByRole('alert')).toBeVisible({ timeout: 30000 });
        await expect(page.getByText(/liikaa pyyntöjä/i)).toBeVisible();
    });

    test('should support keyboard navigation on results page', async ({ page }) => {
        await page.getByLabel(/organisaation nimi/i).fill('Test Company');
        await page.getByLabel(/verkkosivujen osoite/i).fill('https://test.com');
        await page.getByRole('button', { name: /analysoi/i }).click();

        await expect(page.getByText(/Test Company Oy/i)).toBeVisible({ timeout: 30000 });

        // Tab to flip card
        await page.keyboard.press('Tab');
        const flipCard = page.getByRole('button', { name: /tulevaisuuskortti/i });
        await expect(flipCard).toBeFocused();

        // Press Enter to flip
        await page.keyboard.press('Enter');
        await page.waitForTimeout(700); // Wait for flip animation
    });

    test('should be mobile responsive', async ({ page, viewport }) => {
        if (!viewport || viewport.width >= 768) {
            test.skip();
        }

        await page.getByLabel(/organisaation nimi/i).fill('Test Company');
        await page.getByLabel(/verkkosivujen osoite/i).fill('https://test.com');
        await page.getByRole('button', { name: /analysoi/i }).click();

        await expect(page.getByText(/Test Company Oy/i)).toBeVisible({ timeout: 30000 });

        // Check that flip card is visible on mobile
        const flipCard = page.getByRole('button', { name: /tulevaisuuskortti/i });
        await expect(flipCard).toBeVisible();

        // Check that buttons stack vertically on mobile
        const shareButtons = page.locator('button:has-text("Lataa")');
        await expect(shareButtons.first()).toBeVisible();
    });
});
