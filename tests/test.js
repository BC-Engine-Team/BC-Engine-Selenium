const { By, Key, Builder, until } = require("selenium-webdriver");
require("chromedriver");
const assert = require("assert");
const { describe, beforeEach, afterEach, it } = require("mocha");
const { elementIsVisible, elementLocated } = require("selenium-webdriver/lib/until");
const should = require('chai').should();

describe("Login as specific user", function() {
    let driver;

    beforeEach(function() {
        driver = new Builder().forBrowser("chrome").build();
        driver.get("http://localhost:3000");
    });

    it("Successfully loged in as admin", async function () {

        await login(driver);
    });

    it("Successfully loged in as employee", async function() {

        await login(driver, "employee");
    });

    it("Successfully loged out", async function() {

        await login(driver);

        await logout(driver);
    });

    afterEach(function() {
        driver.quit()
    });
})

async function login(driver, role = "admin") {

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

async function logout(driver) {

   await driver.wait(until.elementLocated(By.id("sign_out")), 10000).click();

    let url = await driver.wait(until.urlContains("login"));
    console.log(url);

    console.assert(url);
    console.log('Logged out.')

}