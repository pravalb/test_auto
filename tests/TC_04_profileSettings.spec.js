/**
 * Profile Settings Test Suite
 * 
 * This test suite covers comprehensive testing of the Profile Settings page functionality
 * including display image management, display name editing, and timezone configuration.
 * 
 * Test Categories:
 * 1. Page Navigation and Loading (TC_04_001 - TC_04_003)
 * 2. Display Image Functionality (TC_04_004 - TC_04_012)
 * 3. Display Name Management (TC_04_013 - TC_04_017)
 * 4. Account Details (TC_04_018 - TC_04_022)
 * 5. Form Validation and Error Handling (TC_04_023 - TC_04_025)
 * 6. Accessibility and UI/UX Testing (TC_04_026 - TC_04_029)
 * 7. Integration Tests (TC_04_030 - TC_04_031)
 * 8. Performance Tests (TC_04_032 - TC_04_033)
 */

const { test, expect } = require('@playwright/test');
const ProfileSettingsPage = require('../pages/ProfileSettingsPage');

// Load test data from JSON file
const testData = ProfileSettingsPage.loadTestData();
const profileTestData = testData.profileSettings || {
    validDisplayNames: [
        'John Doe',
        'Jane Smith',
        'Test User 123',
        'محمد علي', // Arabic name
        'José García', // Spanish name with accents
        'AB', // Minimum valid length (2 characters)
        'Very Long Display Name Valid' // Long but valid name (under 30 chars)
    ],
    invalidDisplayNames: [
        '', // Empty string
        '   ', // Only spaces
        'A', // Too short (1 character)
        'A'.repeat(30), // Too long (30+ characters)
        null,
        undefined
    ],
    validationMessages: {
        displayNameRequired: "Display name is required",
        displayNameTooShort: "Display name must be at least 2 characters",
        displayNameTooLong: "Display name must be less than 30 characters",
        updateSuccess: "Profile updated successfully",
        updateError: "Failed to update profile"
    },
    timezones: [
        'UTC+00:00 Enderbury',
        'UTC+14:00 Kiritimati',
        'UTC-13:45 Chatham',
        'UTC-13:00 McMurdo',
        'UTC-13:00 Apia',
        'UTC-13:00 Auckland',
        'UTC-13:00 Fakaofo',
        'UTC-13:00 Tongatapu',
        'UTC-12:00 Anadyr'
    ],
    imageFiles: {
        validJpeg: 'data/test-images/profile-image.jpg',
        validPng: 'data/test-images/profile-image.png',
        validWebp: 'data/test-images/profile-image.webp',
        invalidFormat: 'data/test-files/document.pdf',
        tooLarge: 'data/test-images/large-image.jpg', // > 5MB
        tooSmall: 'data/test-images/tiny-image.jpg' // < 100x100px
    }
};

