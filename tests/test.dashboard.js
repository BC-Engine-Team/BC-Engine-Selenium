const { By, Key, Builder, until } = require("selenium-webdriver");
require("chromedriver");
const assert = require("assert");
const { describe, beforeEach, afterEach, it } = require("mocha");
const { login } = require('./components/login');
const { Eyes, Target, ClassicRunner } = require('@applitools/eyes-selenium');

describe("S3 - Dashboard", () => {
    describe("S3.1 - User logs in and sees Dashboard Chart", () => {
        let driver, runner, eyes;
        let url = "http://localhost:3000";

        beforeEach(() => {
            // Initialize the Runner for your test.
            runner = new ClassicRunner();

            // Initialize the eyes SDK 
            eyes = new Eyes(runner);
            eyes.setApiKey("lJfCRLJ1k3w108xjmryokB102yHOMxfxZ197RsnV9x2bYyiA110");

            driver = new Builder().forBrowser("chrome").build();
        });

        it("S3.1.1 - Successfully shows data on Chart", async () => {
            await eyes.open(driver, "B&C Engine", "check default overview chart");
            await driver.get(url);
            await login(driver);

            // verify that the chart display
            let chartCanvas = await driver.findElement(By.id("chart"));

            await driver.sleep(3000);

            await eyes.check("Chart Canvas", chartCanvas);
            await eyes.closeAsync();

            // verify that the input box for chart report name works
            let chartNameInput = await driver.findElement(By.id("chartName"));
            await driver.wait(until.elementIsEnabled(chartNameInput), 2000);
            await chartNameInput.sendKeys("Chart Name", Key.TAB);
            assert.equal(await chartNameInput.getAttribute("value"), "Chart Name");
        });

        afterEach(async () => {
            await driver.quit();
            await eyes.abortIfNotClosed();
        });
    });
});