/**
 * Profile Settings Test Suite - Essential Tests Only
 * 
 * Core functionality testing for Profile Settings page:
 * 1. Page loading and navigation
 * 2. Display name management
 * 3. Email and timezone display
 * 4. Display photo management
 * 5. Basic form validation
 */

const { test, expect } = require('@playwright/test');
const ProfileSettingsPage = require('../pages/ProfileSettingsPage');

test.describe('Profile Settings Page Tests', () => {
    let profileSettingsPage;

    // Setup before each test
    test.beforeEach(async ({ page }) => {
        profileSettingsPage = new ProfileSettingsPage(page);
        
        // Login and navigate to profile settings
        await page.goto(process.env.BASE_URL || 'https://dev.auth.hilalsoftware.tools/hilal-chatbot/login');
        await page.getByLabel('Email address').fill(process.env.USEREMAIL || 'pravallika2330@gmail.com');
        await page.getByLabel('Password').fill(process.env.PASSWORD || 'HilalPassword@123');
        await page.getByRole('button', {name: 'Sign in'}).click();
        
        await page.waitForURL('**/hilal-chatbot/', { timeout: 15000 });
        await page.waitForLoadState('networkidle');
        await page.getByText('Back to application').click();
        await page.getByText('Inbox').first().waitFor({ state: 'visible', timeout: 15000 });
        
        await profileSettingsPage.navigateToProfileSettings();
    });

    /**
     * TC_04_001: Page loads successfully
     */
    test('TC_04_001: Should load Profile Settings page successfully', async () => {
        // Verify page loads correctly
        await expect(profileSettingsPage.settingsHeader).toBeVisible();
        
        // Verify URL is correct
        expect(profileSettingsPage.page.url()).toContain('/settings/profile');
        
        console.log('✅ Profile Settings page loaded successfully');
    });

    /**
     * TC_04_002: Display name is visible
     */
    test('TC_04_002: Should display current display name', async () => {
        // Verify display name is visible
        await expect(profileSettingsPage.displayNameText).toBeVisible();
        
        // Get and verify display name content
        const displayName = await profileSettingsPage.getCurrentDisplayName();
        expect(displayName).toBeTruthy();
        expect(displayName).toContain('Pravallika');
        
        console.log(`✅ Display name visible: "${displayName}"`);
    });

    /**
     * TC_04_003: Email and timezone are visible
     */
    test('TC_04_003: Should display email and timezone information', async () => {
        // Verify email is displayed
        await expect(profileSettingsPage.emailLabel).toBeVisible();
        const email = await profileSettingsPage.getDisplayedEmail();
        expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/); // Basic email format
        
        // Verify timezone is displayed
        await expect(profileSettingsPage.timezoneLabel).toBeVisible();
        const timezone = await profileSettingsPage.getCurrentTimezone();
        expect(timezone).toBeTruthy();
        
        console.log(`✅ Email: ${email}`);
        console.log(`✅ Timezone: ${timezone}`);
    });

    /**
     * TC_04_004: Edit display name workflow
     */
    test('TC_04_004: Should edit display name successfully', async () => {
        // Get original name
        const originalName = await profileSettingsPage.getCurrentDisplayName();
        console.log(`📝 Original name: "${originalName}"`);
        
        // Edit display name
        const newName = 'Pravallika Updated';
        await profileSettingsPage.clickEditDisplayName();
        await expect(profileSettingsPage.displayNameInput).toBeVisible();
        
        await profileSettingsPage.editDisplayName(newName);
        await profileSettingsPage.saveDisplayName();
        
        // Verify name was updated
        await profileSettingsPage.page.waitForTimeout(2000);
        const updatedName = await profileSettingsPage.getCurrentDisplayName();
        expect(updatedName).toContain('Updated');
        
        console.log(`✅ Name updated to: "${updatedName}"`);
        
        // Restore original name
        await profileSettingsPage.changeDisplayName(originalName.trim());
        console.log('🔄 Restored original name');
    });

    /**
     * TC_04_005: Edit timezone
     */
    test('TC_04_005: Should change timezone successfully', async () => {
        // Get current timezone
        const originalTimezone = await profileSettingsPage.getCurrentTimezone();
        console.log(`📍 Original timezone: ${originalTimezone}`);
        
        // Open timezone dropdown
        await profileSettingsPage.openTimezoneDropdown();
        
        // Select a different timezone
        const newTimezone = 'UTC+14:00 Kiritimati';
        await profileSettingsPage.selectTimezone(newTimezone);
        
        // Verify timezone changed
        await profileSettingsPage.page.waitForTimeout(2000);
        const updatedTimezone = await profileSettingsPage.getCurrentTimezone();
        expect(updatedTimezone).toContain('UTC+14:00');
        
        console.log(`✅ Timezone updated to: ${updatedTimezone}`);
        
        // Restore original timezone
        await profileSettingsPage.selectTimezone(originalTimezone);
        console.log('🔄 Restored original timezone');
    });

    /**
     * TC_04_006: Display photo is visible
     */
    test('TC_04_006: Should display profile photo', async () => {
        // Verify profile image is visible
        await expect(profileSettingsPage.displayImage).toBeVisible();
        
        // Verify image has proper attributes
        const imageSrc = await profileSettingsPage.displayImage.getAttribute('src');
        expect(imageSrc).toBeTruthy();
        
        console.log('✅ Profile photo is visible');
    });

    /**
     * TC_04_007: Edit display photo
     */
    test('TC_04_007: Should show photo edit options on hover', async () => {
        // Hover over profile image
        await profileSettingsPage.hoverOverDisplayImage();
        
        // Verify edit options appear
        await expect(profileSettingsPage.imageEditButton).toBeVisible();
        await expect(profileSettingsPage.imageUploadButton).toBeVisible();
        
        console.log('✅ Photo edit options visible on hover');
    });

    /**
     * TC_04_008: Basic navigation works
     */
    test('TC_04_008: Should navigate back to settings', async () => {
        // Test back navigation if available
        if (await profileSettingsPage.backToSettingsLink.isVisible()) {
            await profileSettingsPage.backToSettingsLink.click();
            await expect(profileSettingsPage.page).toHaveURL(/.*settings$/);
            console.log('✅ Back navigation works');
        } else {
            console.log('ℹ️ Back navigation not available');
        }
    });

    /**
     * TC_04_009: Form validation works
     */
    test('TC_04_009: Should validate display name input', async () => {
        // Test empty display name validation
        await profileSettingsPage.clickEditDisplayName();
        await profileSettingsPage.editDisplayName('');
        await profileSettingsPage.saveDisplayName();
        
        // Check if validation prevents empty save
        await profileSettingsPage.page.waitForTimeout(1000);
        const currentName = await profileSettingsPage.getCurrentDisplayName();
        expect(currentName).not.toBe(''); // Should not be empty
        
        console.log('✅ Form validation prevents empty display name');
    });

    /**
     * TC_04_010: Save changes successfully
     */
    test('TC_04_010: Should save profile changes', async () => {
        // Make a change and verify it saves
        const testName = `Test User ${Date.now()}`;
        
        await profileSettingsPage.changeDisplayName(testName);
        
        // Refresh page to verify persistence
        await profileSettingsPage.page.reload();
        await profileSettingsPage.waitForPageLoad();
        
        const savedName = await profileSettingsPage.getCurrentDisplayName();
        expect(savedName).toBe(testName);
        
        console.log('✅ Changes persist after page refresh');
        
        // Cleanup
        await profileSettingsPage.changeDisplayName('Pravallika');
    });

    // Cleanup after each test
    test.afterEach(async () => {
        if (test.info().status === 'failed') {
            await profileSettingsPage.takeScreenshot(`failed-${test.info().title.replace(/[^a-zA-Z0-9]/g, '-')}`);
        }
    });
});

