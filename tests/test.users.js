const { By, Key, Builder, until } = require("selenium-webdriver");
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

    describe("S2.2 - Admin wants to create a new user", () => {
        let driver;
        let url = "http://localhost:3000";

        beforeEach(() => {
            driver = new Builder().forBrowser("chrome").build();
            driver.get(url);
        });

        it("S2.2.1 - Successfully create a new user", async () => {
            await login(driver);

            await driver.findElement(By.linkText("Users")).click();

            await driver.findElement(By.xpath("/html/body/div/div/div/div/div[1]/div/div/table/thead/tr/th[5]/div/button")).click();

            let form = await driver.findElement(By.xpath("/html/body/div/div/div/div/div[2]"));
            assert.equal(await form.getAttribute("class"), "container-form-enabled-form");

            let email = "mathieu@benoit-cote.com";
            let password = "CoolCool123";
            let role = "admin";

            await driver.findElement(By.id("floatingEmail")).sendKeys(email, Key.RETURN);
            await driver.findElement(By.id("floatingPassword1")).sendKeys(password, Key.RETURN);
            await driver.findElement(By.id("floatingPassword2")).sendKeys(password, Key.RETURN);
            await driver.findElement(By.id("floatingModifyRole")).sendKeys(role);

            
            let submitButton = await driver.findElement(By.xpath("/html/body/div/div/div/div/div[2]/div/form/div[5]/button[1]"));
            await driver.wait(until.elementIsEnabled(submitButton), 2000);
            submitButton.click();

            let goBackButton = await driver.findElement(By.xpath("/html/body/div/div/div/div/div[2]/div/form/div[5]/button[2]"));
            assert.equal(await goBackButton.getAttribute("class"), "btn btn-light py-2 px-5 my-1 shadow-sm border btn btn-primary");

            submitButton.click();
            submitButton.click();
            await driver.sleep(2000);
            assert.equal(await form.getAttribute("class"), "d-none");

            let users = await driver.findElements(By.css("tr"));
            assert.equal(users.length-1, 3);
        });

        it("S2.2.2 - Shows form input validation errors", async () => {
            await login(driver);

            await driver.findElement(By.linkText("Users")).click();

            await driver.findElement(By.xpath("/html/body/div/div/div/div/div[1]/div/div/table/thead/tr/th[5]/div/button")).click();

            let form = await driver.findElement(By.xpath("/html/body/div/div/div/div/div[2]"));
            assert.equal(await form.getAttribute("class"), "container-form-enabled-form");

            let email = "mathieu@benoit-cote.co";
            let password = "CoolCool";
            let role = "admin";

            let emptyError = "This field cannot be empty!";
            let invalidEmailError = "Invalid email. Must end with 'benoit-cote.com'.";
            let passMatchError = "Passwords must match!";
            let passStrengthError = "Password must be at least 8 characters, contain 1 upper-case and 1 lower-case letter, and contain a number.";

            let submitButton = await driver.findElement(By.xpath("/html/body/div/div/div/div/div[2]/div/form/div[5]/button[1]"));
            await driver.wait(until.elementIsEnabled(submitButton), 2000);
            submitButton.click();
            submitButton.click();

            let errors = await driver.findElements(By.className("invalid-feedback"));
            assert.equal(errors.length, 4);
            assert.equal(await errors[0].getText(), emptyError);
            assert.equal(await errors[1].getText(), emptyError);
            assert.equal(await errors[2].getText(), emptyError);

            let emailEntry = await driver.findElement(By.id("floatingEmail")).sendKeys(email, Key.RETURN);
            let p1Entry = await driver.findElement(By.id("floatingPassword1"));
            let p2Entry = await driver.findElement(By.id("floatingPassword2"));
            let roleEntry = await driver.findElement(By.id("floatingModifyRole")).sendKeys(role);
            p1Entry.sendKeys(password, Key.RETURN);
            p2Entry.sendKeys(password+"1", Key.RETURN);
            
            submitButton.click();
            submitButton.click();

            errors = await driver.findElements(By.className("invalid-feedback"));
            assert.equal(await errors[0].getText(), invalidEmailError);
            assert.equal(await errors[1].getText(), passMatchError);
            assert.equal(await errors[2].getText(), passMatchError);

            await p1Entry.clear();
            await p2Entry.clear();
            await driver.sleep(3000);

            p1Entry.sendKeys(password);
            await driver.sleep(3000);
            p2Entry.sendKeys(password);
            await driver.sleep(3000);

            submitButton.click();

            await driver.sleep(3000);

            errors = await driver.findElements(By.className("invalid-feedback"));
            assert.equal(await errors[0].getText(), invalidEmailError);
            assert.equal(await errors[1].getText(), passStrengthError);
            assert.equal(await errors[2].getText(), "");

        });

        it("S2.2.3 - Shows validation errors from backend", async () => {
            await login(driver);

            await driver.findElement(By.linkText("Users")).click();

            await driver.findElement(By.xpath("/html/body/div/div/div/div/div[1]/div/div/table/thead/tr/th[5]/div/button")).click();

            let form = await driver.findElement(By.xpath("/html/body/div/div/div/div/div[2]"));
            assert.equal(await form.getAttribute("class"), "container-form-enabled-form");

            let email = "mathieu@benoit-cote.com";
            let password = "CoolCool1";
            let role = "admin";

            let existsError = "User already exists.";

            let emailEntry = await driver.findElement(By.id("floatingEmail")).sendKeys(email, Key.RETURN);
            let p1Entry = await driver.findElement(By.id("floatingPassword1"));
            let p2Entry = await driver.findElement(By.id("floatingPassword2"));
            let roleEntry = await driver.findElement(By.id("floatingModifyRole")).sendKeys(role);
            p1Entry.sendKeys(password, Key.RETURN);
            p2Entry.sendKeys(password, Key.RETURN);
            
            let submitButton = await driver.findElement(By.xpath("/html/body/div/div/div/div/div[2]/div/form/div[5]/button[1]"));
            await driver.wait(until.elementIsEnabled(submitButton), 2000);
            submitButton.click();

            let goBackButton = await driver.findElement(By.xpath("/html/body/div/div/div/div/div[2]/div/form/div[5]/button[2]"));
            assert.equal(await goBackButton.getAttribute("class"), "btn btn-light py-2 px-5 my-1 shadow-sm border btn btn-primary");

            submitButton.click();

            await driver.sleep(3000);
            assert.equal(await goBackButton.getAttribute("class"), "d-none btn btn-primary");

            let errorAlert = await driver.findElement(By.xpath("/html/body/div/div/div/div/div[2]/div/form/div[1]"));
            assert.equal(await errorAlert.getText(), existsError);


        });

        afterEach(async () => {
            await driver.quit();
        });
    });
});