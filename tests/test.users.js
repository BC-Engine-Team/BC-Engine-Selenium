const { By, Builder, until } = require("selenium-webdriver");
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

        it("S2.1.3- Successfully deleted a user as an admin", async() => {

            await login(driver, "admin");

            await driver.findElement(By.linkText("Users")).click();
        
            let buttonDelete = await driver.findElements(By.className("btnDelete btn-delete"));
            
            await driver.sleep(3000);

            buttonDelete[0].click();

            await driver.sleep(3000);

            let confirmDelete = await driver.findElement(By.className("deleteUserButton"));

            confirmDelete.click();

            await driver.sleep(4000);
        });


        it("S2.1.4- Refused to delete a user as an admin", async() => {

            await login(driver, "admin");

            await driver.findElement(By.linkText("Users")).click();
        
            let buttonDelete = await driver.findElements(By.className("btnDelete btn-delete"));
            
            await driver.sleep(3000);

            buttonDelete[0].click();

            await driver.sleep(3000);

            let confirmRefuse = await driver.findElement(By.className("cancelDeleteUserButton"));

            confirmRefuse.click();

            await driver.sleep(4000);
        });


        afterEach(async () => {
            await driver.quit()
        });
    });
});