import BasePage from "./basePage";
import { expect } from "allure-playwright";

class ProfileSettingsPage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;
        
        // Navigation elements
        this.backToSettingsButton = page.getByText('Back to Settings');
        this.settingsTitle = page.getByRole('heading', { name: 'Settings' });
        
        // Display name section - Generic structural selectors
        this.displayNameSection = page.locator('[data-testid="display-name-section"]').or(
            page.locator('text=Display name').locator('xpath=..')
        );
        this.displayNameValue = page.locator('text=Display name').locator('xpath=..').locator('p.flex-1.text-sm.text-foreground');
        this.displayNameEditButton = page.locator('text=Display name').locator('xpath=..').getByRole('button').or(
            page.locator('text=Display name').locator('xpath=..').locator('svg')
        );
        this.displayNameInput = page.getByLabel('Display name').or(
            page.locator('input[placeholder*="display name" i]')
        );
        
        // Account Details section
        this.accountDetailsTitle = page.getByText('Account Details');
        
        // Email section - Generic structural selectors
        this.emailLabel = page.getByText('Email');
        this.emailValue = page.locator('text=Email').locator('xpath=..').locator('p').first();
        
        // Timezone section - Generic structural selectors
        this.timezoneLabel = page.getByText('Timezone');
        this.timezoneValue = page.locator('text=Timezone').locator('xpath=..').locator('p').first();
        this.timezoneEditButton = page.locator('text=Timezone').locator('xpath=..').getByRole('button').or(
            page.locator('text=Timezone').locator('xpath=..').locator('svg')
        );
        this.timezoneDropdown = page.getByRole('combobox', { name: 'Timezone' }).or(
            page.locator('select[name*="timezone" i]')
        );
        
        // Save/Cancel buttons (appear when editing)
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
        
        // Success/Error messages
        this.successMessage = page.locator('[data-testid="success-message"]').or(
            page.locator('.success, .alert-success, [class*="success"]')
        );
        this.errorMessage = page.locator('[data-testid="error-message"]').or(
            page.locator('.error, .alert-error, [class*="error"]')
        );
    }

    async navigateToProfileSettings() {
        // Navigate to profile settings page
        // Note: After login, the app switches from auth.hilalsoftware.tools to chat.hilalsoftware.tools
        // and removes the /hilal-chatbot path
        await this.page.goto('https://dev.chat.hilalsoftware.tools/settings/profile');
        await this.waitforPageLoad();
        await expect(this.settingsTitle).toBeVisible();
    }

    async verifyProfileSettingsPageLoaded() {
        await expect(this.settingsTitle).toBeVisible();
        await expect(this.accountDetailsTitle).toBeVisible();
        await expect(this.displayNameValue).toBeVisible();
        await expect(this.emailValue).toBeVisible();
        await expect(this.timezoneValue).toBeVisible();
    }

    async getCurrentDisplayName() {
        await expect(this.displayNameValue).toBeVisible();
        const text = await this.displayNameValue.textContent();
        return text?.trim() || '';
    }

    async getCurrentEmail() {
        await expect(this.emailValue).toBeVisible();
        const text = await this.emailValue.textContent();
        return text?.trim() || '';
    }

    async verifyEmailMatchesEnvironment() {
        const displayedEmail = await this.getCurrentEmail();
        const expectedEmail = process.env.USEREMAIL;
        await expect(this.emailValue).toContainText(expectedEmail);
        return displayedEmail === expectedEmail;
    }

    async getCurrentTimezone() {
        await expect(this.timezoneValue).toBeVisible();
        const text = await this.timezoneValue.textContent();
        return text?.trim() || '';
    }

    async editDisplayName(newDisplayName) {
        // Click edit button for display name
        await this.displayNameEditButton.click();
        
        // Wait for input field to appear
        await expect(this.displayNameInput).toBeVisible();
        
        // Clear existing value and enter new name
        await this.displayNameInput.clear();
        await this.displayNameInput.fill(newDisplayName);
        
        // Save changes
        await this.saveButton.click();
        await this.waitforPageLoad();
    }

    async editTimezone(newTimezone) {
        // Click edit button for timezone
        await this.timezoneEditButton.click();
        
        // Wait for dropdown to appear
        await expect(this.timezoneDropdown).toBeVisible();
        
        // Select new timezone
        await this.timezoneDropdown.selectOption({ label: newTimezone });
        
        // Save changes
        await this.saveButton.click();
        await this.waitforPageLoad();
    }

    async cancelDisplayNameEdit() {
        await this.displayNameEditButton.click();
        await expect(this.displayNameInput).toBeVisible();
        await this.cancelButton.click();
    }

    async cancelTimezoneEdit() {
        await this.timezoneEditButton.click();
        await expect(this.timezoneDropdown).toBeVisible();
        await this.cancelButton.click();
    }

    async verifyDisplayNameUpdated(expectedName) {
        await expect(this.displayNameValue).toContainText(expectedName);
    }

    async verifyTimezoneUpdated(expectedTimezone) {
        await expect(this.timezoneValue).toContainText(expectedTimezone);
    }

    async verifySuccessMessage() {
        await expect(this.successMessage).toBeVisible();
    }

    async verifyErrorMessage() {
        await expect(this.errorMessage).toBeVisible();
    }

    async navigateBackToSettings() {
        await this.backToSettingsButton.click();
        await this.waitforPageLoad();
    }

    async validateEmailFieldIsReadOnly() {
        // Email should not have an edit button or should be disabled
        const emailEditButton = this.page.locator('text=Email').locator('xpath=..').getByRole('button');
        await expect(emailEditButton).not.toBeVisible();
    }

    async validateRequiredFieldsPresent() {
        await expect(this.displayNameValue).toBeVisible();
        await expect(this.emailValue).toBeVisible();
        await expect(this.timezoneValue).toBeVisible();
    }

    async attemptInvalidDisplayName(invalidName) {
        // Display name validation rules: minimum 2 characters, maximum 30 characters
        await this.displayNameEditButton.click();
        await expect(this.displayNameInput).toBeVisible();
        await this.displayNameInput.clear();
        await this.displayNameInput.fill(invalidName);
        await this.saveButton.click();
    }

    async validateDisplayNameLength(displayName) {
        // Validate display name meets requirements: 2-30 characters
        const length = displayName.trim().length;
        return length >= 2 && length <= 30;
    }
}

export default ProfileSettingsPage;
