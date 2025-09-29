// import BasePage from "./basePage";
// import { expect } from "allure-playwright";

// class CreateChatbot extends BasePage {
//     constructor(page){
//         super(page)
//         this.page(page)

//         //tab selectors
//         this.generalTab = page.locator('text=General');
//         this.chatThemeTab = page.locator('text=Chat Theme');
//         this.trainAITab = page.locator('text=Train AI');

//         //general tab form field selectors:
//         this.fullNameInput = page.getByPlaceholder('Your Full Name');
//         this.companyNameInput = page.getByPlaceholder('Your Company Name');
//         this.jobTitleInput = page.getByPlaceholder('Your Role in the Company');
//         this.industryDropdown = page.getByText('Select an industry');
//         this.companySizeDropdown = page.getByText('Select company size');
//         this.goalsTextarea = page.getByPlaceholder('Describe what you hope to achieve with this app.');
        
//         // Navigation buttons
//         this.nextButton = page.getByRole('button', { name: 'Next' });
//         this.backToChatbotsButton = page.getByText('Back to Chatbots');

        
    
//     }
//     async navigateToCreateChatbot() {
//         await super.open(`${process.env.BASE_URL}/chatbot/create`); //navigate to chatbot craetion page
//         return await super.waitforPageLoad(); //wait for the page to fully load to return the result
//     }

//     async fillGeneralInformation(userData = {}) {
//         const defaultData = {
//             fullName: process.env.USER_FULLNAME || 'Test User',
//             companyName: process.env.COMPANY_NAME || 'Test Company',
//             jobTitle: process.env.JOB_TITLE || 'Test Engineer',
//             industry: 'Technology',
//             companySize: 'Small (1-50 employees)',
//             goals: 'Testing automation for chatbot creation functionality'
//         };

//         //this cretaes new object called data. First spreads defaultdata properties and then userData. If both have same properties userData will override defaultData
//         const data = { ...defaultData, ...userData };
//         // (or) const data = Object.assign({}, defaultData, userData);

//         await this.fillTextFields(data);
//         await this.selectDropdowns(data);
//     }
//     async fillTextFields(data) {
//         await this.fullNameInput.fill(data.fullName);
//         await this.companyNameInput.fill(data.companyName);
//         await this.jobTitleInput.fill(data.jobTitle);
//         await this.goalsTextarea.fill(data.goals);
//     }

//     async selectDropdowns(data) {
//         await this.selectDropdownOption(this.industryDropdown, data.industry);
//         await this.selectDropdownOption(this.companySizeDropdown, data.companySize);
//     }

   

    

    
// }

import BasePage from "./basePage";
import { expect } from "allure-playwright";

class CreateChatbot extends BasePage {
    constructor(page){
        super(page)
        this.page = page;  

        //tab selectors
        this.generalTab = page.locator('text=General');
        this.chatThemeTab = page.locator('text=Chat Theme');
        this.trainAITab = page.locator('text=Train AI');

        //general tab form field selectors:
        this.fullNameInput = page.getByPlaceholder('Your Full Name');
        this.companyNameInput = page.getByPlaceholder('Your Company Name');
        this.jobTitleInput = page.getByPlaceholder('Your Role in the Company');
        this.industryDropdown = page.getByText('Select an industry');
        this.companySizeDropdown = page.getByText('Select company size');
        this.goalsTextarea = page.getByPlaceholder('Describe what you hope to achieve with this app.');
//----------------------------
        // Chat Theme tab selectors
        this.chatbotNameInput = page.getByPlaceholder('Chatbot Name'); // Or use page.locator('input[name="chatbot-name"]')
        this.themeDropdown = page.getByText('Light Mode');
        this.descriptionTextarea = page.getByPlaceholder('Description'); // For chatbot description
        this.welcomeMessageTextarea = page.getByPlaceholder('Welcome Message'); // For welcome message
        this.chatColorPicker = page.locator('.chat-color-picker, [data-testid="color-picker"]'); // Adjust based on actual selector
        this.gradientToggle = page.locator('text=Gradient'); // For the gradient toggle
        // Quick Replies selectors (from Chat Theme)
        this.quickReply1 = page.getByPlaceholder('How can I integrate my Amazon account?'); // Adjust based on actual placeholders
        this.quickReply2 = page.getByPlaceholder('What analytics features do you offer?');
        this.quickReply3 = page.getByPlaceholder('How does your AI optimize inventory levels?');
//----------------------------
         // Train AI tab selectors
        this.behaviorInstructionsTextarea = page.getByPlaceholder('Provide specific instructions or prompts for the AI bot here.');
        this.conversationStyleSlider = page.locator('[data-testid="conversation-style-slider"]'); // Formal to Enthusiastic slider
        this.creativitySlider = page.locator('[data-testid="creativity-slider"]'); // Reserved to Creative slider
        this.messageRateLimitInput = page.getByPlaceholder('Message Rate Limit'); // Input for "5"
        this.limitIntervalInput = page.getByPlaceholder('Limit Interval'); // Input for "30"
        
        // Navigation buttons
        this.nextButton = page.getByRole('button', { name: 'Next' });
        this.previousButton = page.getByRole('button', { name: 'previous' });
        this.saveChangesButton = page.getByRole('button', { name: 'Save Changes' });
        this.backToChatbotsButton = page.getByText('Back to Chatbots');

        // Success/verification elements
     
        this.pageTitle = page.getByText('Create a new chatbot');
        this.chatbotCreatedMessage = page.getByText('Chatbot created successfully');
    
    }
    async navigateToCreateChatbot() {
        await super.open(`${process.env.BASE_URL}/chatbot/create`); //navigate to chatbot creation page
        return await super.waitforPageLoad(); //wait for the page to fully load to return the result
    }

