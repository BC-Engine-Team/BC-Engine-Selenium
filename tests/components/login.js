const { By, until, Key } = require("selenium-webdriver");
const assert = require("assert");

const login = async (driver, role = "admin") => {

    let username,
        password;

    if (role === "admin") {
        username = "first@benoit-cote.com";
        password = "verySecurePassword1";
    }
    else if (role = "employee") {
        username = "second@benoit-cote.com";
        password = "verySecurePassword1";
    }

    await driver.findElement(By.id("floatingEmail")).sendKeys(username, Key.RETURN);
    await driver.findElement(By.id("floatingPassword")).sendKeys(password, Key.RETURN);

    await driver.findElement(By.id("loginButton")).click();
    let navElements = await driver.wait(until.elementsLocated(By.className("px-2 nav-link")), 3000);

    if (role === "admin") {
        assert.equal(navElements.length, 4)
        console.log('Logged in as admin.');
    }
    else if (role === "employee") {
        assert.equal(navElements.length, 2)
        console.log('Logged in as employee.');
    }
}
module.exports = { login }