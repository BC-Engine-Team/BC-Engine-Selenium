const { By, until } = require("selenium-webdriver");
const assert = require("assert");

const logout = async (driver) => {

    await driver.wait(until.elementLocated(By.id("sign_out")), 10000).click();

    let url = await driver.wait(until.urlContains("login"));

    assert(url);
    console.log('Logged out.')

}

module.exports = { logout }