    async fillGeneralInformation(userData = {}) {
        const defaultData = {
            fullName: process.env.USER_FULLNAME || 'Test User',
            companyName: process.env.COMPANY_NAME || 'Test Company',
            jobTitle: process.env.JOB_TITLE || 'Test Engineer',
            industry: 'Technology',
            companySize: 'Small (1-50 employees)',
            goals: 'Testing automation for chatbot creation functionality'
        };

        //this creates new object called data. First spreads defaultdata properties and then userData. If both have same properties userData will override defaultData
        const data = { ...defaultData, ...userData };
        // (or) const data = Object.assign({}, defaultData, userData);

        await this.fillTextFields(data);
        await this.selectDropdowns(data);
    }

    async fillTextFields(data) {
        await this.fullNameInput.fill(data.fullName);
        await this.companyNameInput.fill(data.companyName);
        await this.jobTitleInput.fill(data.jobTitle);
        await this.goalsTextarea.fill(data.goals);
    }

    async selectDropdowns(data) {
        await this.selectDropdownOption(this.industryDropdown, data.industry);
        await this.selectDropdownOption(this.companySizeDropdown, data.companySize);
    }

    async selectDropdownOption(dropdown, optionText) {
        await dropdown.click();
        await this.page.getByText(optionText).click();
        await this.waitforPageLoad();
    }
    //method to proceed to next step
    async proceedToNextStep() {
        await this.nextButton.click();
        await this.waitforPageLoad();
    }

    // Added method for final save (creates the chatbot)
    async saveChanges() {
        await this.saveChangesButton.click();
        await this.waitforPageLoad();
    }

    // ---- CHAT THEME METHODS ----
    async customizeChatTheme(themeOptions = {}) {
        const defaultTheme = {
            chatbotName: 'Hilal',
            theme: 'Light Mode',
            description: 'Hi, my name is Hilal and I\'m here to assist you',
            welcomeMessage: 'Hello! How can I assist you?',
            chatColor: 'purple', // or hex color
            gradient: true,
            quickReplies: [
                'How can I integrate my Amazon account?',
                'What analytics features do you offer?',
                'How does your AI optimize inventory levels?'
            ]
        };

        const theme = { ...defaultTheme, ...themeOptions };

        // Fill chatbot customization fields
        if (theme.chatbotName) {
            await this.chatbotNameInput.clear();
            await this.chatbotNameInput.fill(theme.chatbotName);
        }

        if (theme.description) {
            await this.descriptionTextarea.clear();
            await this.descriptionTextarea.fill(theme.description);
        }

        if (theme.welcomeMessage) {
            await this.welcomeMessageTextarea.clear();
            await this.welcomeMessageTextarea.fill(theme.welcomeMessage);
        }

        // Select theme dropdown
        if (theme.theme) {
            await this.selectDropdownOption(this.themeDropdown, theme.theme);
        }

        // Handle color selection (this might need adjustment based on actual UI)
        if (theme.chatColor) {
            await this.chatColorPicker.click();
            // Add logic to select specific color
        }

        // Toggle gradient if needed
        if (theme.gradient !== undefined) {
            const isGradientEnabled = await this.gradientToggle.isChecked();
            if (theme.gradient !== isGradientEnabled) {
                await this.gradientToggle.click();
            }
        }

        // Fill quick replies
        if (theme.quickReplies && theme.quickReplies.length > 0) {
            if (theme.quickReplies[0]) await this.quickReply1.fill(theme.quickReplies[0]);
            if (theme.quickReplies[1]) await this.quickReply2.fill(theme.quickReplies[1]);
            if (theme.quickReplies[2]) await this.quickReply3.fill(theme.quickReplies[2]);
        }
    }

