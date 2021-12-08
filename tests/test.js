const {By, Key, Builder, until} = require("selenium-webdriver");
require("chromedriver");
const should = require('chai').should();

async function loginAsAdmin() {
    let driver = new Builder().forBrowser("chrome").build();

    try {
        let username = "first@benoit-cote.com";
        let password = "verySecurePassword";

        await driver.get("http://localhost:3000");

        await driver.findElement(By.id("floatingEmail")).sendKeys(username,Key.RETURN);
        await driver.findElement(By.id("floatingPassword")).sendKeys(password,Key.RETURN);

        await driver.findElement(By.className("btn")).click();

        let navElements = await driver.wait(until.elementsLocated(By.className("px-2 nav-link")), 10000);

        console.assert(navElements.length === 4);
        console.log('Logged in as admin.')

        await driver.quit();
    }
    catch(err) {
        handleFailure(err, driver);
    }
}

function loginAsEmployee() {
    let driver = new Builder().forBrowser("chrome").build();

    try {
        driver.get("http://localhost:3000");

        let username = "second@benoit-cote.com";
        let password = "verySecurePassword";

        driver.findElement(By.id("floatingEmail")).sendKeys(username,Key.RETURN);
        driver.findElement(By.id("floatingPassword")).sendKeys(password,Key.RETURN);

        driver.findElement(By.className("btn")).click();

        let navElements = driver.wait(until.elementsLocated(By.className("px-2 nav-link")), 10000);

        console.assert(navElements.length === 2);
        console.log('Logged in as employee.')

        driver.quit();
    }
    catch(err) {
        handleFailure(err, driver);
    }
}

function logout() {
    let driver = new Builder().forBrowser("chrome").build();

    try {
        driver.get("http://localhost:3000");

        let username = "first@benoit-cote.com";
        let password = "verySecurePassword";

        driver.findElement(By.id("floatingEmail")).sendKeys(username,Key.RETURN);
        driver.findElement(By.id("floatingPassword")).sendKeys(password,Key.RETURN);

        driver.findElement(By.className("btn")).click();
        console.log('Logged in.')

        driver.wait(until.elementLocated(By.id("sign_out")), 10000).click();

        let title = driver.wait(until.elementLocated(By.className("display-1")), 10000).getText();

        console.assert(title === "Login");
        console.log('Logged in.')

        driver.quit();
    }
    catch(err) {
        handleFailure(err, driver);
    }
}

function handleFailure(err, driver) {
    console.error('Something went wrong!\n', err.stack, '\n');
    driver.quit();
}

loginAsAdmin();

// loginAsEmployee();

// logout();