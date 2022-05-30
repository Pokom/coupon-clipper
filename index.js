const { firefox, chromium } = require('playwright');

require('dotenv').config()

const { EMAIL: email = "", PASSWORD: password = "", HEADLESS: headless = "true" } = process.env;

if (email.length === 0 || password.length === 0) {
    console.error("Username and password must be set.");
    process.exit(1);
}

(async () => {
    console.log(`Attempting to clip coupons for ${email}`)
    const browser = await chromium.launch({ headless: headless === "true" });
    const context = await browser.newContext({
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36"
    })
    const page = await context.newPage();
    await page.goto('https://www.shoprite.com/');
    // Click [data-testid="modal_mi9MainModalContent-testId"] [data-testid="buttonComponent-testId"]
    await Promise.all([
        page.waitForNavigation(/*{ url: 'https://sts.brands.wakefern.com/shopfront/Account/Login?ReturnUrl=%2Fconnect%2Fauthorize%2Fcallback%3Fclient_id%3Dmwg.ecm.sts%26redirect_uri%3Dhttps%253A%252F%252Fsts.shoprite.com%252Fsignin-oidc-sts%26response_type%3Dcode%26scope%3Dopenid%2520profile%2520email%26code_challenge%3DEGcYpcFznV1ylKMhuB3emRaXhhg3Nr3vD54qCLqRBSY%26code_challenge_method%3DS256%26response_mode%3Dform_post%26nonce%3D637895139401475338.ZWU1ODYwNDYtYmQ3OS00NjA3LTljYjAtYzAwOWM3MGE4YjJjMjMzMmM2ZDUtYTE1Mi00YWFmLWIzNzMtZDVkNmRhZjQ4NWZj%26state%3DCfDJ8MripWUyQt9LraPjh6_Px3ORqXTXTJvXRSBD8ENQ8Z7rK3AEK6-5dFiDMg0-UbWoNB6zcR8Dx22HeSxSthIl1EocZA59X9NvQA3d8orSQUhJEpy9IKyVWsj2qWJpQmJkuddXDVKDX4Q64tPIuUZuxMGuh8jwnzbsMXwJwvoozGCsP7mPAeQNflx3Prl8_ep01S0lcVB171p3i-1h5Sdu6qCoRyvPVgKmfzWzc0ruaVgwkhZ00C0XyFVyGzSrFbSxT40qBGqtEkqF51FEc4tmIXQzaNu1VhpJ24Y161cD9dC7zxdUwb6iRPcDkMvGoiaTsJ3nEMhDv82RUEWmF_6-0pgDllxDFDAdQk4gm8K1hNiAlH4PnaR7-z3KGA0aruXmMCFkkPfPXe0jXaDyj0Smt-A764BvQriu2juj2VUA6KTzcr-6-gQa7o23r85O5Ie-y33oVUe_L-pxNCPGaP7-WZDhVJaKi9P8EDrCE6twW8_4JfxHtTdpdl9YGMeMMvrbWdu4B8L7GIV-xRqVgqlqC10OuYsTC-5rA7u5UF-cUbKrP30vFHCglVj7SDyxJ2yWABcF3BAVk6jKEm94C0XDoT1LbUjzDZ3euIea254Vhufa2iZQelnnaGLQFPPcqeoP13tsFz7w3I4z10XSN-huwIemXqzk-J7wC8qnABAm1mAeML6RIDxkLkfZgv0aC_H4vr194VYbvDSnq5vSpwh6cXSxpfAZ2bhHmVCWhyfhK_TTfu3OtWuQgvRyJ1ycyS2viveZqcszdbtVHP8dKM8qgvsqax6kVsS8t1whrupU9IbyrQA2_G5cZESvpLaoVmUklaEkH7iCuA8-YkYkwW3x_hwAdsm5T6tBGDVPixLnrQuVnPCIA44LySiSisSKpTLusqsXv63WbpJt_xXaYXk926PyiL7Zi09kj2Fl82JP2Z02bLXoAx84lui9HmslXXWaXkGFFeOTU9GqvU_dR0HYScbVrlaP7sTHb7oxsNo3ZQ4rD9iPVPIvRMfdFKMnj48wZOu4M2a1Ai1dynfng2Ji0bXhTvo_4Ezf14O3SPHhgpHYQSrSrDN0BLXY5sJjjOtUZQeQDlFamSbuKIP2TJNBCjk' }*/),
        page.locator('button', { hasText: "Sign In"}).first().click()
      ]);
    // Click [aria-label="Email"]
    await page.locator('[aria-label="Email"]').click();
    // Fill [aria-label="Email"]
    await page.locator('[aria-label="Email"]').fill(email);
    // Press Tab
    await page.locator('[aria-label="Email"]').press('Tab');
    // Press V with modifiers
    await page.locator('[aria-label="passwordLogin"]').fill(password);
    // Press Enter
    await Promise.all([
      page.waitForNavigation(/*{ url: 'https://www.shoprite.com/sm/planning/rsid/585/' }*/),
      page.locator('[aria-label="passwordLogin"]').press('Enter')
    ]);


    await Promise.all([
        page.waitForNavigation(/*{ url: 'https://www.shoprite.com/sm/planning/rsid/585/digital-coupon/?cfrom=homenavigation' }*/),
        page.locator('[data-testid="headerDesktop-testId"] nav div:has-text("Digital Coupons")').click()
    ]);
    
      // Click text=Show All >> nth=0
    await page.frameLocator('iframe[name="wakefern"]').locator('text=Show All').first().click();
    const coupons = await page.frameLocator('iframe[name="wakefern"]').locator('a', { hasText: 'Load To Card' });
    const rowCount = await coupons.count();
    console.log(`There are ${rowCount} coupons to clip`);
    for (let i = 0; i < rowCount; ++i) {
        await coupons.nth(i).click();
    }
    await context.close();
    await browser.close();
})().catch(error => {
    console.error(error);
    process.exit(1);
});
