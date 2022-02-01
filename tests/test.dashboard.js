const { By, Key, Builder, until } = require("selenium-webdriver");
require("chromedriver");
const assert = require("assert");
const { describe, beforeEach, afterEach, it } = require("mocha");
const { login } = require('./components/login');
const { Eyes, ClassicRunner } = require('@applitools/eyes-selenium');

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

        it("S3.1.1 - Successfully shows default data on Chart", async () => {
            await eyes.open(driver, "B&C Engine", "Check Dynamic Default Overview Chart Official");
            driver.get(url);
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

        it("S3.1.2 - Successfully show data based on valid time frame selection", async () => {
            await eyes.open(driver, "B&C Engine", "Check Overview Chart 2016-01 -> 2017-08");
            driver.get(url);
            await driver.sleep(1000);
            await login(driver);


            let newStartYear = 2016;
            let newStartMonth = "January";
            let newEndYear = 2017;
            let newEndMonth = "August";

            let chartCanvas = await driver.findElement(By.id("chart"));

            await driver.sleep(3000);

            await driver.findElement(By.id("startYearSelect")).sendKeys(newStartYear);
            await driver.findElement(By.id("startMonthSelect")).sendKeys(newStartMonth);
            await driver.findElement(By.id("endYearSelect")).sendKeys(newEndYear);
            await driver.sleep(2000)
            await driver.findElement(By.id("endMonthSelect")).sendKeys(newEndMonth, Key.RETURN);
            let loadChartButton = await driver.findElement(By.id("loadChartButton"));

            loadChartButton.click();

            await driver.sleep(3000)

            // verify that the chart displays the right values
            await eyes.check("Chart Canvas", chartCanvas);
            await eyes.closeAsync();
        });

        it("S3.1.3 - Successfully show input validation for End Year Selection", async () => {
            driver.get(url);
            await driver.sleep(1000);
            await login(driver);

            let newEndYear = 2018;
            let endYearExceedError = "End Year cannot be before Start Year.";

            await driver.findElement(By.id("endYearSelect")).sendKeys(newEndYear);
            let loadChartButton = await driver.findElement(By.id("loadChartButton"));

            loadChartButton.click();

            let errors = await driver.findElements(By.className("invalid-feedback"));
            assert.equal(await errors[2].isDisplayed(), true);
            assert.equal(await errors[2].getText(), endYearExceedError);
        });

        it("S3.1.4 - Successfully show input validation for End Month Selection", async () => {
            driver.get(url);
            await driver.sleep(1000);
            await login(driver);

            let monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "November", "December"];
            let currentDate = new Date();
            let startYear = await driver.findElement(By.id("startYearSelect")).getAttribute("value");

            let newEndYear = startYear;
            let newStartMonth = "July";
            let newEndMonth = "January";
            let endMonthExceedError = "End Month cannot be before Start Month.";
            let endMonthExceedCurrentError = "End Month cannot exceed current month.";

            await driver.findElement(By.id("endYearSelect")).sendKeys(newEndYear);
            await driver.findElement(By.id("endMonthSelect")).sendKeys(newEndMonth);
            await driver.findElement(By.id("startMonthSelect")).sendKeys(newStartMonth);

            let loadChartButton = await driver.findElement(By.id("loadChartButton"));

            loadChartButton.click();

            let errors = await driver.findElements(By.className("invalid-feedback"));

            assert.equal(await errors[3].isDisplayed(), true);
            assert.equal(await errors[3].getText(), endMonthExceedError);

            newEndYear = currentDate.getFullYear();
            newEndMonth = currentDate.getMonth() + 1;

            await driver.findElement(By.id("endYearSelect")).sendKeys(newEndYear);
            await driver.findElement(By.id("endMonthSelect")).sendKeys(monthList[newEndMonth]);

            loadChartButton.click();

            assert.equal(await errors[3].isDisplayed(), true);
            assert.equal(await errors[3].getText(), endMonthExceedCurrentError);
        });

        it("S3.1.5 - Successfully show input validation for Start Month Selection", async () => {
            driver.get(url);
            await driver.sleep(1000);
            await login(driver);

            let monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "November", "December"];
            let currentDate = new Date();

            let newStartYear = currentDate.getFullYear();
            let newStartMonth = currentDate.getMonth() + 1;
            let startMonthExceedCurrentMonth = "Start Month cannot exceed current month.";

            await driver.findElement(By.id("startYearSelect")).sendKeys(newStartYear);
            await driver.findElement(By.id("startMonthSelect")).sendKeys(monthList[newStartMonth]);
            let loadChartButton = await driver.findElement(By.id("loadChartButton"));

            loadChartButton.click();

            await driver.sleep(3000)

            let errors = await driver.findElements(By.className("invalid-feedback"));
            assert.equal(await errors[1].isDisplayed(), true);
            assert.equal(await errors[1].getText(), startMonthExceedCurrentMonth);
        });

        afterEach(async () => {
            await driver.quit();
            await eyes.abortIfNotClosed();
        });
    });

    

    describe("S3.2 - User logs in and sees Dashboard Table", () => {
        let driver;
        let url = "http://localhost:3000";

        beforeEach(() => {
            driver = new Builder().forBrowser("chrome").build();
            driver.get(url);
        });

        it("S3.2.1 - Successfully shows data on Table", async () => {
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


            await driver.sleep(4000);

            //display the correct data on each columns
            let clientName = await driver.findElement(By.xpath('//*[@id="clientName"]')).getText(); 
            let clientCountry = await driver.findElement(By.xpath('//*[@id="clientCountry"]')).getText(); 
            let clientAverage = await driver.findElement(By.xpath('//*[@id="clientAverageCollectionDays"]')).getText(); 
            let clientAmountOwed = await driver.findElement(By.xpath('//*[@id="clientAmountOwed"]')).getText(); 
            let clientAmountDue = await driver.findElement(By.xpath('//*[@id="clientAmountDue"]')).getText(); 
            let clientGrading = await driver.findElement(By.xpath('//*[@id="clientGrading"]')).getText();
            let clientStatus = await driver.findElement(By.xpath('//*[@id="clientStatus"]')).getText(); 


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
        });
    });
});