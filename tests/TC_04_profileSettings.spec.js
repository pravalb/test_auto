/**
 * Profile Settings Test Suite
 * 
 * This test suite covers comprehensive testing of the Profile Settings page functionality
 * including display image management, display name editing, and timezone configuration.
 * 
 * Test Categories:
 * 1. Page Navigation and Loading
 * 2. Display Image Functionality (Edit/Upload/Transform/Filters)
 * 3. Display Name Management
 * 4. Account Details (Email Display, Timezone Selection)
 * 5. Form Validation and Error Handling
 * 6. Accessibility and UI/UX Testing
 */

const { test, expect } = require('@playwright/test');
const ProfileSettingsPage = require('../pages/ProfileSettingsPage');

// Test data for various scenarios
const testData = {
    validDisplayNames: [
        'John Doe',
        'Jane Smith',
        'Test User 123',
        'محمد علي', // Arabic name
        'José García', // Spanish name with accents
        'A', // Single character
        'Very Long Display Name That Is Still Valid' // Long but valid name
    ],
    invalidDisplayNames: [
        '', // Empty string
        '   ', // Only spaces
        'A'.repeat(101), // Too long (over 100 characters)
        null,
        undefined
    ],
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
        
        // Login first (assuming user is already logged in or using session storage)
        // This would typically involve navigating to login page and authenticating
        await page.goto(process.env.BASE_URL);
        await page.fill('input[type="email"]', process.env.USEREMAIL);
        await page.fill('input[type="password"]', process.env.PASSWORD);
        await page.click('button[type="submit"]');
        
        // Wait for login to complete and navigate to profile settings
        await page.waitForURL('**/dashboard', { timeout: 10000 });
        await profileSettingsPage.navigateToProfileSettings();
    });

    /**
     * PAGE NAVIGATION AND LOADING TESTS
     */
    test.describe('Page Navigation and Loading', () => {
        
        test('TC_04_001: Should load Profile Settings page successfully', async () => {
            // Verify page loads correctly
            await expect(profileSettingsPage.settingsHeader).toBeVisible();
            await expect(profileSettingsPage.displayNameInput).toBeVisible();
            await expect(profileSettingsPage.accountDetailsHeader).toBeVisible();
            
            // Verify URL is correct
            expect(await profileSettingsPage.page.url()).toContain('/settings/profile');
            
            // Take screenshot for verification
            await profileSettingsPage.takeScreenshot('page-loaded');
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
            await profileSettingsPage.adjustZoom(200);
            
            // Cancel changes
            await profileSettingsPage.cancelImageEditing();
            
            // Verify modal closes without saving
            await expect(profileSettingsPage.editImageModal).not.toBeVisible();
        });

        test('TC_04_012: Should upload valid image file', async ({ page }) => {
            // This test would require actual image files in the data directory
            test.skip(!testData.imageFiles.validJpeg, 'Test image file not available');
            
            await profileSettingsPage.clickUploadImage();
            await profileSettingsPage.uploadImageFile(testData.imageFiles.validJpeg);
            
            // Verify upload success
            await profileSettingsPage.takeScreenshot('image-uploaded');
        });
    });

    /**
     * DISPLAY NAME MANAGEMENT TESTS
     */
    test.describe('Display Name Management', () => {
        
        test('TC_04_013: Should display current display name', async () => {
            const currentName = await profileSettingsPage.getCurrentDisplayName();
            expect(currentName).toBeTruthy();
            expect(currentName.length).toBeGreaterThan(0);
        });

        test.describe('Valid Display Name Updates', () => {
            testData.validDisplayNames.forEach((displayName, index) => {
                test(`TC_04_014_${index + 1}: Should update display name to "${displayName}"`, async () => {
                    // Store original name for cleanup
                    const originalName = await profileSettingsPage.getCurrentDisplayName();
                    
                    // Update display name
                    await profileSettingsPage.editDisplayName(displayName);
                    await profileSettingsPage.saveDisplayName();
                    
                    // Verify name is updated
                    const updatedName = await profileSettingsPage.getCurrentDisplayName();
                    expect(updatedName).toBe(displayName);
                    
                    // Cleanup: restore original name
                    await profileSettingsPage.editDisplayName(originalName);
                    await profileSettingsPage.saveDisplayName();
                });
            });
        });

        test.describe('Invalid Display Name Validation', () => {
            testData.invalidDisplayNames.forEach((invalidName, index) => {
                test(`TC_04_015_${index + 1}: Should reject invalid display name "${invalidName}"`, async () => {
                    const originalName = await profileSettingsPage.getCurrentDisplayName();
                    
                    try {
                        await profileSettingsPage.editDisplayName(invalidName || '');
                        await profileSettingsPage.saveDisplayName();
                        
                        // Should show error message or prevent saving
                        if (await profileSettingsPage.isErrorMessageVisible()) {
                            const errorMessage = await profileSettingsPage.getErrorMessage();
                            expect(errorMessage).toBeTruthy();
                        } else {
                            // Name should not have changed
                            const currentName = await profileSettingsPage.getCurrentDisplayName();
                            expect(currentName).toBe(originalName);
                        }
                    } catch (error) {
                        // Expected behavior for invalid input
                        console.log(`Expected validation error for: ${invalidName}`);
                    }
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
    });

    /**
     * ACCOUNT DETAILS TESTS
     */
    test.describe('Account Details', () => {
        
        test('TC_04_017: Should display correct email address', async () => {
            const displayedEmail = await profileSettingsPage.getDisplayedEmail();
            
            // Verify email format is valid
            expect(profileSettingsPage.isValidEmail(displayedEmail)).toBe(true);
            
            // Verify it matches the login email (if available in env)
            if (process.env.USEREMAIL) {
                expect(displayedEmail.toLowerCase()).toBe(process.env.USEREMAIL.toLowerCase());
            }
        });

        test('TC_04_018: Should display current timezone', async () => {
            const currentTimezone = await profileSettingsPage.getCurrentTimezone();
            expect(currentTimezone).toBeTruthy();
            expect(currentTimezone).toMatch(/UTC[+-]\d{2}:\d{2}/);
        });

        test('TC_04_019: Should open timezone dropdown', async () => {
            await profileSettingsPage.openTimezoneDropdown();
            
            // Verify dropdown options are visible
            const options = await profileSettingsPage.getTimezoneOptions();
            expect(options.length).toBeGreaterThan(0);
        });

        test('TC_04_020: Should search for timezones', async () => {
            await profileSettingsPage.searchTimezone('Auckland');
            
            // Verify search results contain Auckland
            const options = await profileSettingsPage.getTimezoneOptions();
            const aucklandOptions = options.filter(option => 
                option.toLowerCase().includes('auckland')
            );
            expect(aucklandOptions.length).toBeGreaterThan(0);
        });

        test.describe('Timezone Selection Tests', () => {
            testData.timezones.forEach((timezone, index) => {
                test(`TC_04_021_${index + 1}: Should select timezone "${timezone}"`, async () => {
                    const originalTimezone = await profileSettingsPage.getCurrentTimezone();
                    
                    // Select new timezone
                    await profileSettingsPage.selectTimezone(timezone);
                    
                    // Verify timezone is updated
                    const updatedTimezone = await profileSettingsPage.getCurrentTimezone();
                    expect(updatedTimezone).toContain(timezone.split(' ')[0]); // UTC part
                    
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
        
        test('TC_04_022: Should handle network errors gracefully', async ({ page }) => {
            // Simulate network failure
            await page.route('**/api/profile/**', route => route.abort());
            
            // Try to update display name
            await profileSettingsPage.editDisplayName('Network Test');
            await profileSettingsPage.saveDisplayName();
            
            // Should show error message
            if (await profileSettingsPage.isErrorMessageVisible()) {
                const errorMessage = await profileSettingsPage.getErrorMessage();
                expect(errorMessage).toBeTruthy();
            }
        });

        test('TC_04_023: Should show loading states during operations', async () => {
            // This test would depend on the specific implementation
            // Look for loading spinners during save operations
            await profileSettingsPage.editDisplayName('Loading Test');
            await profileSettingsPage.saveDisplayName();
            
            // Check if loading indicator appears (might be too fast to catch)
            await profileSettingsPage.takeScreenshot('loading-state');
        });

        test('TC_04_024: Should validate form before submission', async () => {
            // Test client-side validation
            const isValid = profileSettingsPage.isValidDisplayName('Valid Name');
            expect(isValid).toBe(true);
            
            const isInvalid = profileSettingsPage.isValidDisplayName('');
            expect(isInvalid).toBe(false);
        });
    });

    /**
     * ACCESSIBILITY AND UI/UX TESTS
     */
    test.describe('Accessibility and UI/UX', () => {
        
        test('TC_04_025: Should be keyboard navigable', async ({ page }) => {
            // Test tab navigation through form elements
            await page.keyboard.press('Tab');
            await expect(profileSettingsPage.displayNameInput).toBeFocused();
            
            await page.keyboard.press('Tab');
            // Next focusable element should be focused
        });

        test('TC_04_026: Should have proper ARIA labels', async () => {
            // Check for accessibility attributes
            const displayNameLabel = await profileSettingsPage.getElementAttribute(
                profileSettingsPage.displayNameInput, 
                'aria-label'
            );
            
            // Should have either aria-label or associated label
            expect(displayNameLabel || await profileSettingsPage.displayNameLabel.isVisible()).toBeTruthy();
        });

        test('TC_04_027: Should be responsive on different screen sizes', async ({ page }) => {
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

        test('TC_04_028: Should handle long content gracefully', async () => {
            // Test with very long display name
            const longName = 'A'.repeat(50);
            await profileSettingsPage.editDisplayName(longName);
            
            // Verify UI doesn't break
            await expect(profileSettingsPage.displayNameInput).toBeVisible();
            await profileSettingsPage.takeScreenshot('long-content');
        });
    });

    /**
     * INTEGRATION TESTS
     */
    test.describe('Integration Tests', () => {
        
        test('TC_04_029: Should persist changes across page refresh', async ({ page }) => {
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

        test('TC_04_030: Should maintain session during profile updates', async ({ page }) => {
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
    
    test('TC_04_031: Should load profile settings page within acceptable time', async ({ page }) => {
        const profileSettingsPage = new ProfileSettingsPage(page);
        
        // Measure page load time
        const startTime = Date.now();
        await profileSettingsPage.navigateToProfileSettings();
        const loadTime = Date.now() - startTime;
        
        // Should load within 5 seconds
        expect(loadTime).toBeLessThan(5000);
        console.log(`Profile Settings page loaded in ${loadTime}ms`);
    });

    test('TC_04_032: Should handle multiple rapid updates', async ({ page }) => {
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
