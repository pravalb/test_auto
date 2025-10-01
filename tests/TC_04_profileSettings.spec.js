import { test, expect } from '@playwright/test';
import LoginPage from '../pages/loginPage';
import ProfileSettingsPage from '../pages/profileSettings';

test.describe('Profile Settings Tests', () => {
    let loginPage;
    let profileSettingsPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        profileSettingsPage = new ProfileSettingsPage(page);
        
        // Login before each test
        await loginPage.openApp();
        await loginPage.performLogin();
    });

    test('@P1 TC_04_01: Verify Profile Settings Page Load', async ({ page }) => {
        await test.step('Navigate to Profile Settings', async () => {
            await profileSettingsPage.navigateToProfileSettings();
        });

        await test.step('Verify all profile settings elements are visible', async () => {
            await profileSettingsPage.verifyProfileSettingsPageLoaded();
            await profileSettingsPage.validateRequiredFieldsPresent();
        });

        await test.step('Verify email field is read-only', async () => {
            await profileSettingsPage.validateEmailFieldIsReadOnly();
        });
    });

    test('@P1 TC_04_02: Edit Display Name Successfully', async ({ page }) => {
        const newDisplayName = `TestUser_${Date.now()}`;
        
        await test.step('Navigate to Profile Settings', async () => {
            await profileSettingsPage.navigateToProfileSettings();
        });

        await test.step('Get current display name', async () => {
            const currentName = await profileSettingsPage.getCurrentDisplayName();
            console.log(`Current display name: ${currentName}`);
        });

        await test.step('Edit display name', async () => {
            await profileSettingsPage.editDisplayName(newDisplayName);
        });

        await test.step('Verify display name updated', async () => {
            await profileSettingsPage.verifyDisplayNameUpdated(newDisplayName);
            await profileSettingsPage.verifySuccessMessage();
        });
    });

    test('@P2 TC_04_03: Cancel Display Name Edit', async ({ page }) => {
        
        await test.step('Navigate to Profile Settings', async () => {
            await profileSettingsPage.navigateToProfileSettings();
        });

        await test.step('Get original name and cancel edit', async () => {
            const originalName = await profileSettingsPage.getCurrentDisplayName();
            expect(originalName).toBeTruthy(); // Verify we got a name
            
            await profileSettingsPage.cancelDisplayNameEdit();
            
            // Verify name unchanged after cancel
            const nameAfterCancel = await profileSettingsPage.getCurrentDisplayName();
            expect(nameAfterCancel).toBe(originalName);
        });
    });

    test('@P1 TC_04_04: Edit Timezone Successfully', async ({ page }) => {
        const newTimezone = 'UTC-05:00 Eastern Time';
        
        await test.step('Navigate to Profile Settings', async () => {
            await profileSettingsPage.navigateToProfileSettings();
        });

        await test.step('Get current timezone', async () => {
            const currentTimezone = await profileSettingsPage.getCurrentTimezone();
            console.log(`Current timezone: ${currentTimezone}`);
        });

        await test.step('Edit timezone', async () => {
            await profileSettingsPage.editTimezone(newTimezone);
        });

        await test.step('Verify timezone updated', async () => {
            await profileSettingsPage.verifyTimezoneUpdated(newTimezone);
            await profileSettingsPage.verifySuccessMessage();
        });
    });

    test('@P2 TC_04_05: Cancel Timezone Edit', async ({ page }) => {
        
        await test.step('Navigate to Profile Settings', async () => {
            await profileSettingsPage.navigateToProfileSettings();
        });

        await test.step('Get original timezone and cancel edit', async () => {
            const originalTimezone = await profileSettingsPage.getCurrentTimezone();
            expect(originalTimezone).toBeTruthy(); // Verify we got a timezone
            
            await profileSettingsPage.cancelTimezoneEdit();
            
            // Verify timezone unchanged after cancel
            const timezoneAfterCancel = await profileSettingsPage.getCurrentTimezone();
            expect(timezoneAfterCancel).toBe(originalTimezone);
        });
    });

    test('@P2 TC_04_06: Attempt Invalid Display Name', async ({ page }) => {
        const invalidNames = [
            '', // Empty
            '   ', // Whitespace only
            'a', // Too short (1 character)
            'ThisIsAVeryLongDisplayNameThatExceedsTheMaximumAllowedCharacterLimit' // Too long (>30 characters)
        ];
        
        await test.step('Navigate to Profile Settings', async () => {
            await profileSettingsPage.navigateToProfileSettings();
        });

        for (const invalidName of invalidNames) {
            await test.step(`Test invalid display name: "${invalidName}" (${invalidName.length} chars)`, async () => {
                await profileSettingsPage.attemptInvalidDisplayName(invalidName);
                await profileSettingsPage.verifyErrorMessage();
            });
        }
    });

    test('@P2 TC_04_11: Verify Valid Display Name Lengths', async ({ page }) => {
        const validNames = [
            'ab', // Minimum valid (2 characters)
            'TestUser123', // Medium length
            'User_2024', // With underscore
            'ProfileTest30CharactersLong' // Maximum valid (30 characters)
        ];
        
        await test.step('Navigate to Profile Settings', async () => {
            await profileSettingsPage.navigateToProfileSettings();
        });

        for (const validName of validNames) {
            await test.step(`Test valid display name: "${validName}" (${validName.length} chars)`, async () => {
                await profileSettingsPage.editDisplayName(validName);
                await profileSettingsPage.verifyDisplayNameUpdated(validName);
                // Optionally verify success message
                // await profileSettingsPage.verifySuccessMessage();
            });
        }
    });

    test('@P2 TC_04_07: Verify Account Details Display', async ({ page }) => {
        await test.step('Navigate to Profile Settings', async () => {
            await profileSettingsPage.navigateToProfileSettings();
        });

        await test.step('Verify account details are correctly displayed', async () => {
            const email = await profileSettingsPage.getCurrentEmail();
            const timezone = await profileSettingsPage.getCurrentTimezone();
            const displayName = await profileSettingsPage.getCurrentDisplayName();

            expect(email).toContain('@');
            expect(timezone).toContain('UTC');
            expect(displayName).toBeTruthy();
        });
    });

    test('@P2 TC_04_08: Navigate Back to Settings', async ({ page }) => {
        await test.step('Navigate to Profile Settings', async () => {
            await profileSettingsPage.navigateToProfileSettings();
        });

        await test.step('Navigate back to main settings', async () => {
            await profileSettingsPage.navigateBackToSettings();
        });

        await test.step('Verify navigation successful', async () => {
            // Verify we're back on the main settings page
            const currentUrl = await page.url();
            expect(currentUrl).toContain('/settings');
            expect(currentUrl).not.toContain('/profile');
        });
    });

    test('@P1 TC_04_09: Multiple Field Updates in Sequence', async ({ page }) => {
        const newDisplayName = `UpdatedUser_${Date.now()}`;
        const newTimezone = 'UTC+00:00 Greenwich Mean Time';
        
        await test.step('Navigate to Profile Settings', async () => {
            await profileSettingsPage.navigateToProfileSettings();
        });

        await test.step('Update display name', async () => {
            await profileSettingsPage.editDisplayName(newDisplayName);
            await profileSettingsPage.verifyDisplayNameUpdated(newDisplayName);
        });

        await test.step('Update timezone', async () => {
            await profileSettingsPage.editTimezone(newTimezone);
            await profileSettingsPage.verifyTimezoneUpdated(newTimezone);
        });

        await test.step('Verify both updates persisted', async () => {
            // Refresh page to ensure changes are saved
            await page.reload();
            await profileSettingsPage.verifyProfileSettingsPageLoaded();
            await profileSettingsPage.verifyDisplayNameUpdated(newDisplayName);
            await profileSettingsPage.verifyTimezoneUpdated(newTimezone);
        });
    });

    test('@P3 TC_04_10: Profile Settings Page Responsiveness', async ({ page }) => {
        await test.step('Navigate to Profile Settings', async () => {
            await profileSettingsPage.navigateToProfileSettings();
        });

        await test.step('Test mobile viewport', async () => {
            await page.setViewportSize({ width: 375, height: 667 });
            await profileSettingsPage.verifyProfileSettingsPageLoaded();
        });

        await test.step('Test tablet viewport', async () => {
            await page.setViewportSize({ width: 768, height: 1024 });
            await profileSettingsPage.verifyProfileSettingsPageLoaded();
        });

        await test.step('Test desktop viewport', async () => {
            await page.setViewportSize({ width: 1920, height: 1080 });
            await profileSettingsPage.verifyProfileSettingsPageLoaded();
        });
    });
});
