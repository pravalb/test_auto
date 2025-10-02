/**
 * Profile Settings Page Object Model
 * 
 * This page object contains all the elements and methods related to the Profile Settings page
 * URL: https://dev.chat.hilalsoftware.tools/settings/profile
 * 
 * Features covered:
 * - Display Image (Edit/Upload functionality)
 * - Display Name (View/Edit functionality)
 * - Account Details (Email display, Timezone selection)
 * - Navigation and validation methods
 */

class ProfileSettingsPage {
    constructor(page) {
        this.page = page;
        
        // Page URL and navigation
        this.profileSettingsUrl = 'https://dev.chat.hilalsoftware.tools/settings/profile';
        
        // Header and Navigation Elements
        this.settingsHeader = page.locator('h1:has-text("Settings")');
        this.backToSettingsLink = page.locator('text=Back to Settings');
        
        // Display Image Section Elements
        this.displayImageContainer = page.locator('[data-testid="display-image-container"]').first();
        this.displayImage = page.locator('img[alt*="profile"], img[alt*="avatar"], .profile-image, .avatar-image').first();
        this.imageEditButton = page.locator('button:has-text("Edit"), [data-testid="edit-image-btn"]').first();
        this.imageUploadButton = page.locator('button:has-text("Upload"), [data-testid="upload-image-btn"]').first();
        this.imageHoverActions = page.locator('.image-hover-actions, .profile-image-actions').first();
        
        // Edit Image Modal Elements
        this.editImageModal = page.locator('[role="dialog"]:has-text("Edit Image"), .modal:has-text("Edit Image")');
        this.editImageTitle = page.locator('h2:has-text("Edit Image"), h3:has-text("Edit Image")');
        this.imagePreview = page.locator('.image-preview, [data-testid="image-preview"]');
        
        // Transform Controls
        this.zoomSlider = page.locator('input[type="range"]:near(:text("Zoom")), [data-testid="zoom-slider"]');
        this.zoomValue = page.locator('text=/\\d+%/');
        this.rotationSlider = page.locator('input[type="range"]:near(:text("Rotation")), [data-testid="rotation-slider"]');
        this.rotationValue = page.locator('text=/\\d+°/');
        this.flipHorizontalBtn = page.locator('button:has-text("Flip H"), [data-testid="flip-horizontal"]');
        this.flipVerticalBtn = page.locator('button:has-text("Flip V"), [data-testid="flip-vertical"]');
        
        // Filter Controls
        this.brightnessSlider = page.locator('input[type="range"]:near(:text("Brightness")), [data-testid="brightness-slider"]');
        this.contrastSlider = page.locator('input[type="range"]:near(:text("Contrast")), [data-testid="contrast-slider"]');
        this.saturationSlider = page.locator('input[type="range"]:near(:text("Saturation")), [data-testid="saturation-slider"]');
        this.grayscaleSlider = page.locator('input[type="range"]:near(:text("Grayscale")), [data-testid="grayscale-slider"]');
        this.sepiaSlider = page.locator('input[type="range"]:near(:text("Sepia")), [data-testid="sepia-slider"]');
        this.blurSlider = page.locator('input[type="range"]:near(:text("Blur")), [data-testid="blur-slider"]');
        
        // Modal Action Buttons
        this.cancelButton = page.locator('button:has-text("Cancel")');
        this.saveChangesButton = page.locator('button:has-text("Save Changes"), button:has-text("Save")');
        this.modalCloseButton = page.locator('button[aria-label="Close"], .modal-close, [data-testid="close-modal"]');
        
        // Display Name Section Elements
        this.displayNameLabel = page.locator('label:has-text("Display name"), text=Display name');
        this.displayNameInput = page.locator('input[name="displayName"], input[placeholder*="name"], #displayName');
        this.displayNameEditButton = page.locator('button:near(input[name="displayName"]):has-text("Edit"), [data-testid="edit-display-name"]');
        this.displayNameSaveButton = page.locator('button:near(input[name="displayName"]):has-text("Save"), [data-testid="save-display-name"]');
        this.displayNameCancelButton = page.locator('button:near(input[name="displayName"]):has-text("Cancel"), [data-testid="cancel-display-name"]');
        
        // Account Details Section Elements
        this.accountDetailsHeader = page.locator('h2:has-text("Account Details"), h3:has-text("Account Details")');
        
        // Email Field Elements
        this.emailLabel = page.locator('label:has-text("Email"), text=Email');
        this.emailValue = page.locator('input[name="email"], input[type="email"], [data-testid="email-display"]');
        this.emailText = page.locator('text=/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/');
        
        // Timezone Section Elements
        this.timezoneLabel = page.locator('label:has-text("Timezone"), text=Timezone');
        this.timezoneDropdown = page.locator('select[name="timezone"], [data-testid="timezone-select"]');
        this.timezoneSearchInput = page.locator('input[placeholder*="timezone"], input[placeholder*="Search timezone"]');
        this.timezoneCurrentValue = page.locator('text=/UTC[+-]\\d{2}:\\d{2}/, [data-testid="current-timezone"]');
        this.timezoneOptions = page.locator('[role="option"], .timezone-option, select[name="timezone"] option');
        this.timezoneDropdownTrigger = page.locator('button:near(label:has-text("Timezone")), [data-testid="timezone-trigger"]');
        
        // Common Elements
        this.loadingSpinner = page.locator('.loading, .spinner, [data-testid="loading"]');
        this.successMessage = page.locator('.success-message, .alert-success, [data-testid="success-message"]');
        this.errorMessage = page.locator('.error-message, .alert-error, [data-testid="error-message"]');
        this.saveButton = page.locator('button:has-text("Save"), [data-testid="save-settings"]');
        
        // Validation Message Elements
        this.displayNameRequiredMessage = page.locator('text="Display name is required", [data-testid="display-name-required"]');
        this.displayNameTooShortMessage = page.locator('text="Display name must be at least 2 characters", [data-testid="display-name-too-short"]');
        this.displayNameTooLongMessage = page.locator('text="Display name must be less than 30 characters", [data-testid="display-name-too-long"]');
        this.updateSuccessMessage = page.locator('text="Profile updated successfully", [data-testid="update-success"]');
        this.updateErrorMessage = page.locator('text="Failed to update profile", [data-testid="update-error"]');
        this.validationMessage = page.locator('.validation-message, .field-error, [data-testid="validation-message"]');
        
        // File Upload Elements
        this.fileInput = page.locator('input[type="file"]');
        this.uploadArea = page.locator('.upload-area, [data-testid="upload-area"]');
        this.dragDropArea = page.locator('.drag-drop-area, [data-testid="drag-drop"]');
    }

