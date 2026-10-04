    const { expect } = require('@playwright/test')

    exports.LoginPage = class LoginPage {

    constructor(page) {

        this.page = page 

    
    this.landingPage_logo = page.getByRole('link', { name: 'Go to the cheapflights homepage' })
    this.signUp_button = page.getByRole('button', { name: 'Sign in' })

    }

    async gotoLoginPage() {
        await this.page.goto('https://www.cheapflights.com.au/')
    }

    async validateLogo() {
        await expect(this.landingPage_logo).toBeVisible()
    }

    async validateSignInButton(){
        await expect(this.signUp_button).toBeVisible()
    }




}