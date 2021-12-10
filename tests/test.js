const { By, Key, Builder, until } = require("selenium-webdriver");
require("chromedriver");
const assert = require("assert");
const { describe, beforeEach, afterEach, it } = require("mocha");

// Tests the different roles available
describe("User wants to login", () => {
    let driver;
    let url = "http://localhost:3000";

    beforeEach(() => {
        driver = new Builder().forBrowser("chrome").build();
        driver.get(url);
    });

    it("Successfully loged in as admin", async () => {

        await login(driver);
    });

    it("Successfully loged in as employee", async () => {

        await login(driver, "employee");
    });

    afterEach(async () => {
        await driver.quit()
    });
})

// Tests the logout function
describe("User wants to logout", () => {
    let driver;
    let url = "http://localhost:3000";

    beforeEach(() => {
        driver = new Builder().forBrowser("chrome").build();
        driver.get(url);
    });

    it("Successfully loged out", async () => {

        await login(driver);
    
        await logout(driver);
    });

    afterEach(async () => {
        await driver.quit()
    });
})

// Tests the login validation
describe("Verify login validation", () => {
    let driver;
    let url = "http://localhost:3000";

    beforeEach(() => {
        driver = new Builder().forBrowser("chrome").build();
        driver.get(url);
    });

    it("Should show alert when email is empty", async () => {
        let password = "verySecurePassword";

        await driver.findElement(By.id("floatingPassword")).sendKeys(password, Key.RETURN);
    
        await driver.findElement(By.className("btn")).click();

        let alert = await driver.findElements(By.className("invalid-feedback"));

        assert(alert[0].isDisplayed());
    });

    it("Should show alert when password is empty", async () => {
        let username = "first@benoit-cote.com";

        await driver.findElement(By.id("floatingEmail")).sendKeys(username, Key.RETURN);
    
        await driver.findElement(By.className("btn")).click();

        let alert = await driver.findElements(By.className("invalid-feedback"));

        assert(alert[1].isDisplayed());
    });

    it("Should show both alerts when password and email are empty", async () => {
    
        let alertCounter = 0;

        await driver.findElement(By.className("btn")).click();

        let alert = await driver.findElements(By.className("invalid-feedback"));

        alert.forEach(element => {
            if(element.isDisplayed()) {
                alertCounter += 1;
            }
        });

        assert.equal(alertCounter, 2);
    });

    it("Should show alert saying 'incorrect email or password'", async () => {
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

login = async (driver, role = "admin") => {

    let username,
        password;

    if (role === "admin") {
        username = "first@benoit-cote.com";
        password = "verySecurePassword";
    }
    else if (role = "employee") { 
        username = "second@benoit-cote.com";
        password = "verySecurePassword";
    }

    await driver.findElement(By.id("floatingEmail")).sendKeys(username, Key.RETURN);
    await driver.findElement(By.id("floatingPassword")).sendKeys(password, Key.RETURN);

    await driver.findElement(By.className("btn")).click();

    let navElements = await driver.wait(until.elementsLocated(By.className("px-2 nav-link")), 10000);

    if (role === "admin") {
        assert.equal(navElements.length, 4)
        console.log('Logged in as admin.');
    }
    else if (role = "employee") {
        assert.equal(navElements.length, 2)
        console.log('Logged in as employee.');
    }
}

logout = async (driver) => {

    await driver.wait(until.elementLocated(By.id("sign_out")), 10000).click();

    let url = await driver.wait(until.urlContains("login"));

    assert(url);
    console.log('Logged out.')

}