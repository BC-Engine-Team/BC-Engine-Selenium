const { By, Key, Builder, until } = require("selenium-webdriver");
require("chromedriver");
const assert = require("assert");
const { describe, beforeEach, afterEach, it } = require("mocha");
const { login } = require('./components/login');

describe("S3 - Dashboard", () => {
    describe("S3.1 - User logs in and sees Dashboard Chart", () => {
        let driver;
        let url = "http://localhost:3000";

        beforeEach(() => {
            driver = new Builder().forBrowser("chrome").build();
            driver.get(url);
        });

        it("S3.1.1 - Successfully shows data on Chart", async () => {
            await login(driver);


        });
    });
});