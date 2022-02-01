const { By, Key, Builder, until, JavascriptExecutor } = require("selenium-webdriver");
require("chromedriver");
const assert = require("assert");
const { describe, beforeEach, afterEach, it } = require("mocha");
const { login } = require('./components/login');
const { DriverService } = require("selenium-webdriver/remote");

describe("S4 - Reports", () => {

    describe("S4.1 - User wants to see their chart reports", () => {
        let driver;
        let url = "http://localhost:3000";

        beforeEach(async () => {
            driver = new Builder().forBrowser("chrome").build();
            driver.get(url);
            await driver.sleep(1000);
        });

        it("S4.1.1 - Successfully show all the admin's chart reports", async () => {
            await login(driver);

            let date = new Date(2019, 11, 1).toISOString().split("T")[0];
            let expectedNumberOfChartReports = 2;
            let expectedNumberOfValues = 16;
            let expectedChartReports = [
                "CR1", "France Cote", "Corr", "Canada", "All", "Receivable", date, date, "",
                "CR2", "All, France Cote", "Direct", "All", "60-90", "Receivable", date, date
            ];

            await driver.findElement(By.linkText("Reports")).click();

            let chartReportTable = await driver.findElement(By.id("chartReportsTable"));
            await driver.sleep(2000)
            let rows = await chartReportTable.findElements(By.css("tr"));

            assert.equal(rows.length - 1, expectedNumberOfChartReports);

            await driver.sleep(2000)

            let values = await chartReportTable.findElements(By.css("td"));
            assert.equal(values.length - 2, expectedNumberOfValues);

            for (let i = 0; i < values.length; i++) {
                if (i === 8 || i === 17) continue;
                let value = await values[i].getAttribute("innerText");
                assert.equal(value, expectedChartReports[i])
            }
        });

        it("S4.1.2 - Successfully show all the employee's chart reports", async () => {
            await login(driver, "employee");

            let date = new Date(2019, 11, 1).toISOString().split("T")[0];
            let expectedNumberOfChartReports = 1;
            let expectedNumberOfValues = 8;
            let expectedChartReports = [
                "CR3", "France Cote", "Any", "All", "<30", "Payable", date, date
            ];

            await driver.findElement(By.linkText("Reports")).click();

            let chartReportTable = await driver.findElement(By.id("chartReportsTable"));
            await driver.sleep(2000)
            let rows = await chartReportTable.findElements(By.css("tr"));

            assert.equal(rows.length - 1, expectedNumberOfChartReports);

            await driver.sleep(2000)

            let values = await chartReportTable.findElements(By.css("td"));
            assert.equal(values.length - 1, expectedNumberOfValues);

            for (let i = 0; i < values.length; i++) {
                if (i === 8) continue;
                let value = await values[i].getAttribute("innerText");
                assert.equal(value, expectedChartReports[i])
            }
        });

        afterEach(async () => {
            await driver.quit();
        });
    });
});