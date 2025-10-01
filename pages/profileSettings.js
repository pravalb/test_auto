import BasePage from "./basePage";
import { expect } from "allure-playwright";

class ProfileSettingsPage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;
        
        // Navigation elements
        this.backToSettingsButton = page.getByText('Back to Settings');
        this.settingsTitle = page.getByRole('heading', { name: 'Settings' });
        
        // Display name section
        this.displayNameSection = page.locator('[data-testid="display-name-section"]').or(
            page.locator('text=Display name').locator('xpath=..')
        );
        this.displayNameValue = page.getByText('Pravallika');
        this.displayNameEditButton = this.displayNameSection.getByRole('button').or(
            page.locator('svg[data-testid="edit-icon"]').first()
        );
        this.displayNameInput = page.getByLabel('Display name').or(
            page.locator('input[placeholder*="display name" i]')
        );
        
        // Account Details section
        this.accountDetailsTitle = page.getByText('Account Details');
        
        // Email section
        this.emailLabel = page.getByText('Email');
        this.emailValue = page.locator('text=pravallika2331@gmail.com').or(
            page.locator('[data-testid="email-value"]').or(
                page.locator('text=Email').locator('xpath=..').locator('text=@')
            )
        );
        
        // Timezone section
        this.timezoneLabel = page.getByText('Timezone');
        this.timezoneValue = page.getByText('No timezone set');
        this.timezoneEditButton = page.locator('svg[data-testid="edit-icon"]').last().or(
            this.timezoneValue.locator('xpath=..').getByRole('button')
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
        return await this.displayNameValue.textContent();
    }

    async getCurrentEmail() {
        await expect(this.emailValue).toBeVisible();
        return await this.emailValue.textContent();
    }

    async verifyEmailMatchesEnvironment() {
        const displayedEmail = await this.getCurrentEmail();
        const expectedEmail = process.env.USEREMAIL;
        await expect(this.emailValue).toContainText(expectedEmail);
        return displayedEmail === expectedEmail;
    }

    async getCurrentTimezone() {
        await expect(this.timezoneValue).toBeVisible();
        return await this.timezoneValue.textContent();
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
