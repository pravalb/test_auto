import BasePage from "./basePage";
import { dashboardChatbotTitle } from "../data/testData.json";
import { expect } from "allure-playwright";

class LoginPage extends BasePage {
    constructor(page) {
        super(page)
        this.page=page;
        this.emailAddress = page.getByLabel('Email address');
        this.password = page.getByLabel('Password');
        this.signInButton = page.getByRole('button', {name: 'Sign in'});
        this.backToAppButton = page.getByText('Back to application');
        this.verifyChatbotDashboardtext = page.locator('div.font-semibold.leading-none.tracking-tight').getByText('Inbox');
    }

    async openApp() {
        await super.open(process.env.BASE_URL, { waitUntill: 'domcontentloaded' }) //env variable
        return await super.waitforPageLoad()
    }

    async performLogin() {
        await this.emailAddress.fill(process.env.USEREMAIL);
        await this.password.fill(process.env.PASSWORD);
        await this.signInButton.click();
        await this.waitforPageLoad();
        await this.backToAppButton.click();
        await expect(this.verifyChatbotDashboardtext).toContainText(dashboardChatbotTitle);
        
    }

     async performInvlaidLogin() {
        await this.emailAddress.fill(process.env.INVALIDUSEREMAIL);
        await this.password.fill(process.env.INVALIDPASSWORD);
        await this.signInButton.click();
    }
}

export default LoginPage
