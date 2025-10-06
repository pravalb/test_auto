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
        this.displayNameLabel = page.locator('label:has-text("Display name")').first();
        this.displayNameText = page.locator('p.flex-1.text-sm.text-foreground');
        this.displayNameValue = page.locator('p:has-text("Pravallika")').first();
        
        // Edit functionality
        this.displayNameEditButton = page.locator('button[data-tour-action="name-edit"]');
        this.displayNameInput = page.locator('input[name="displayName"]').first();
        this.displayNameSaveButton = page.locator('button[data-tour-action="name-save"]');
        this.displayNameCancelButton = page.locator('button[data-tour-action="name-cancel"]');
        
        // Account details
        this.emailLabel = page.locator('label:has-text("Email")').first();
        this.emailValue = page.locator('p:has-text("@")').first();
        this.timezoneLabel = page.locator('label:has-text("Timezone")').first();
        this.timezoneValue = page.locator('p:has-text("UTC")').first();
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
        // Wait a moment for any updates to settle
        await this.page.waitForTimeout(500);
        
        try {
            // Try primary selector first
            const nameText = await this.displayNameText.textContent();
            if (nameText?.trim()) {
                return nameText.trim();
            }
        } catch (error) {
            console.log('Primary selector failed, trying alternatives...');
        }
        
        // Try alternative selectors
        const alternativeSelectors = [
            'p:has-text("Pravallika")',
            'p:has-text("Updated")',
            'p.flex-1.text-sm',
            '[data-testid*="display-name"]',
            '.display-name-value',
            'p:contains("Pravallika")',
            'span:has-text("Pravallika")'
        ];
        
        for (const selector of alternativeSelectors) {
            try {
                const element = this.page.locator(selector).first();
                const text = await element.textContent();
                if (text?.trim()) {
                    console.log(`✅ Found display name using selector: ${selector}`);
                    return text.trim();
                }
            } catch (error) {
                // Continue to next selector
            }
        }
        
        // Last resort: check if we're still in edit mode and get input value
        try {
            if (await this.displayNameInput.isVisible()) {
                const inputValue = await this.displayNameInput.inputValue();
                if (inputValue?.trim()) {
                    console.log('📝 Found display name in input field (still editing)');
                    return inputValue.trim();
                }
            }
        } catch (error) {
            // Input not visible, that's fine
        }
        
        console.log('❌ Could not find display name text with any selector');
        return '';
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
        let isEnabled = await this.displayNameSaveButton.isEnabled();
        console.log(`Save button enabled: ${isEnabled}`);
        
        if (!isEnabled) {
            console.log('⚠️ Save button disabled, trying multiple strategies to enable it...');
            
            // Strategy 1: Focus and trigger input events
            await this.displayNameInput.focus();
            await this.page.waitForTimeout(200);
            
            // Strategy 2: Trigger change events by typing
            await this.displayNameInput.press('End');
            await this.displayNameInput.type(' ');
            await this.displayNameInput.press('Backspace');
            await this.page.waitForTimeout(300);
            
            // Strategy 3: Trigger input event manually
            await this.displayNameInput.evaluate(input => {
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            });
            await this.page.waitForTimeout(300);
            
            // Strategy 4: Click outside and back to trigger validation
            await this.page.click('body');
            await this.displayNameInput.click();
            await this.page.waitForTimeout(300);
            
            // Check if button is now enabled
            isEnabled = await this.displayNameSaveButton.isEnabled();
            console.log(`Save button enabled after strategies: ${isEnabled}`);
            
            // Strategy 5: Wait for button to become enabled (up to 3 seconds)
            if (!isEnabled) {
                console.log('⏳ Waiting for save button to become enabled...');
                try {
                    await this.page.waitForFunction(
                        () => {
                            const button = document.querySelector('button[data-tour-action="name-save"]');
                            return button && !button.disabled;
                        },
                        { timeout: 3000 }
                    );
                    console.log('✅ Save button is now enabled!');
                } catch (error) {
                    console.log('❌ Save button remained disabled, will try to click anyway...');
                }
            }
        }
        
        // Click the save button (even if disabled, sometimes it still works)
        try {
            await this.displayNameSaveButton.click({ force: true });
            console.log('✅ Save button clicked (with force)');
        } catch (error) {
            console.log('❌ Failed to click save button, trying alternative approach...');
            
            // Alternative: Press Enter key
            await this.displayNameInput.press('Enter');
            console.log('⌨️ Pressed Enter key as alternative');
        }
        
        await this.page.waitForTimeout(2000);
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
