const { By, Builder } = require("selenium-webdriver");
require("chromedriver");
const assert = require("assert");
const { describe, beforeEach, afterEach, it } = require("mocha");
const { login } = require('./components/login');


describe("S2 - Users", () => {

    // Tests the different roles available
    describe("S2.1 - User wants to see all users", () => {
        let driver;
        let url = "http://localhost:3000";

        beforeEach(() => {
            driver = new Builder().forBrowser("chrome").build();
            driver.get(url);
        });

        it("S2.1.1 - Successfully showed all users as admin user", async () => {

            await login(driver);

            await driver.findElement(By.linkText("Users")).click();

            let table = await driver.findElement(By.className("table"));

            assert(table.isDisplayed());

        });

        it("S2.1.2 - Successfully not showing all users as employee user", async () => {

            let present = true;

            await login(driver, "employee");

            try {
                await driver.findElement(By.linkText("Users"))
                present = true;

            } catch (NoSuchElementException) {
                present = false;
            }

            assert.equal(present, false);

        });

        afterEach(async () => {
            await driver.quit()
        });
    });
});