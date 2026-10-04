import { test, expect } from '@playwright/test'
import {LoginPage} from '../pages/landingpage'


test('Validate logo and Sign in button in the landing page', async ({ page }) => {
	const Login = new LoginPage(page);


await test.step('Goto landing page', async () => {
    await Login.gotoLoginPage()
})

await test.step('Validate the logo is visible', async () => {
    await Login.validateLogo()
})

await test.step('Validate the sign-in button is visible', async () => {
    await Login.validateSignInButton()
})

await test.step('Validate the position of the logo and sign-in button', async () => {
    const logoPosition = await Login.landingPage_logo.boundingBox()
    const signInPosition = await Login.signUp_button.boundingBox()

    expect(logoPosition).not.toBeNull()
    expect(signInPosition).not.toBeNull()
    expect(logoPosition.x).toBeLessThan(signInPosition.x)
    expect(Math.abs(logoPosition.y - signInPosition.y)).toBeLessThan(80)
})

})