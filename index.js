const { firefox } = require('playwright');

require('dotenv').config()

const {EMAIL: email, PASSWORD: password} = process.env;

(async() => {
    const browser = await firefox.launch();
    const page = await browser.newPage();
    await page.goto('https://coupons.shoprite.com');
    await page.click('#ShopperIdentityBtn')
    await page.fill('input[name="Email"]', email);
    await page.fill('input[name="Password"]', password);
    await page.click('#SignIn');
    await page.click('"Show All"')
    const coupons = await page.$$('.available-to-clip')
    for await (const coupon of coupons) {
        await coupon.click({ timeout: 500 }).catch(console.error);
        await page.click('"Ok"', { timeout: 1000 }).catch(console.error);
    }
    await browser.close();
})();
