/**
 * Test Helper Utilities
 * 
 * This file contains common utility functions and helpers used across multiple test files
 * to reduce code duplication and improve maintainability.
 */

const fs = require('fs');
const path = require('path');

class TestHelpers {
    
    /**
     * Authentication Helper Methods
     */
    
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
            
            // Wait for successful login (dashboard or main page)
            await page.waitForURL('**/dashboard', { timeout: 15000 });
            
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

    /**
     * Data Management Helper Methods
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

    /**
     * File and Image Helper Methods
     */
    
    // Create a test image file (base64 encoded)
    static createTestImageFile(width = 200, height = 200, format = 'png') {
        // This would create a simple colored rectangle as test image
        // In a real implementation, you might use a library like canvas or sharp
        const canvas = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#4CAF50"/>
            <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="Arial" font-size="16">Test Image</text>
        </svg>`;
        
        return {
            name: `test-image-${Date.now()}.${format}`,
            content: canvas,
            size: canvas.length,
            type: `image/${format}`
        };
    }
    
    // Check if file exists
    static fileExists(filePath) {
        try {
            return fs.existsSync(filePath);
        } catch (error) {
            return false;
        }
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

    /**
     * Wait and Timing Helper Methods
     */
    
    // Wait for element with custom timeout and retry logic
    static async waitForElementWithRetry(page, selector, options = {}) {
        const { timeout = 10000, retries = 3, interval = 1000 } = options;
        
        for (let i = 0; i < retries; i++) {
            try {
                await page.waitForSelector(selector, { timeout: timeout / retries });
                return true;
            } catch (error) {
                if (i === retries - 1) {
                    throw error;
                }
                await page.waitForTimeout(interval);
            }
        }
        return false;
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

    /**
     * Screenshot and Debugging Helper Methods
     */
    
    // Take screenshot with timestamp and test info
    static async takeScreenshot(page, name, testInfo = {}) {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const fileName = `${name}-${timestamp}.png`;
            const screenshotPath = path.join(__dirname, '..', 'screenshots', fileName);
            
            // Ensure screenshots directory exists
            this.ensureDirectoryExists(path.dirname(screenshotPath));
            
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
        return await this.takeScreenshot(page, `FAILED-${testTitle.replace(/\s+/g, '-')}`);
    }
    
    // Capture page HTML for debugging
    static async capturePageHTML(page, name) {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const fileName = `${name}-${timestamp}.html`;
            const htmlPath = path.join(__dirname, '..', 'debug', fileName);
            
            this.ensureDirectoryExists(path.dirname(htmlPath));
            
            const html = await page.content();
            fs.writeFileSync(htmlPath, html, 'utf8');
            
            console.log(`HTML captured: ${fileName}`);
            return htmlPath;
        } catch (error) {
            console.error('Failed to capture HTML:', error.message);
            return null;
        }
    }

    /**
     * Validation Helper Methods
     */
    
    // Validate email format
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Validate display name
    static isValidDisplayName(name) {
        return name && 
               typeof name === 'string' && 
               name.trim().length > 0 && 
               name.length <= 100;
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

    /**
     * Browser and Environment Helper Methods
     */
    
    // Get browser info
    static async getBrowserInfo(page) {
        try {
            const userAgent = await page.evaluate(() => navigator.userAgent);
            const viewport = page.viewportSize();
            
            return {
                userAgent,
                viewport,
                url: page.url(),
                title: await page.title()
            };
        } catch (error) {
            console.error('Failed to get browser info:', error.message);
            return {};
        }
    }
    
    // Set viewport size for responsive testing
    static async setViewportSize(page, width, height) {
        try {
            await page.setViewportSize({ width, height });
            return true;
        } catch (error) {
            console.error('Failed to set viewport size:', error.message);
            return false;
        }
    }
    
    // Check if element is in viewport
    static async isElementInViewport(page, selector) {
        try {
            return await page.evaluate((sel) => {
                const element = document.querySelector(sel);
                if (!element) return false;
                
                const rect = element.getBoundingClientRect();
                return (
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                );
            }, selector);
        } catch (error) {
            return false;
        }
    }

    /**
     * Form Helper Methods
     */
    
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
    
    // Clear all form fields
    static async clearForm(page, formSelector = 'form') {
        try {
            const inputs = page.locator(`${formSelector} input, ${formSelector} textarea`);
            const count = await inputs.count();
            
            for (let i = 0; i < count; i++) {
                await inputs.nth(i).clear();
            }
            return true;
        } catch (error) {
            console.error('Failed to clear form:', error.message);
            return false;
        }
    }

    /**
     * Network and API Helper Methods
     */
    
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
    
    // Intercept network requests
    static async interceptRequests(page, urlPattern, callback) {
        try {
            await page.route(urlPattern, callback);
            return true;
        } catch (error) {
            console.error('Failed to intercept requests:', error.message);
            return false;
        }
    }
    
    // Wait for specific network request
    static async waitForRequest(page, urlPattern, timeout = 10000) {
        try {
            const request = await page.waitForRequest(
                request => request.url().includes(urlPattern),
                { timeout }
            );
            return request;
        } catch (error) {
            console.error('Request timeout:', error.message);
            return null;
        }
    }

    /**
     * Accessibility Helper Methods
     */
    
    // Check for basic accessibility issues
    static async checkAccessibility(page) {
        try {
            const issues = await page.evaluate(() => {
                const problems = [];
                
                // Check for images without alt text
                const images = document.querySelectorAll('img:not([alt])');
                if (images.length > 0) {
                    problems.push(`${images.length} images without alt text`);
                }
                
                // Check for form inputs without labels
                const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
                const unlabeledInputs = Array.from(inputs).filter(input => {
                    const label = document.querySelector(`label[for="${input.id}"]`);
                    return !label;
                });
                if (unlabeledInputs.length > 0) {
                    problems.push(`${unlabeledInputs.length} form inputs without labels`);
                }
                
                // Check for buttons without accessible names
                const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
                const unlabeledButtons = Array.from(buttons).filter(button => 
                    !button.textContent.trim()
                );
                if (unlabeledButtons.length > 0) {
                    problems.push(`${unlabeledButtons.length} buttons without accessible names`);
                }
                
                return problems;
            });
            
            return issues;
        } catch (error) {
            console.error('Accessibility check failed:', error.message);
            return [];
        }
    }
}

module.exports = TestHelpers;
