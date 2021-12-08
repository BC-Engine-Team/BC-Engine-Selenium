const {By,Key,Builder, until} = require("selenium-webdriver");
require("chromedriver");

let driver = "";

async function loginAsAdmin() {

    try {
        driver = new Builder().forBrowser("chrome").setChromeOptions("disable-web-security").build();
        let username = "first@benoit-cote.com";
        let password = "verySecurePassword";

        await driver.get("http://localhost:3000");

        await driver.findElement(By.id("floatingEmail")).sendKeys(username,Key.RETURN);
        await driver.findElement(By.id("floatingPassword")).sendKeys(password,Key.RETURN);

        await driver.findElement(By.className("btn")).click();

        let navElements = await driver.wait(until.elementsLocated(By.className("px-2 nav-link")), 10000);

        console.assert(navElements.length === 4);

        await driver.quit();
    }
    catch(err) {
        handleFailure(err, driver);
    }
}

loginAsAdmin();

async function loginAsEmployee() {

    try {
        driver = new Builder().forBrowser("chrome").setChromeOptions("disable-web-security").build();

        let username = "second@benoit-cote.com";
        let password = "verySecurePassword";

        await driver.get("http://localhost:3000");

        await driver.findElement(By.id("floatingEmail")).sendKeys(username,Key.RETURN);
        await driver.findElement(By.id("floatingPassword")).sendKeys(password,Key.RETURN);

        await driver.findElement(By.className("btn")).click();

        let navElements = await driver.wait(until.elementsLocated(By.className("px-2 nav-link")), 10000);

        console.assert(navElements.length === 2);

        await driver.quit();
    }
    catch(err) {
        handleFailure(err, driver);
    }
}

loginAsEmployee();

async function logout() {
    try {
        driver = new Builder().forBrowser("chrome").setChromeOptions("disable-web-security").build();

        let username = "second@benoit-cote.com";
        let password = "verySecurePassword";

        await driver.get("http://localhost:3000");

        await driver.findElement(By.id("floatingEmail")).sendKeys(username,Key.RETURN);
        await driver.findElement(By.id("floatingPassword")).sendKeys(password,Key.RETURN);

        await driver.findElement(By.className("btn")).click();

        await driver.wait(until.elementsLocated(By.className("px-2 nav-link")), 10000);
  
        await driver.findElement(By.xpath("//*[@id='basic-navbar-nav']/div[2]/a")).click();

        let loginTitle = await driver.wait(until.elementLocated(By.className("display-1")), 10000);

        console.assert(loginTitle.getText === "Login");
    }
    catch(err) {
        handleFailure(err, driver);
    }
}

function handleFailure(err, driver) {
    console.error('Something went wrong!\n', err.stack, '\n');
    driver.quit();
}