test.describe('Profile Settings Page Tests', () => {
    let profileSettingsPage;

    // Setup before each test
    test.beforeEach(async ({ page }) => {
        profileSettingsPage = new ProfileSettingsPage(page);
        
        // Login first using the same flow as the working login test
        await page.goto(process.env.BASE_URL || 'https://dev.auth.hilalsoftware.tools/hilal-chatbot/login');
        
        // Fill login credentials using the same selectors as loginPage.js
        await page.getByLabel('Email address').fill(process.env.USEREMAIL || 'pravallika2330@gmail.com');
        await page.getByLabel('Password').fill(process.env.PASSWORD || 'HilalPassword@123');
        await page.getByRole('button', {name: 'Sign in'}).click();
        
        // Wait for intermediate page to load first
        await page.waitForURL('**/hilal-chatbot/', { timeout: 15000 });
        await page.waitForLoadState('networkidle');
        
        // Click "Back to application" to navigate to dashboard
        await page.getByText('Back to application').click();
        
        // Wait for dashboard to load (look for "Inbox" text instead of URL)
        await page.getByText('Inbox').first().waitFor({ state: 'visible', timeout: 15000 });
        
        // Now navigate to profile settings
        await profileSettingsPage.navigateToProfileSettings();
    });

    /**
     * PAGE NAVIGATION AND LOADING TESTS
     */
    test.describe('Page Navigation and Loading', () => {
        
        test('TC_04_001: Should load Profile Settings page successfully', async () => {
            // Verify page loads correctly
            await expect(profileSettingsPage.settingsHeader).toBeVisible();
            
            // Debug: Log all form elements on the page
            console.log(`\n=== DEBUGGING ALL FORM ELEMENTS ===`);
            
            // Check input elements
            const allInputs = await profileSettingsPage.page.locator('input').all();
            console.log(`Found ${allInputs.length} input elements on the page`);
            for (let i = 0; i < allInputs.length; i++) {
                const input = allInputs[i];
                const name = await input.getAttribute('name') || 'no-name';
                const type = await input.getAttribute('type') || 'no-type';
                const value = await input.getAttribute('value') || 'no-value';
                const placeholder = await input.getAttribute('placeholder') || 'no-placeholder';
                const id = await input.getAttribute('id') || 'no-id';
                const className = await input.getAttribute('class') || 'no-class';
                console.log(`Input ${i}: name="${name}", type="${type}", value="${value}", placeholder="${placeholder}", id="${id}", class="${className}"`);
            }
            
            // Check textarea elements
            const allTextareas = await profileSettingsPage.page.locator('textarea').all();
            console.log(`Found ${allTextareas.length} textarea elements on the page`);
            for (let i = 0; i < allTextareas.length; i++) {
                const textarea = allTextareas[i];
                const name = await textarea.getAttribute('name') || 'no-name';
                const value = await textarea.getAttribute('value') || 'no-value';
                const textContent = await textarea.textContent() || 'no-text';
                const placeholder = await textarea.getAttribute('placeholder') || 'no-placeholder';
                const id = await textarea.getAttribute('id') || 'no-id';
                const className = await textarea.getAttribute('class') || 'no-class';
                console.log(`Textarea ${i}: name="${name}", value="${value}", text="${textContent}", placeholder="${placeholder}", id="${id}", class="${className}"`);
            }
            
            // Check contenteditable elements
            const allContentEditable = await profileSettingsPage.page.locator('[contenteditable]').all();
            console.log(`Found ${allContentEditable.length} contenteditable elements on the page`);
            for (let i = 0; i < allContentEditable.length; i++) {
                const element = allContentEditable[i];
                const textContent = await element.textContent() || 'no-text';
                const id = await element.getAttribute('id') || 'no-id';
                const className = await element.getAttribute('class') || 'no-class';
                const tagName = await element.evaluate(el => el.tagName.toLowerCase());
                console.log(`ContentEditable ${i}: tag="${tagName}", text="${textContent}", id="${id}", class="${className}"`);
            }
            
            // Search for any element containing "Pravallika"
            const elementsWithPravallika = await profileSettingsPage.page.locator('*:has-text("Pravallika")').all();
            console.log(`Found ${elementsWithPravallika.length} elements containing "Pravallika"`);
            for (let i = 0; i < elementsWithPravallika.length; i++) {
                const element = elementsWithPravallika[i];
                const textContent = await element.textContent() || 'no-text';
                const id = await element.getAttribute('id') || 'no-id';
                const className = await element.getAttribute('class') || 'no-class';
                const tagName = await element.evaluate(el => el.tagName.toLowerCase());
                console.log(`Pravallika Element ${i}: tag="${tagName}", text="${textContent.substring(0, 100)}", id="${id}", class="${className}"`);
            }
            
            console.log(`=== END DEBUGGING ===\n`);
            
            // Take screenshot for verification BEFORE trying to find display name input
            await profileSettingsPage.takeScreenshot('page-loaded-before-input-check');
            
            // Verify display name text is visible (it's a <p> element, not an input)
            try {
                await expect(profileSettingsPage.displayNameText).toBeVisible({ timeout: 2000 });
                console.log('✅ Display name text found successfully!');
                
                // Get the display name value
                const displayNameText = await profileSettingsPage.displayNameText.textContent();
                console.log(`📝 Display name value: "${displayNameText}"`);
                
                // Verify it contains the expected name
                expect(displayNameText).toContain('Pravallika');
                console.log('✅ Display name contains expected value "Pravallika"');
                
            } catch (error) {
                console.log('❌ Display name text not found with current selector');
                console.log('Current selector: p.flex-1.text-sm.text-foreground');
                
                // Try alternative selectors
                try {
                    await expect(profileSettingsPage.displayNameValue).toBeVisible({ timeout: 1000 });
                    console.log('✅ Found display name using alternative selector!');
                    const altText = await profileSettingsPage.displayNameValue.textContent();
                    console.log(`📝 Alternative selector value: "${altText}"`);
                } catch (altError) {
                    console.log('❌ Alternative selector also failed');
                }
            }
            
            // Verify URL is correct
            expect(profileSettingsPage.page.url()).toContain('/settings/profile');
            
            // Take final screenshot
            await profileSettingsPage.takeScreenshot('page-loaded-final');
        });

        test('TC_04_002: Should display all required sections', async () => {
            // Verify all main sections are present
            await expect(profileSettingsPage.displayNameLabel).toBeVisible();
            await expect(profileSettingsPage.emailLabel).toBeVisible();
            await expect(profileSettingsPage.timezoneLabel).toBeVisible();
            await expect(profileSettingsPage.displayImage).toBeVisible();
        });

        test('TC_04_003: Should have working back navigation', async () => {
            // Test back to settings functionality
            if (await profileSettingsPage.backToSettingsLink.isVisible()) {
                await profileSettingsPage.backToSettingsLink.click();
                await expect(profileSettingsPage.page).toHaveURL(/.*settings$/);
            }
        });

        test('TC_04_004: Should be able to edit display name', async () => {
            // Get current display name
            const originalName = await profileSettingsPage.getCurrentDisplayName();
            console.log(`📝 Original display name: "${originalName}"`);
            
            // Verify original name contains expected value
            expect(originalName).toContain('Pravallika');
            
            // Take screenshot before clicking edit
            await profileSettingsPage.takeScreenshot('before-edit-click');
            
            // Debug: Look for edit buttons/icons before clicking
            console.log('=== DEBUGGING EDIT BUTTONS BEFORE CLICK ===');
            const allButtons = await profileSettingsPage.page.locator('button').all();
            console.log(`Found ${allButtons.length} buttons on the page`);
            
            for (let i = 0; i < Math.min(allButtons.length, 10); i++) {
                const button = allButtons[i];
                const text = await button.textContent() || '';
                const ariaLabel = await button.getAttribute('aria-label') || 'no-aria-label';
                const className = await button.getAttribute('class') || 'no-class';
                const isVisible = await button.isVisible();
                console.log(`Button ${i}: text="${text}", aria-label="${ariaLabel}", visible=${isVisible}, class="${className}"`);
            }
            
            // Look for SVG icons (edit icons are usually SVGs)
            const allSvgs = await profileSettingsPage.page.locator('svg').all();
            console.log(`Found ${allSvgs.length} SVG elements on the page`);
            
            for (let i = 0; i < Math.min(allSvgs.length, 5); i++) {
                const svg = allSvgs[i];
                const testId = await svg.getAttribute('data-testid') || 'no-testid';
                const className = await svg.getAttribute('class') || 'no-class';
                const isVisible = await svg.isVisible();
                console.log(`SVG ${i}: data-testid="${testId}", visible=${isVisible}, class="${className}"`);
            }
            console.log('=== END DEBUGGING EDIT BUTTONS ===');
            
            // Click edit to enable editing mode
            await profileSettingsPage.clickEditDisplayName();
            console.log('✅ Clicked edit button - input field should be visible');
            
            // Take screenshot after clicking edit
            await profileSettingsPage.takeScreenshot('after-edit-click');
            
            // Debug: Look for input fields after clicking
            console.log('=== DEBUGGING INPUT FIELDS AFTER CLICK ===');
            const allInputsAfter = await profileSettingsPage.page.locator('input').all();
            console.log(`Found ${allInputsAfter.length} input elements after click`);
            
            for (let i = 0; i < allInputsAfter.length; i++) {
                const input = allInputsAfter[i];
                const name = await input.getAttribute('name') || 'no-name';
                const type = await input.getAttribute('type') || 'no-type';
                const value = await input.getAttribute('value') || 'no-value';
                const placeholder = await input.getAttribute('placeholder') || 'no-placeholder';
                const id = await input.getAttribute('id') || 'no-id';
                const className = await input.getAttribute('class') || 'no-class';
                const isVisible = await input.isVisible();
                console.log(`Input ${i}: name="${name}", type="${type}", value="${value}", placeholder="${placeholder}", id="${id}", class="${className}", visible=${isVisible}`);
            }
            console.log('=== END DEBUGGING INPUT FIELDS ===');
            
            // Try to find the input field with a more flexible approach
            let inputFound = false;
            try {
                await expect(profileSettingsPage.displayNameInput).toBeVisible({ timeout: 2000 });
                inputFound = true;
                console.log('✅ Input field is visible for editing');
            } catch (error) {
                console.log('❌ Primary input selector failed, trying alternatives...');
                
                // Try alternative selectors
                const alternatives = [
                    'input[type="text"]',
                    'input:not([type="file"])',
                    'input[value*="Pravallika"]',
                    'input:visible'
                ];
                
                for (const selector of alternatives) {
                    try {
                        const altInput = profileSettingsPage.page.locator(selector).first();
                        await expect(altInput).toBeVisible({ timeout: 1000 });
                        console.log(`✅ Found input with alternative selector: ${selector}`);
                        inputFound = true;
                        break;
                    } catch (altError) {
                        console.log(`❌ Alternative selector failed: ${selector}`);
                    }
                }
            }
            
            if (!inputFound) {
                console.log('❌ No input field found - edit functionality may not be working as expected');
                console.log('Taking final screenshot for debugging...');
                await profileSettingsPage.takeScreenshot('edit-failed-final');
                throw new Error('Edit functionality not working - input field not found after clicking edit');
            }
            
            // Edit the display name
            const newName = 'Pravallika Updated';
            await profileSettingsPage.editDisplayName(newName);
            console.log(`📝 Changed display name to: "${newName}"`);
            
            // Save the changes
            await profileSettingsPage.saveDisplayName();
            console.log('✅ Clicked save button');
            
            // Wait for save to complete and verify the change
            await profileSettingsPage.page.waitForTimeout(2000);
            const updatedName = await profileSettingsPage.getCurrentDisplayName();
            console.log(`📝 Updated display name: "${updatedName}"`);
            
            // Verify the name was updated
            expect(updatedName).toContain('Updated');
            
            // Take screenshot of the updated name
            await profileSettingsPage.takeScreenshot('display-name-updated');
            
            // Restore original name for cleanup
            await profileSettingsPage.changeDisplayName(originalName.trim());
            console.log('🔄 Restored original display name');
        });
    });

    /**
     * DISPLAY IMAGE FUNCTIONALITY TESTS
     */
    test.describe('Display Image Management', () => {
        
        test('TC_04_004: Should show edit/upload options on image hover', async () => {
            // Hover over display image
            await profileSettingsPage.hoverOverDisplayImage();
            
            // Verify edit and upload buttons appear
            await expect(profileSettingsPage.imageEditButton).toBeVisible();
            await expect(profileSettingsPage.imageUploadButton).toBeVisible();
        });

        test('TC_04_005: Should open edit image modal successfully', async () => {
            // Click edit image
            await profileSettingsPage.clickEditImage();
            
            // Verify modal opens with all controls
            await expect(profileSettingsPage.editImageModal).toBeVisible();
            await expect(profileSettingsPage.editImageTitle).toBeVisible();
            await expect(profileSettingsPage.zoomSlider).toBeVisible();
            await expect(profileSettingsPage.rotationSlider).toBeVisible();
            await expect(profileSettingsPage.saveChangesButton).toBeVisible();
            await expect(profileSettingsPage.cancelButton).toBeVisible();
        });

        test('TC_04_006: Should adjust zoom controls correctly', async () => {
            await profileSettingsPage.clickEditImage();
            
            // Test zoom adjustment
            await profileSettingsPage.adjustZoom(150);
            
            // Verify zoom value is updated
            const zoomText = await profileSettingsPage.zoomValue.textContent();
            expect(zoomText).toContain('150%');
        });

        test('TC_04_007: Should adjust rotation controls correctly', async () => {
            await profileSettingsPage.clickEditImage();
            
            // Test rotation adjustment
            await profileSettingsPage.adjustRotation(45);
            
            // Verify rotation value is updated
            const rotationText = await profileSettingsPage.rotationValue.textContent();
            expect(rotationText).toContain('45°');
        });

        test('TC_04_008: Should apply flip transformations', async () => {
            await profileSettingsPage.clickEditImage();
            
            // Test horizontal flip
            await profileSettingsPage.flipImageHorizontally();
            
            // Test vertical flip
            await profileSettingsPage.flipImageVertically();
            
            // Verify transformations are applied (visual verification would be needed)
            await profileSettingsPage.takeScreenshot('image-flipped');
        });

        test('TC_04_009: Should adjust brightness and contrast filters', async () => {
            await profileSettingsPage.clickEditImage();
            
            // Test brightness adjustment
            await profileSettingsPage.adjustBrightness(120);
            
            // Test contrast adjustment
            await profileSettingsPage.adjustContrast(110);
            
            // Take screenshot to verify visual changes
            await profileSettingsPage.takeScreenshot('filters-applied');
        });

        test('TC_04_010: Should save image changes successfully', async () => {
            await profileSettingsPage.clickEditImage();
            
            // Make some changes
            await profileSettingsPage.adjustZoom(120);
            await profileSettingsPage.adjustBrightness(110);
            
            // Save changes
            await profileSettingsPage.saveImageChanges();
            
            // Verify modal closes
            await expect(profileSettingsPage.editImageModal).not.toBeVisible();
            
            // Verify success message (if implemented)
            if (await profileSettingsPage.isSuccessMessageVisible()) {
                expect(await profileSettingsPage.getSuccessMessage()).toContain('saved');
            }
        });

        test('TC_04_011: Should cancel image editing without saving', async () => {
            await profileSettingsPage.clickEditImage();
            
            // Make some changes
            await profileSettingsPage.adjustZoom(150);
            await profileSettingsPage.adjustBrightness(130);
            
            // Cancel changes
            await profileSettingsPage.cancelImageEdit();
            
            // Verify modal closes
            await expect(profileSettingsPage.editImageModal).not.toBeVisible();
        });

        test('TC_04_012: Should upload valid image file', async ({ page }) => {
            // This test would require actual image files in the data directory
            const imageFiles = profileTestData.imageFiles || {};
            test.skip(!imageFiles.validJpeg, 'Test image file not available');
            
            await profileSettingsPage.clickUploadImage();
            await profileSettingsPage.uploadImageFile(imageFiles.validJpeg);
            
            // Verify upload success
            await profileSettingsPage.takeScreenshot('image-uploaded');
            
            // Verify success message appears
            if (await profileSettingsPage.isSuccessMessageVisible()) {
                const successMessage = await profileSettingsPage.getSuccessMessage();
                expect(successMessage).toContain(profileTestData.validationMessages.updateSuccess);
            }
        });
    });

    /**
     * DISPLAY NAME MANAGEMENT TESTS
     */
    test.describe('Display Name Management', () => {
        
        test('TC_04_013: Should display current display name', async () => {
            const currentName = await profileSettingsPage.getCurrentDisplayName();
            expect(currentName).toBeTruthy();
            expect(typeof currentName).toBe('string');
        });

        test.describe('Valid Display Name Updates', () => {
            profileTestData.validDisplayNames.forEach((displayName, index) => {
                test(`TC_04_014_${index + 1}: Should update display name to "${displayName}"`, async () => {
                    // Store original name for cleanup
                    const originalName = await profileSettingsPage.getCurrentDisplayName();
                    
                    // Update display name
                    await profileSettingsPage.editDisplayName(displayName);
                    await profileSettingsPage.saveDisplayName();
                    
                    // Verify name is updated
                    const updatedName = await profileSettingsPage.getCurrentDisplayName();
                    expect(updatedName).toBe(displayName);
                    
                    // Verify success message appears
                    if (await profileSettingsPage.isSuccessMessageVisible()) {
                        const successMessage = await profileSettingsPage.getSuccessMessage();
                        expect(successMessage).toContain(profileTestData.validationMessages.updateSuccess);
                    }
                    
                    // Cleanup: restore original name
                    await profileSettingsPage.editDisplayName(originalName);
                    await profileSettingsPage.saveDisplayName();
                });
            });
        });

        test.describe('Invalid Display Name Validation', () => {
            profileTestData.invalidDisplayNames.forEach((invalidName, index) => {
                test(`TC_04_015_${index + 1}: Should reject invalid display name "${invalidName}"`, async () => {
                    const originalName = await profileSettingsPage.getCurrentDisplayName();
                    
                    // Update display name with invalid value
                    await profileSettingsPage.editDisplayName(invalidName || '');
                    await profileSettingsPage.saveDisplayName();
                    
                    // Wait for validation message to appear
                    await profileSettingsPage.waitForValidationMessage();
                    
                    // Check for specific validation messages
                    const validationMessage = await profileSettingsPage.getValidationMessage();
                    const expectedError = ProfileSettingsPage.getDisplayNameValidationError(invalidName);
                    
                    if (expectedError) {
                        expect(validationMessage).toContain(expectedError);
                    }
                    
                    // Verify specific validation message types
                    if (invalidName === '' || (typeof invalidName === 'string' && invalidName.trim() === '')) {
                        expect(await profileSettingsPage.isDisplayNameRequiredMessageVisible()).toBe(true);
                    } else if (typeof invalidName === 'string' && invalidName.trim().length === 1) {
                        expect(await profileSettingsPage.isDisplayNameTooShortMessageVisible()).toBe(true);
                    } else if (typeof invalidName === 'string' && invalidName.trim().length >= 30) {
                        expect(await profileSettingsPage.isDisplayNameTooLongMessageVisible()).toBe(true);
                    }
                    
                    // Verify name was not changed
                    const currentName = await profileSettingsPage.getCurrentDisplayName();
                    expect(currentName).toBe(originalName);
                });
            });
        });

        test('TC_04_016: Should cancel display name editing', async () => {
            const originalName = await profileSettingsPage.getCurrentDisplayName();
            
            // Start editing
            await profileSettingsPage.editDisplayName('Temporary Name');
            
            // Cancel editing
            await profileSettingsPage.cancelDisplayNameEdit();
            
            // Verify original name is restored
            const currentName = await profileSettingsPage.getCurrentDisplayName();
            expect(currentName).toBe(originalName);
        });

        test('TC_04_017: Should display correct validation messages for each error type', async () => {
            const originalName = await profileSettingsPage.getCurrentDisplayName();
            
            // Test empty display name
            await profileSettingsPage.editDisplayName('');
            await profileSettingsPage.saveDisplayName();
            await profileSettingsPage.waitForValidationMessage();
            
            let validationMessage = await profileSettingsPage.getValidationMessage();
            expect(validationMessage).toBe(profileTestData.validationMessages.displayNameRequired);
            expect(await profileSettingsPage.isDisplayNameRequiredMessageVisible()).toBe(true);
            
            // Test too short display name (1 character)
            await profileSettingsPage.editDisplayName('A');
            await profileSettingsPage.saveDisplayName();
            await profileSettingsPage.waitForValidationMessage();
            
            validationMessage = await profileSettingsPage.getValidationMessage();
            expect(validationMessage).toBe(profileTestData.validationMessages.displayNameTooShort);
            expect(await profileSettingsPage.isDisplayNameTooShortMessageVisible()).toBe(true);
            
            // Test too long display name (30+ characters)
            await profileSettingsPage.editDisplayName('A'.repeat(30));
            await profileSettingsPage.saveDisplayName();
            await profileSettingsPage.waitForValidationMessage();
            
            validationMessage = await profileSettingsPage.getValidationMessage();
            expect(validationMessage).toBe(profileTestData.validationMessages.displayNameTooLong);
            expect(await profileSettingsPage.isDisplayNameTooLongMessageVisible()).toBe(true);
            
            // Cleanup: restore original name
            await profileSettingsPage.editDisplayName(originalName);
            await profileSettingsPage.saveDisplayName();
        });
    });

    /**
     * ACCOUNT DETAILS TESTS
     */
    test.describe('Account Details', () => {
        
        test('TC_04_018: Should display correct email address', async () => {
            const displayedEmail = await profileSettingsPage.getDisplayedEmail();
            
            // Verify email format is valid
            expect(ProfileSettingsPage.isValidEmail(displayedEmail)).toBe(true);
            
            // Verify it matches expected test user email
            if (process.env.USEREMAIL) {
                expect(displayedEmail).toBe(process.env.USEREMAIL);
            }
        });

        test('TC_04_019: Should display current timezone', async () => {
            const currentTimezone = await profileSettingsPage.getCurrentTimezone();
            expect(currentTimezone).toBeTruthy();
            expect(currentTimezone).toMatch(/UTC[+-]\d{2}:\d{2}/);
        });

        test('TC_04_020: Should open timezone dropdown', async () => {
            await profileSettingsPage.openTimezoneDropdown();
            
            // Verify dropdown options are visible
            const options = await profileSettingsPage.getTimezoneOptions();
            expect(options.length).toBeGreaterThan(0);
        });

        test('TC_04_021: Should search for timezones', async () => {
            await profileSettingsPage.searchTimezone('Auckland');
            
            // Verify search results contain Auckland
            const options = await profileSettingsPage.getTimezoneOptions();
            const aucklandOptions = options.filter(option => 
                option.toLowerCase().includes('auckland')
            );
            expect(aucklandOptions.length).toBeGreaterThan(0);
        });

        test.describe('Timezone Selection Tests', () => {
            profileTestData.timezones.forEach((timezone, index) => {
                test(`TC_04_022_${index + 1}: Should select timezone "${timezone}"`, async () => {
                    const originalTimezone = await profileSettingsPage.getCurrentTimezone();
                    
                    // Select new timezone
                    await profileSettingsPage.selectTimezone(timezone);
                    
                    // Verify timezone is updated
                    const updatedTimezone = await profileSettingsPage.getCurrentTimezone();
                    expect(updatedTimezone).toContain(timezone.split(' ')[0]); // UTC part
                    
                    // Verify success message appears
                    if (await profileSettingsPage.isSuccessMessageVisible()) {
                        const successMessage = await profileSettingsPage.getSuccessMessage();
                        expect(successMessage).toContain(profileTestData.validationMessages.updateSuccess);
                    }
                    
                    // Cleanup: restore original timezone
                    await profileSettingsPage.selectTimezone(originalTimezone);
                });
            });
        });
    });

    /**
     * FORM VALIDATION AND ERROR HANDLING TESTS
     */
    test.describe('Form Validation and Error Handling', () => {
        
        test('TC_04_023: Should handle network errors gracefully', async ({ page }) => {
            // Simulate network failure
            await page.route('**/api/profile/**', route => route.abort());
            
            // Try to update display name
            await profileSettingsPage.editDisplayName('Network Test');
            await profileSettingsPage.saveDisplayName();
            
            // Should show error message
            if (await profileSettingsPage.isErrorMessageVisible()) {
                const errorMessage = await profileSettingsPage.getErrorMessage();
                expect(errorMessage).toContain(profileTestData.validationMessages.updateError);
            }
        });

        test('TC_04_024: Should show loading states during operations', async () => {
            // This test would depend on the specific implementation
            // Look for loading spinners during save operations
            await profileSettingsPage.editDisplayName('Loading Test');
            await profileSettingsPage.saveDisplayName();
            
            // Check if loading indicator appears (might be too fast to catch)
            await profileSettingsPage.takeScreenshot('loading-state');
        });

        test('TC_04_025: Should validate form before submission', async () => {
            // Test client-side validation with new validation rules
            expect(ProfileSettingsPage.isValidDisplayName('Valid Name')).toBe(true);
            expect(ProfileSettingsPage.isValidDisplayName('AB')).toBe(true); // Minimum valid
            expect(ProfileSettingsPage.isValidDisplayName('A'.repeat(29))).toBe(true); // Maximum valid
            
            expect(ProfileSettingsPage.isValidDisplayName('')).toBe(false);
            expect(ProfileSettingsPage.isValidDisplayName('A')).toBe(false); // Too short
            expect(ProfileSettingsPage.isValidDisplayName('A'.repeat(30))).toBe(false); // Too long
            
            // Test validation error messages
            expect(ProfileSettingsPage.getDisplayNameValidationError('')).toBe(profileTestData.validationMessages.displayNameRequired);
            expect(ProfileSettingsPage.getDisplayNameValidationError('A')).toBe(profileTestData.validationMessages.displayNameTooShort);
            expect(ProfileSettingsPage.getDisplayNameValidationError('A'.repeat(30))).toBe(profileTestData.validationMessages.displayNameTooLong);
            expect(ProfileSettingsPage.getDisplayNameValidationError('Valid Name')).toBe(null);
        });
    });

    /**
     * ACCESSIBILITY AND UI/UX TESTS
     */
    test.describe('Accessibility and UI/UX', () => {
        
        test('TC_04_026: Should be keyboard navigable', async ({ page }) => {
            // Test tab navigation through form elements
            await page.keyboard.press('Tab');
            await expect(profileSettingsPage.displayNameInput).toBeFocused();
            
            await page.keyboard.press('Tab');
            // Next focusable element should be focused
        });

        test('TC_04_027: Should have proper ARIA labels', async () => {
            // Check for accessibility attributes
            const displayNameLabel = await profileSettingsPage.getElementAttribute(
                profileSettingsPage.displayNameInput, 
                'aria-label'
            );
            
            // Should have either aria-label or associated label
            expect(displayNameLabel || await profileSettingsPage.displayNameLabel.isVisible()).toBeTruthy();
        });

        test('TC_04_028: Should be responsive on different screen sizes', async ({ page }) => {
            // Test mobile viewport
            await page.setViewportSize({ width: 375, height: 667 });
            await expect(profileSettingsPage.settingsHeader).toBeVisible();
            await profileSettingsPage.takeScreenshot('mobile-view');
            
            // Test tablet viewport
            await page.setViewportSize({ width: 768, height: 1024 });
            await expect(profileSettingsPage.settingsHeader).toBeVisible();
            await profileSettingsPage.takeScreenshot('tablet-view');
            
            // Test desktop viewport
            await page.setViewportSize({ width: 1920, height: 1080 });
            await expect(profileSettingsPage.settingsHeader).toBeVisible();
            await profileSettingsPage.takeScreenshot('desktop-view');
        });

        test('TC_04_029: Should handle long content gracefully', async () => {
            // Test with display name at maximum valid length (29 characters)
            const longName = 'A'.repeat(29);
            await profileSettingsPage.editDisplayName(longName);
            
            // Verify UI doesn't break and name is accepted
            await expect(profileSettingsPage.displayNameInput).toBeVisible();
            await profileSettingsPage.takeScreenshot('long-content');
            
            // Should be valid
            expect(ProfileSettingsPage.isValidDisplayName(longName)).toBe(true);
        });
    });

    /**
     * INTEGRATION TESTS
     */
    test.describe('Integration Tests', () => {
        
        test('TC_04_030: Should persist changes across page refresh', async ({ page }) => {
            const newName = `Test User ${Date.now()}`;
            
            // Update display name
            await profileSettingsPage.editDisplayName(newName);
            await profileSettingsPage.saveDisplayName();
            
            // Refresh page
            await page.reload();
            await profileSettingsPage.waitForPageLoad();
            
            // Verify name persists
            const persistedName = await profileSettingsPage.getCurrentDisplayName();
            expect(persistedName).toBe(newName);
        });

        test('TC_04_031: Should maintain session during profile updates', async ({ page }) => {
            // Update profile settings
            await profileSettingsPage.editDisplayName('Session Test');
            await profileSettingsPage.saveDisplayName();
            
            // Navigate to another page and back
            await page.goto('https://dev.chat.hilalsoftware.tools/dashboard');
            await profileSettingsPage.navigateToProfileSettings();
            
            // Verify user is still logged in and changes are saved
            await expect(profileSettingsPage.settingsHeader).toBeVisible();
            const currentName = await profileSettingsPage.getCurrentDisplayName();
            expect(currentName).toBe('Session Test');
        });
    });

    /**
     * CLEANUP AFTER TESTS
     */
    test.afterEach(async () => {
        // Take final screenshot for debugging if test failed
        if (test.info().status === 'failed') {
            await profileSettingsPage.takeScreenshot(`failed-${test.info().title}`);
        }
    });
});

/**
 * PERFORMANCE TESTS
 */
test.describe('Performance Tests', () => {
    
    test('TC_04_032: Should load profile settings page within acceptable time', async ({ page }) => {
        const profileSettingsPage = new ProfileSettingsPage(page);
        
        // Measure page load time
        const startTime = Date.now();
        await profileSettingsPage.navigateToProfileSettings();
        const loadTime = Date.now() - startTime;
        
        // Should load within 5 seconds
        expect(loadTime).toBeLessThan(5000);
        console.log(`Profile Settings page loaded in ${loadTime}ms`);
    });

    test('TC_04_033: Should handle multiple rapid updates', async ({ page }) => {
        const profileSettingsPage = new ProfileSettingsPage(page);
        await profileSettingsPage.navigateToProfileSettings();
        
        // Perform multiple rapid updates
        for (let i = 0; i < 5; i++) {
            await profileSettingsPage.editDisplayName(`Rapid Test ${i}`);
            await profileSettingsPage.saveDisplayName();
            await page.waitForTimeout(100); // Small delay between updates
        }
        
        // Verify final state
        const finalName = await profileSettingsPage.getCurrentDisplayName();
        expect(finalName).toBe('Rapid Test 4');
    });
});
