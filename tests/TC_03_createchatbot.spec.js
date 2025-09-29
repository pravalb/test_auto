import { test, expect } from '@playwright/test';
import LoginPage from '../pages/loginPage.js';
import CreateChatbot from '../pages/createChatbot.js';

let loginPage;
let createChatbot;

test.describe('Create Chatbot Page', async () => {
  // Login before each test
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.openApp();
    await loginPage.performLogin();
    // Wait for login to complete
    await page.waitForTimeout(3000);
  });
});



test('User should be able to create chatbot with valid data (basic flow)', async ({ page }) => {
  createChatbot = new CreateChatbot(page)
  
    await createChatbot.navigateToCreateChatbot()
    await createChatbot.createChatbotWithValidData()
    await page.waitForTimeout(5000);
});

test('User should be able to fill general information form', async ({ page }) => {
  createChatbot = new CreateChatbot(page)
  
    await createChatbot.navigateToCreateChatbot()
    await createChatbot.fillGeneralInformation()
    await createChatbot.proceedToNextStep()
    await page.waitForTimeout(3000);
});

test('User should be able to create chatbot with custom theme', async ({ page }) => {
  createChatbot = new CreateChatbot(page)
  
    const themeOptions = {
        chatbotName: 'TestBot',
        welcomeMessage: 'Hello! Welcome to our test chatbot!',
        description: 'This is a test chatbot for automation testing'
    };
    
    await createChatbot.navigateToCreateChatbot()
    await createChatbot.createChatbotWithThemeCustomization({}, themeOptions)
    await page.waitForTimeout(5000);
});

test('User should be able to create chatbot with AI training', async ({ page }) => {
  createChatbot = new CreateChatbot(page)
  
    const aiData = {
        behaviorInstructions: 'Be helpful and provide detailed responses about our products',
        conversationStyle: 'casual',
        creativity: 'moderate',
        messageRateLimit: 10,
        limitInterval: 60
    };
    
    await createChatbot.navigateToCreateChatbot()
    await createChatbot.createChatbotWithAITraining({}, {}, aiData)
    await page.waitForTimeout(5000);
});

test('User should be able to navigate between tabs', async ({ page }) => {
  createChatbot = new CreateChatbot(page)
  
    await createChatbot.navigateToCreateChatbot()
    await createChatbot.fillGeneralInformation()
    await createChatbot.proceedToNextStep() // Go to Chat Theme
    await page.waitForTimeout(2000);
    
    await createChatbot.proceedToNextStep() // Go to Train AI
    await page.waitForTimeout(2000);
    
    await createChatbot.goToPreviousStep() // Go back to Chat Theme
    await page.waitForTimeout(2000);
});

test.skip('User should be able to create chatbot with custom user data', async ({ page }) => {
  createChatbot = new CreateChatbot(page)
  
    const customUserData = {
        fullName: 'John Doe',
        companyName: 'Acme Corp',
        jobTitle: 'Product Manager',
        industry: 'Healthcare',
        companySize: 'Medium (51-200 employees)',
        goals: 'Improve customer support and reduce response time'
    };
    
    await createChatbot.navigateToCreateChatbot()
    await createChatbot.createChatbotWithValidData(customUserData)
    await page.waitForTimeout(5000);
});

test.skip('User should see validation errors for empty required fields', async ({ page }) => {
  createChatbot = new CreateChatbot(page)
  
    await createChatbot.navigateToCreateChatbot()
    // Try to proceed without filling any fields
    await createChatbot.proceedToNextStep()
    // Add verification for validation errors here
    await page.waitForTimeout(3000);
});

test.skip('User should be able to complete full customization flow', async ({ page }) => {
  createChatbot = new CreateChatbot(page)
  
    const userData = {
        fullName: 'Jane Smith',
        companyName: 'Tech Solutions Inc',
        jobTitle: 'CTO'
    };
    
    const themeOptions = {
        chatbotName: 'TechBot',
        welcomeMessage: 'Hi! I\'m TechBot, how can I help you today?',
        chatColor: 'blue'
    };
    
    const aiData = {
        behaviorInstructions: 'Provide technical support and product information',
        conversationStyle: 'formal',
        creativity: 'creative'
    };
    
    await createChatbot.navigateToCreateChatbot()
    await createChatbot.createChatbotWithAITraining(userData, themeOptions, aiData)
    await page.waitForTimeout(5000);
},

// test('Debug - Simple navigation test', async ({ page }) => {
//   loginPage = new LoginPage(page);
//   await loginPage.openApp();
//   await loginPage.performLogin();
//   await page.waitForTimeout(5000);
  
//   // Go to create chatbot page
//   await page.goto('https://dev.chat.hilalsoftware.tools/chatbot/create');
//   await page.waitForTimeout(5000);
  
//   // Check if we can see the form
//   await expect(page.getByText('Create a new chatbot')).toBeVisible();
//   await expect(page.getByText('General')).toBeVisible();
  
//   // Try to find the full name input with different selectors
//   const byPlaceholder = page.getByPlaceholder('Your Full Name');
//   const byLabel = page.getByLabel('Full Name');
  
//   console.log('Found by placeholder:', await byPlaceholder.count());
//   console.log('Found by label:', await byLabel.count());
  
//   // Take screenshot to see current state
//   await page.screenshot({ path: 'debug-form.png', fullPage: true });
// })


);