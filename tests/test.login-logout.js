const { By, Key, Builder } = require("selenium-webdriver");
require("chromedriver");
const assert = require("assert");
const { describe, beforeEach, afterEach, it } = require("mocha");
const { login } = require('./components/login');
const { logout } = require('./components/logout');


describe("S1 - Login, Logout and Roles", () => {

    // Tests the different roles available
    describe("S1.1 - User wants to login", () => {
        let driver;
        let url = "http://localhost:3000";

        beforeEach(() => {
            driver = new Builder().forBrowser("chrome").build();
            driver.get(url);
        });

        it("S1.1.1 - Successfully loged in as admin", async () => {

            await login(driver);
        });

        it("S1.1.2 - Successfully loged in as employee", async () => {

            await login(driver, "employee");
        });

        afterEach(async () => {
            await driver.quit()
        });
    })

    // Tests the logout function
    describe("S1.2 - User wants to logout", () => {
        let driver;
        let url = "http://localhost:3000";

        beforeEach(() => {
            driver = new Builder().forBrowser("chrome").build();
            driver.get(url);
        });

        it("S1.2.1 - Successfully loged out", async () => {

            await login(driver);

            await logout(driver);
        });

        afterEach(async () => {
            await driver.quit()
        });
    })

    // Tests the login validation
    describe("S1.3 - Verify login validation", () => {
        let driver;
        let url = "http://localhost:3000";

        beforeEach(async () => {
            driver = new Builder().forBrowser("chrome").build();
            driver.get(url);
            await driver.sleep(1000);
        });

        it("S1.3.1 - Should show alert when email is empty", async () => {
            let password = "verySecurePassword";

            await driver.findElement(By.id("floatingPassword")).sendKeys(password, Key.RETURN);

            await driver.findElement(By.className("btn")).click();

            let alert = await driver.findElements(By.className("invalid-feedback"));

            assert(alert[0].isDisplayed());
        });

        it("S1.3.2 - Should show alert when password is empty", async () => {
            let username = "first@benoit-cote.com";

            await driver.findElement(By.id("floatingEmail")).sendKeys(username, Key.RETURN);

            await driver.findElement(By.className("btn")).click();

            let alert = await driver.findElements(By.className("invalid-feedback"));

            assert(alert[1].isDisplayed());
        });

        it("S1.3.3 - Should show both alerts when password and email are empty", async () => {

            let alertCounter = 0;

            await driver.findElement(By.className("btn")).click();

            let alert = await driver.findElements(By.className("invalid-feedback"));

            alert.forEach(element => {
                if (element.isDisplayed()) {
                    alertCounter += 1;
                }
            });

            assert.equal(alertCounter, 2);
        });

        it("S1.3.4 - Should show alert saying 'incorrect email or password'", async () => {
            let username = "a@a.com";
            let password = "testIncorrect";

            await driver.findElement(By.id("floatingEmail")).sendKeys(username, Key.RETURN);
            await driver.findElement(By.id("floatingPassword")).sendKeys(password, Key.RETURN);

            await driver.findElement(By.className("btn")).click();

            let alert = await driver.findElement(By.css("div[role=alert]")).getText();

            assert.equal(alert, "Incorrect email or password.");
        });

        afterEach(async () => {
            await driver.quit();
        });
    })
});