    /**
     * Navigation Methods
     */
    
    // Navigate to Profile Settings page
    async navigateToProfileSettings() {
        await this.page.goto(this.profileSettingsUrl);
        await this.waitForPageLoad();
    }
    
    // Wait for page to fully load
    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
        await this.settingsHeader.waitFor({ state: 'visible', timeout: 10000 });
    }
    
    // Check if page is loaded correctly
    async isPageLoaded() {
        return await this.settingsHeader.isVisible();
    }

    /**
     * Display Image Methods
     */
    
    // Hover over display image to reveal edit/upload options
    async hoverOverDisplayImage() {
        await this.displayImage.hover();
        await this.page.waitForTimeout(500); // Wait for hover effects
    }
    
    // Click edit image button
    async clickEditImage() {
        await this.hoverOverDisplayImage();
        await this.imageEditButton.click();
        await this.editImageModal.waitFor({ state: 'visible' });
    }
    
    // Click upload image button
    async clickUploadImage() {
        await this.hoverOverDisplayImage();
        await this.imageUploadButton.click();
    }
    
    // Upload image file
    async uploadImageFile(filePath) {
        await this.fileInput.setInputFiles(filePath);
        await this.page.waitForTimeout(1000); // Wait for file processing
    }
    
    // Adjust zoom in edit modal
    async adjustZoom(percentage) {
        await this.zoomSlider.fill(percentage.toString());
        await this.page.waitForTimeout(300);
    }
    
    // Adjust rotation in edit modal
    async adjustRotation(degrees) {
        await this.rotationSlider.fill(degrees.toString());
        await this.page.waitForTimeout(300);
    }
    
    // Apply flip horizontal
    async flipImageHorizontally() {
        await this.flipHorizontalBtn.click();
        await this.page.waitForTimeout(300);
    }
    
    // Apply flip vertical
    async flipImageVertically() {
        await this.flipVerticalBtn.click();
        await this.page.waitForTimeout(300);
    }
    
    // Adjust brightness filter
    async adjustBrightness(value) {
        await this.brightnessSlider.fill(value.toString());
        await this.page.waitForTimeout(300);
    }
    
    // Adjust contrast filter
    async adjustContrast(value) {
        await this.contrastSlider.fill(value.toString());
        await this.page.waitForTimeout(300);
    }
    
    // Save image changes
    async saveImageChanges() {
        await this.saveChangesButton.click();
        await this.editImageModal.waitFor({ state: 'hidden' });
    }
    
    // Cancel image editing
    async cancelImageEditing() {
        await this.cancelButton.click();
        await this.editImageModal.waitFor({ state: 'hidden' });
    }

    /**
     * Display Name Methods
     */
    
    // Get current display name
    async getCurrentDisplayName() {
        return await this.displayNameInput.inputValue();
    }
    
    // Edit display name
    async editDisplayName(newName) {
        await this.displayNameInput.clear();
        await this.displayNameInput.fill(newName);
    }
    
    // Save display name changes
    async saveDisplayName() {
        if (await this.displayNameSaveButton.isVisible()) {
            await this.displayNameSaveButton.click();
        }
    }
    
    // Cancel display name editing
    async cancelDisplayNameEdit() {
        if (await this.displayNameCancelButton.isVisible()) {
            await this.displayNameCancelButton.click();
        }
    }

    /**
     * Account Details Methods
     */
    
    // Get displayed email
    async getDisplayedEmail() {
        const emailElement = await this.emailValue.first();
        if (await emailElement.isVisible()) {
            return await emailElement.inputValue() || await emailElement.textContent();
        }
        return await this.emailText.textContent();
    }
    
    // Get current timezone
    async getCurrentTimezone() {
        return await this.timezoneCurrentValue.textContent();
    }
    
    // Open timezone dropdown
    async openTimezoneDropdown() {
        if (await this.timezoneDropdownTrigger.isVisible()) {
            await this.timezoneDropdownTrigger.click();
        } else {
            await this.timezoneDropdown.click();
        }
        await this.page.waitForTimeout(500);
    }
    
    // Search for timezone
    async searchTimezone(searchTerm) {
        await this.openTimezoneDropdown();
        if (await this.timezoneSearchInput.isVisible()) {
            await this.timezoneSearchInput.fill(searchTerm);
            await this.page.waitForTimeout(500);
        }
    }
    
    // Select timezone by text
    async selectTimezone(timezoneText) {
        await this.openTimezoneDropdown();
        const option = this.page.locator(`text=${timezoneText}`).first();
        await option.click();
        await this.page.waitForTimeout(500);
    }
    
    // Get available timezone options
    async getTimezoneOptions() {
        await this.openTimezoneDropdown();
        return await this.timezoneOptions.allTextContents();
    }

    /**
     * Validation Methods
     */
    
    // Check if success message is displayed
    async isSuccessMessageVisible() {
        return await this.successMessage.isVisible() || await this.updateSuccessMessage.isVisible();
    }
    
    // Check if error message is displayed
    async isErrorMessageVisible() {
        return await this.errorMessage.isVisible() || await this.updateErrorMessage.isVisible();
    }
    
    // Get success message text
    async getSuccessMessage() {
        if (await this.updateSuccessMessage.isVisible()) {
            return await this.updateSuccessMessage.textContent();
        }
        return await this.successMessage.textContent();
    }
    
    // Get error message text
    async getErrorMessage() {
        if (await this.updateErrorMessage.isVisible()) {
            return await this.updateErrorMessage.textContent();
        }
        return await this.errorMessage.textContent();
    }
    
    // Check if loading spinner is visible
    async isLoadingVisible() {
        return await this.loadingSpinner.isVisible();
    }
    
    // Wait for loading to complete
    async waitForLoadingComplete() {
        await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 });
    }
    
    // Check for specific validation messages
    async isDisplayNameRequiredMessageVisible() {
        return await this.displayNameRequiredMessage.isVisible();
    }
    
    async isDisplayNameTooShortMessageVisible() {
        return await this.displayNameTooShortMessage.isVisible();
    }
    
    async isDisplayNameTooLongMessageVisible() {
        return await this.displayNameTooLongMessage.isVisible();
    }
    
    async getValidationMessage() {
        if (await this.displayNameRequiredMessage.isVisible()) {
            return await this.displayNameRequiredMessage.textContent();
        }
        if (await this.displayNameTooShortMessage.isVisible()) {
            return await this.displayNameTooShortMessage.textContent();
        }
        if (await this.displayNameTooLongMessage.isVisible()) {
            return await this.displayNameTooLongMessage.textContent();
        }
        if (await this.validationMessage.isVisible()) {
            return await this.validationMessage.textContent();
        }
        return null;
    }
    
    // Wait for validation message to appear
    async waitForValidationMessage(timeout = 5000) {
        try {
            await this.validationMessage.waitFor({ state: 'visible', timeout });
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Form Validation Methods
     */
    
    // Validate display name format (2-30 characters)
    isValidDisplayName(name) {
        if (!name || typeof name !== 'string') {
            return false;
        }
        const trimmedName = name.trim();
        return trimmedName.length >= 2 && trimmedName.length < 30;
    }
    
    // Get display name validation error message
    getDisplayNameValidationError(name) {
        if (!name || (typeof name === 'string' && name.trim().length === 0)) {
            return "Display name is required";
        }
        if (typeof name === 'string') {
            const trimmedName = name.trim();
            if (trimmedName.length < 2) {
                return "Display name must be at least 2 characters";
            }
            if (trimmedName.length >= 30) {
                return "Display name must be less than 30 characters";
            }
        }
        return null;
    }
    
    // Validate email format
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Check if form has unsaved changes
    async hasUnsavedChanges() {
        // This would depend on the specific implementation
        // Could check for dirty form indicators, enabled save buttons, etc.
        return await this.saveButton.isEnabled();
    }

    /**
     * Utility Methods
     */
    
    // Take screenshot of the page
    async takeScreenshot(name) {
        await this.page.screenshot({ 
            path: `screenshots/profile-settings-${name}-${Date.now()}.png`,
            fullPage: true 
        });
    }
    
    // Wait for specific element to be visible
    async waitForElement(locator, timeout = 5000) {
        await locator.waitFor({ state: 'visible', timeout });
    }
    
    // Get page title
    async getPageTitle() {
        return await this.page.title();
    }
    
    // Check if element is editable
    async isElementEditable(locator) {
        return await locator.isEditable();
    }
    
    // Get element attribute
    async getElementAttribute(locator, attribute) {
        return await locator.getAttribute(attribute);
    }
}

module.exports = ProfileSettingsPage;
