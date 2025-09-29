import { test, expect } from '@playwright/test';
import LoginPage from '../pages/loginPage.js';

let loginPage;

test.describe('Login Page', async () => {
// referesh token 
  
});

test('User should be able to login with valid credentials', async ({ page }) => {
  loginPage = new LoginPage(page)
  
    await loginPage.openApp()
    await loginPage.performLogin()
    await page.waitForTimeout(5000);
});

test.skip('User should not be able to login with Invalid credentials', async ({ page }) => {
  loginPage = new LoginPage(page)
  
    await loginPage.openApp()
    await loginPage.performInvlaidLogin()
    await page.waitForTimeout(5000);
});


