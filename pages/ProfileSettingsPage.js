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
 * - Generic utility functions and helpers
 * - Test data management
 * - Authentication helpers
 * - Screenshot and debugging utilities
 */

const fs = require('fs');
const path = require('path');

class ProfileSettingsPage {
    constructor(page) {
        this.page = page;
        
        // Page URL and navigation
        this.profileSettingsUrl = 'https://dev.chat.hilalsoftware.tools/settings/profile';
        
        // Header and Navigation Elements
        this.settingsHeader = page.locator('h1:has-text("Settings"), h2:has-text("Settings"), h1:has-text("Profile"), h2:has-text("Profile"), [data-testid="settings-header"]');
        this.backToSettingsLink = page.locator('text=Back to Settings, a:has-text("Back")');
        
        // Display Image Section Elements
        this.displayImageContainer = page.locator('[data-testid="display-image-container"], .profile-image-container').first();
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
        this.displayNameLabel = page.locator('text=Display name');
        
        // Display name is a read-only text element initially
        this.displayNameText = page.locator('p.flex-1.text-sm.text-foreground');
        this.displayNameValue = page.locator('p:has-text("Pravallika")').first();
        
        // Edit functionality - the pen/pencil icon next to display name
        this.displayNameEditButton = page.locator('button[data-tour-action="name-edit"]');
        this.displayNameEditIcon = page.locator('button[data-tour-action="name-edit"] svg.lucide-pen-line');
        
        // Container for the entire display name section
        this.displayNameContainer = page.locator('.space-y-2:has(p:has-text("Pravallika")), .flex.flex-col.gap-4:has(p:has-text("Pravallika"))').first();
        
        // Elements that appear when editing is activated
        this.displayNameInput = page.locator('input[name="displayName"], input[placeholder*="name"], input[value*="Pravallika"], input[type="text"]').first();
        this.displayNameSaveButton = page.locator('button[data-tour-action="name-save"]');
        this.displayNameCancelButton = page.locator('button[data-tour-action="name-cancel"]');
        
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
    
    // Adjust saturation filter
    async adjustSaturation(value) {
        await this.saturationSlider.fill(value.toString());
        await this.page.waitForTimeout(300);
    }
    
    // Save image changes
    async saveImageChanges() {
        await this.saveChangesButton.click();
        await this.editImageModal.waitFor({ state: 'hidden' });
    }
    
    // Cancel image editing
    async cancelImageEdit() {
        await this.cancelButton.click();
        await this.editImageModal.waitFor({ state: 'hidden' });
    }

    /**
     * Display Name Methods
     */
    
    // Get current display name from the read-only text
    async getCurrentDisplayName() {
        try {
            return await this.displayNameText.textContent();
        } catch (error) {
            // Fallback to alternative selector
            return await this.displayNameValue.textContent();
        }
    }
    
    // Click the edit icon to enable editing
    async clickEditDisplayName() {
        console.log('🔍 Clicking edit button with data-tour-action="name-edit"...');
        
        // Click the specific edit button
        await this.displayNameEditButton.click();
        console.log('✅ Successfully clicked edit button');
        
        // Wait a moment for the UI to respond
        await this.page.waitForTimeout(1000);
        
        console.log('🔍 Waiting for input field to appear...');
    }
    
    // Edit display name (assumes edit mode is already active)
    async editDisplayName(newName) {
        await this.displayNameInput.clear();
        await this.displayNameInput.fill(newName);
    }
    
    // Complete edit workflow: click edit, change name, save
    async changeDisplayName(newName) {
        await this.clickEditDisplayName();
        await this.editDisplayName(newName);
        await this.saveDisplayName();
    }
    
    // Save display name changes
    async saveDisplayName() {
        console.log('🔍 Attempting to save display name...');
        
        // Check if save button exists
        const saveButtonExists = await this.displayNameSaveButton.isVisible();
        console.log(`Save button visible: ${saveButtonExists}`);
        
        if (!saveButtonExists) {
            throw new Error('Save button not found');
        }
        
        // Check if save button is enabled
        const isEnabled = await this.displayNameSaveButton.isEnabled();
        console.log(`Save button enabled: ${isEnabled}`);
        
        if (!isEnabled) {
            console.log('⚠️ Save button is disabled, waiting for it to be enabled...');
            
            // Try to trigger validation by clicking in the input field or pressing a key
            await this.displayNameInput.click();
            await this.page.keyboard.press('End'); // Move cursor to end
            await this.page.keyboard.press('Space'); // Add a space
            await this.page.keyboard.press('Backspace'); // Remove the space
            await this.page.waitForTimeout(500);
            
            // Check again if button is now enabled
            const isEnabledAfter = await this.displayNameSaveButton.isEnabled();
            console.log(`Save button enabled after input interaction: ${isEnabledAfter}`);
            
            if (!isEnabledAfter) {
                // Wait up to 5 seconds for button to become enabled
                try {
                    await this.displayNameSaveButton.waitFor({ state: 'attached', timeout: 5000 });
                    await this.page.waitForFunction(
                        (selector) => {
                            const button = document.querySelector(selector);
                            return button && !button.disabled;
                        },
                        'button[data-tour-action="name-save"]',
                        { timeout: 5000 }
                    );
                    console.log('✅ Save button is now enabled');
                } catch (error) {
                    console.log('❌ Save button remained disabled, attempting to click anyway...');
                }
            }
        }
        
        // Click the save button
        await this.displayNameSaveButton.click();
        console.log('✅ Clicked save button');
        
        await this.page.waitForTimeout(1000); // Wait for save operation
    }
    
    // Cancel display name editing
    async cancelDisplayNameEdit() {
        await this.displayNameCancelButton.click();
    }
    
    // Click edit display name button
    async clickEditDisplayName() {
        await this.displayNameEditButton.click();
    }

    /**
     * Account Details Methods
     */
    
    // Get displayed email address
    async getDisplayedEmail() {
        try {
            return await this.emailValue.inputValue();
        } catch {
            return await this.emailText.textContent();
        }
    }
    
    // Get current timezone
    async getCurrentTimezone() {
        try {
            return await this.timezoneCurrentValue.textContent();
        } catch {
            return await this.timezoneDropdown.inputValue();
        }
    }
    
    // Open timezone dropdown
    async openTimezoneDropdown() {
        await this.timezoneDropdownTrigger.click();
        await this.page.waitForTimeout(500);
    }
    
    // Search for timezone
    async searchTimezone(searchTerm) {
        await this.openTimezoneDropdown();
        await this.timezoneSearchInput.fill(searchTerm);
        await this.page.waitForTimeout(500);
    }
    
    // Get timezone options
    async getTimezoneOptions() {
        const options = await this.timezoneOptions.allTextContents();
        return options;
    }
    
    // Select timezone
    async selectTimezone(timezone) {
        await this.openTimezoneDropdown();
        await this.page.locator(`text="${timezone}"`).click();
        await this.page.waitForTimeout(500);
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
    
    // Validate timezone format
    isValidTimezone(timezone) {
        const timezoneRegex = /^UTC[+-]\d{2}:\d{2}/;
        return timezoneRegex.test(timezone);
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

    /**
     * Static Utility Methods (Generic Helpers)
     */
    
    // Load test data from JSON file
    static loadTestData(fileName = 'test-data.json') {
        try {
            const filePath = path.join(__dirname, '..', 'data', fileName);
            const rawData = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(rawData);
        } catch (error) {
            console.error('Failed to load test data:', error.message);
            return {};
        }
    }
    
    // Generate random test data
    static generateRandomData() {
        const timestamp = Date.now();
        return {
            displayName: `TestUser_${timestamp}`,
            email: `test_${timestamp}@example.com`,
            randomString: Math.random().toString(36).substring(7),
            randomNumber: Math.floor(Math.random() * 1000),
            timestamp: timestamp
        };
    }
    
    // Generate random display name
    static generateRandomDisplayName(prefix = 'TestUser') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    }

    // Generic login method that can be used across all tests
    static async loginUser(page, email = process.env.USEREMAIL, password = process.env.PASSWORD) {
        try {
            // Navigate to login page
            await page.goto(process.env.BASE_URL);
            
            // Fill login credentials
            await page.fill('input[type="email"], input[name="email"], #email', email);
            await page.fill('input[type="password"], input[name="password"], #password', password);
            
            // Submit login form
            await page.click('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
            
            // Wait for successful login (look for dashboard elements instead of URL)
            try {
                await page.waitForURL('**/dashboard*', { timeout: 15000 });
            } catch (error) {
                // If URL wait fails, try waiting for dashboard elements
                await page.getByText('Inbox').first().waitFor({ state: 'visible', timeout: 15000 });
            }
            
            return true;
        } catch (error) {
            console.error('Login failed:', error.message);
            return false;
        }
    }
    
    // Check if user is already logged in
    static async isUserLoggedIn(page) {
        try {
            const currentUrl = page.url();
            return currentUrl.includes('dashboard') || currentUrl.includes('settings') || currentUrl.includes('chat');
        } catch (error) {
            return false;
        }
    }
    
    // Logout user
    static async logoutUser(page) {
        try {
            // Look for logout button/link
            const logoutSelectors = [
                'button:has-text("Logout")',
                'button:has-text("Sign Out")', 
                'a:has-text("Logout")',
                '[data-testid="logout"]',
                '.logout-btn'
            ];
            
            for (const selector of logoutSelectors) {
                const element = page.locator(selector);
                if (await element.isVisible()) {
                    await element.click();
                    break;
                }
            }
            
            // Wait for redirect to login page
            await page.waitForURL('**/login', { timeout: 10000 });
            return true;
        } catch (error) {
            console.error('Logout failed:', error.message);
            return false;
        }
    }

    // Take screenshot with timestamp and test info
    static async takeScreenshot(page, name, testInfo = {}) {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const fileName = `${name}-${timestamp}.png`;
            const screenshotPath = path.join(__dirname, '..', 'screenshots', fileName);
            
            // Ensure screenshots directory exists
            ProfileSettingsPage.ensureDirectoryExists(path.dirname(screenshotPath));
            
            await page.screenshot({ 
                path: screenshotPath, 
                fullPage: true 
            });
            
            console.log(`Screenshot saved: ${fileName}`);
            return screenshotPath;
        } catch (error) {
            console.error('Failed to take screenshot:', error.message);
            return null;
        }
    }
    
    // Take screenshot on test failure
    static async takeFailureScreenshot(page, testTitle) {
        return await ProfileSettingsPage.takeScreenshot(page, `FAILED-${testTitle.replace(/\s+/g, '-')}`);
    }
    
    // Create directory if it doesn't exist
    static ensureDirectoryExists(dirPath) {
        try {
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }
            return true;
        } catch (error) {
            console.error('Failed to create directory:', error.message);
            return false;
        }
    }

    // Check if file exists
    static fileExists(filePath) {
        try {
            return fs.existsSync(filePath);
        } catch (error) {
            return false;
        }
    }

    // Validate email format
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Validate display name (2-30 characters)
    static isValidDisplayName(name) {
        if (!name || typeof name !== 'string') {
            return false;
        }
        const trimmedName = name.trim();
        return trimmedName.length >= 2 && trimmedName.length < 30;
    }
    
    // Get display name validation error message
    static getDisplayNameValidationError(name) {
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
    
    // Validate timezone format
    static isValidTimezone(timezone) {
        const timezoneRegex = /^UTC[+-]\d{2}:\d{2}/;
        return timezoneRegex.test(timezone);
    }
    
    // Validate image file
    static isValidImageFile(fileName, fileSize = 0) {
        const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
        const maxSize = 5 * 1024 * 1024; // 5MB
        
        const extension = path.extname(fileName).toLowerCase();
        return validExtensions.includes(extension) && fileSize <= maxSize;
    }

    // Wait for page to be fully loaded
    static async waitForPageLoad(page, timeout = 30000) {
        try {
            await page.waitForLoadState('networkidle', { timeout });
            await page.waitForLoadState('domcontentloaded', { timeout });
            return true;
        } catch (error) {
            console.error('Page load timeout:', error.message);
            return false;
        }
    }
    
    // Wait for API response
    static async waitForApiResponse(page, urlPattern, timeout = 10000) {
        try {
            const response = await page.waitForResponse(
                response => response.url().includes(urlPattern) && response.status() === 200,
                { timeout }
            );
            return response;
        } catch (error) {
            console.error('API response timeout:', error.message);
            return null;
        }
    }

    // Fill form with data object
    static async fillForm(page, formData) {
        try {
            for (const [field, value] of Object.entries(formData)) {
                const selectors = [
                    `input[name="${field}"]`,
                    `input[id="${field}"]`,
                    `textarea[name="${field}"]`,
                    `select[name="${field}"]`,
                    `[data-testid="${field}"]`
                ];
                
                for (const selector of selectors) {
                    const element = page.locator(selector);
                    if (await element.isVisible()) {
                        await element.fill(value.toString());
                        break;
                    }
                }
            }
            return true;
        } catch (error) {
            console.error('Failed to fill form:', error.message);
            return false;
        }
    }

    // Mock API response
    static async mockApiResponse(page, urlPattern, responseData, statusCode = 200) {
        try {
            await page.route(urlPattern, route => {
                route.fulfill({
                    status: statusCode,
                    contentType: 'application/json',
                    body: JSON.stringify(responseData)
                });
            });
            return true;
        } catch (error) {
            console.error('Failed to mock API response:', error.message);
            return false;
        }
    }
}

module.exports = ProfileSettingsPage;
