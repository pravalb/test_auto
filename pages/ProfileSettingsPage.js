/**
 * Profile Settings Page Object - Essential Methods Only
 * 
 * Clean, focused page object for Profile Settings functionality
 */

const fs = require('fs');
const path = require('path');

class ProfileSettingsPage {
    constructor(page) {
        this.page = page;
        
        // Main page elements
        this.settingsHeader = page.locator('h1:has-text("Settings"), h2:has-text("Settings"), .settings-header');
        this.backToSettingsLink = page.locator('a:has-text("Back to Settings"), button:has-text("Back")');
        
        // Display name elements
        this.displayNameLabel = page.locator('label:has-text("Display name"), text="Display name"');
        this.displayNameText = page.locator('p.flex-1.text-sm.text-foreground');
        this.displayNameValue = page.locator('p:has-text("Pravallika")').first();
        
        // Edit functionality
        this.displayNameEditButton = page.locator('button[data-tour-action="name-edit"]');
        this.displayNameInput = page.locator('input[name="displayName"]').first();
        this.displayNameSaveButton = page.locator('button[data-tour-action="name-save"]');
        this.displayNameCancelButton = page.locator('button[data-tour-action="name-cancel"]');
        
        // Account details
        this.emailLabel = page.locator('label:has-text("Email"), text="Email"');
        this.emailValue = page.locator('p:contains("@")').first();
        this.timezoneLabel = page.locator('label:has-text("Timezone"), text="Timezone"');
        this.timezoneValue = page.locator('text=/UTC[+-]\d{2}:\d{2}/').first();
        this.timezoneDropdown = page.locator('select, [role="combobox"]').first();
        
        // Display image elements
        this.displayImage = page.locator('img[alt*="profile"], img[alt*="avatar"], .profile-image, .avatar-image').first();
        this.imageEditButton = page.locator('button:has-text("Edit"), [aria-label*="edit"]').first();
        this.imageUploadButton = page.locator('button:has-text("Upload"), input[type="file"]').first();
    }

    /**
     * Navigation Methods
     */
    async navigateToProfileSettings() {
        // Navigate to profile settings page
        await this.page.goto('https://dev.chat.hilalsoftware.tools/settings/profile');
        await this.waitForPageLoad();
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
        await this.settingsHeader.waitFor({ state: 'visible', timeout: 10000 });
    }

    /**
     * Display Name Methods
     */
    async getCurrentDisplayName() {
        try {
            // Try primary selector first
            const nameText = await this.displayNameText.textContent();
            return nameText?.trim() || '';
        } catch (error) {
            // Fallback to alternative selector
            try {
                const altText = await this.displayNameValue.textContent();
                return altText?.trim() || '';
            } catch (altError) {
                console.log('Could not find display name text');
                return '';
            }
        }
    }

    async clickEditDisplayName() {
        console.log('🔍 Clicking edit button...');
        await this.displayNameEditButton.click();
        await this.page.waitForTimeout(1000);
        console.log('✅ Edit button clicked');
    }

    async editDisplayName(newName) {
        await this.displayNameInput.clear();
        await this.displayNameInput.fill(newName);
        await this.page.waitForTimeout(500);
    }

    async saveDisplayName() {
        console.log('🔍 Attempting to save display name...');
        
        // Check if save button is enabled
        const isEnabled = await this.displayNameSaveButton.isEnabled();
        console.log(`Save button enabled: ${isEnabled}`);
        
        if (!isEnabled) {
            console.log('⚠️ Save button disabled, triggering validation...');
            // Trigger validation by interacting with input
            await this.displayNameInput.click();
            await this.page.keyboard.press('End');
            await this.page.keyboard.press('Space');
            await this.page.keyboard.press('Backspace');
            await this.page.waitForTimeout(500);
        }
        
        await this.displayNameSaveButton.click();
        console.log('✅ Save button clicked');
        await this.page.waitForTimeout(1000);
    }

    async changeDisplayName(newName) {
        await this.clickEditDisplayName();
        await this.editDisplayName(newName);
        await this.saveDisplayName();
    }

    /**
     * Email and Timezone Methods
     */
    async getDisplayedEmail() {
        try {
            const emailText = await this.emailValue.textContent();
            return emailText?.trim() || '';
        } catch (error) {
            console.log('Could not find email');
            return '';
        }
    }

    async getCurrentTimezone() {
        try {
            const timezoneText = await this.timezoneValue.textContent();
            return timezoneText?.trim() || '';
        } catch (error) {
            console.log('Could not find timezone');
            return '';
        }
    }

    async openTimezoneDropdown() {
        await this.timezoneDropdown.click();
        await this.page.waitForTimeout(500);
    }

    async selectTimezone(timezone) {
        await this.openTimezoneDropdown();
        
        // Look for timezone option
        const option = this.page.locator(`text="${timezone}"`).first();
        await option.click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * Display Image Methods
     */
    async hoverOverDisplayImage() {
        await this.displayImage.hover();
        await this.page.waitForTimeout(500);
    }

    async clickEditImage() {
        await this.hoverOverDisplayImage();
        await this.imageEditButton.click();
    }

    async clickUploadImage() {
        await this.hoverOverDisplayImage();
        await this.imageUploadButton.click();
    }

    /**
     * Utility Methods
     */
    async takeScreenshot(name) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `${name}-${timestamp}.png`;
        await this.page.screenshot({ 
            path: `test-results/screenshots/${filename}`,
            fullPage: true 
        });
        console.log(`📸 Screenshot saved: ${filename}`);
    }

    /**
     * Static Validation Methods
     */
    static isValidDisplayName(name) {
        if (!name || typeof name !== 'string') return false;
        const trimmed = name.trim();
        return trimmed.length >= 2 && trimmed.length < 30;
    }

    static isValidEmail(email) {
        if (!email || typeof email !== 'string') return false;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    static getDisplayNameValidationError(name) {
        if (!name || (typeof name === 'string' && name.trim() === '')) {
            return 'Display name is required';
        }
        if (typeof name === 'string' && name.trim().length < 2) {
            return 'Display name must be at least 2 characters';
        }
        if (typeof name === 'string' && name.trim().length >= 30) {
            return 'Display name must be less than 30 characters';
        }
        return null;
    }

    /**
     * Load test data from JSON file
     */
    static loadTestData() {
        try {
            const dataPath = path.join(__dirname, '..', 'data', 'testData.json');
            if (fs.existsSync(dataPath)) {
                const rawData = fs.readFileSync(dataPath, 'utf8');
                return JSON.parse(rawData);
            }
        } catch (error) {
            console.log('Could not load test data, using defaults');
        }
        
        // Return default test data
        return {
            profileSettings: {
                validDisplayNames: ['John Doe', 'Jane Smith', 'Test User'],
                timezones: ['UTC+00:00 London', 'UTC+14:00 Kiritimati', 'UTC-05:00 New York']
            }
        };
    }
}

module.exports = ProfileSettingsPage;

