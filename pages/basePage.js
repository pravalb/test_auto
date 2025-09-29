import { expect } from '@playwright/test'

class BasePage {
    constructor(page) {
        this.page = page
    }

    async open(url){
        return await this.page.goto(url)
    }

    async getTitle() {
        return await this.page.title()
    }

    async getUrl() {
        return this.page.url()
    }

    async waitforPageLoad() {
        return await this.page.waitForLoadState('domcontentloaded')
    }

    async waitAndClick(selector) {
        return await this.page.click(selector)
    }
}
export default BasePage