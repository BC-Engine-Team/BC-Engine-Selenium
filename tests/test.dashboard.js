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

    

    describe("S3.2 - User logs in and sees Dashboard Table", () => {
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

        it("S3.2.1 - Successfully shows data on Table", async () => {
            await eyes.open(driver, "B&C Engine", "check default overview table");
            await driver.get(url);
            await login(driver);

            // verify that the table display
            let clientTable = await driver.findElement(By.id("table"));

            await driver.sleep(3000);

            assert(clientTable.isDisplayed());


            let name = "Bluberi Recherche et Développement inc."
            let country = "Canada"
            let average = "23"
            let amountOwed = "55645"
            let amountDue = "66643"
            let grading = "N/A"
            let status = "Active"


            //display the correct data on each columns
            let clientName = await driver.findElement(By.xpath("/table/tbody/tr[0]/td[0]")).getText(); 
            let clientCountry = await driver.findElement(By.xpath("/table/tbody/tr[0]/td[1]")).getText(); 
            let clientAverage = await driver.findElement(By.xpath("/table/tbody/tr[0]/td[2]")).getText(); 
            let clientAmountOwed = await driver.findElement(By.xpath("/table/tbody/tr[0]/td[3]")).getText(); 
            let clientAmountDue = await driver.findElement(By.xpath("/table/tbody/tr[0]/td[4]")).getText(); 
            let clientGrading = await driver.findElement(By.xpath("/table/tbody/tr[0]/td[5]")).getText();
            let clientStatus = await driver.findElement(By.xpath("/table/tbody/tr[0]/td[6]")).getText(); 


            assert.equal(clientName, name);
            assert.equal(clientCountry, country);
            assert.equal(clientAverage, average);
            assert.equal(amountOwed, clientAmountOwed);
            assert.equal(amountDue, clientAmountDue);
            assert.equal(grading, clientGrading);
            assert.equal(status, clientStatus);
        });

        afterEach(async () => {
            await driver.quit();
            await eyes.abortIfNotClosed();
        });
    });
});