    // ---- TRAIN AI METHODS ----
    async trainAI(aiData = {}) {
        const defaultAI = {
            behaviorInstructions: 'Provide helpful and accurate responses about our products and services.',
            conversationStyle: 'casual', // 'formal' or 'casual'
            creativity: 'moderate', // 'enthusiastic', 'reserved', 'moderate', 'creative'
            messageRateLimit: 5,
            limitInterval: 30
        };

        const ai = { ...defaultAI, ...aiData };

        // Fill behavior instructions
        if (ai.behaviorInstructions) {
            await this.behaviorInstructionsTextarea.clear();
            await this.behaviorInstructionsTextarea.fill(ai.behaviorInstructions);
        }

        // Set conversation style (this might need adjustment based on actual slider implementation)
        if (ai.conversationStyle) {
            await this.setConversationStyle(ai.conversationStyle);
        }

        // Set creativity level
        if (ai.creativity) {
            await this.setCreativityLevel(ai.creativity);
        }

        // Set rate limits
        if (ai.messageRateLimit) {
            await this.messageRateLimitInput.clear();
            await this.messageRateLimitInput.fill(ai.messageRateLimit.toString());
        }

        if (ai.limitInterval) {
            await this.limitIntervalInput.clear();
            await this.limitIntervalInput.fill(ai.limitInterval.toString());
        }
    }
    // Helper method to set creativity level slider
    async setCreativityLevel(level) {
        // This might need adjustment based on how the slider is implemented
        const levelButton = this.page.getByText(level, { exact: false });
        await levelButton.click();
    }

    //----FLOW METHODS-----
    //1. Basic Flow (skip theme & AI customization)
    async createChatbotWithValidData(userData = {}) {
        // Step 1: Fill General Information
        await this.fillGeneralInformation(userData);
        await this.proceedToNextStep(); // Go to Chat Theme tab
        
        // Step 2: Chat Theme tab (skip if no changes needed)
        await this.proceedToNextStep(); // Go to Train AI tab
        
        // Step 3: Train AI tab and save
        await this.saveChanges(); // Final save to create chatbot
        return await this.verifyChatbotCreationSuccess();
    }

    //2. With Theme Customization:
    async createChatbotWithThemeCustomization(userData = {}, themeOptions = {}) {
        // Step 1: Fill General Information
        await this.fillGeneralInformation(userData);
        await this.proceedToNextStep(); // Go to Chat Theme
        
        // Step 2: Customize Chat Theme if options provided
        if (Object.keys(themeOptions).length > 0) {
            await this.customizeChatTheme(themeOptions); // Customize if needed
        }
        await this.proceedToNextStep(); // Go to Train AI
        
        // Step 3: Train AI and save
        await this.saveChanges(); // Final save to create chatbot
        return await this.verifyChatbotCreationSuccess();
    }

    //3. With AI Training:
    async createChatbotWithAITraining(userData = {}, themeOptions = {}, aiData = {}) {
        // Step 1: Fill General Information
        await this.fillGeneralInformation(userData);
        await this.proceedToNextStep(); // Go to Chat Theme
        
        // Step 2: Customize Chat Theme if options provided
        if (Object.keys(themeOptions).length > 0) {
            await this.customizeChatTheme(themeOptions); // Customize if needed
        }
        await this.proceedToNextStep(); // Go to Train AI
        
        // Step 3: Train AI with provided data
        if (Object.keys(aiData).length > 0) {
            await this.trainAI(aiData); // Train AI if data provided
        }
        
        await this.saveChanges(); // Final save to create chatbot
        return await this.verifyChatbotCreationSuccess();
    }


    // Verification method to confirm chatbot creation
    async verifyChatbotCreationSuccess() {
        // Verify by checking for a success message or redirection to chatbot list
        await expect(this.chatbotCreatedMessage).toBeVisible({ timeout: 10000 });
        return true; // Return true if verification passes
    }

    // Helper method to verify we're on the correct tab
    async verifyCurrentTab(tabName) {
        const activeTab = this.page.locator(`text=${tabName}`).first();
        await expect(activeTab).toBeVisible();
    }


}

export default CreateChatbot;