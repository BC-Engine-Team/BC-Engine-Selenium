const { By, Key, Builder, until, JavascriptExecutor } = require("selenium-webdriver");
require("chromedriver");
const assert = require("assert");
const { describe, beforeEach, afterEach, it } = require("mocha");
const { login } = require('./components/login');

describe("S4 - Reports", () => {

    describe("S4.1 - User wants to see their chart reports", () => {
        let driver;
        let url = "http://locahost:3000";

        beforeEach(() => {
            driver = new Builder().forBrowser("chrome").build();
            driver.get(url);
        });

        it("S4.1.1 - Successfully show all the admin's chart reports", async () => {

        });

        it("S4.1.1 - Successfully show all the employee's chart reports", async () => {

        });
    });
});