const { By, Key, Builder, until, JavascriptExecutor } = require("selenium-webdriver");
require("chromedriver");
const assert = require("assert");
const { describe, beforeEach, afterEach, it } = require("mocha");
const { login } = require('./components/login');


describe("S2 - Users", () => {

    //Tests the different roles available
    describe("S2.1 - User wants to see all users", () => {
        let driver;
        let url = "http://localhost:3000";

        beforeEach(async () => {
            driver = new Builder().forBrowser("chrome").build();
            driver.get(url);
            await driver.sleep(1000);
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
            await driver.quit();
        });
    });

    describe("S2.2 - Admin wants to create a new user", () => {
        let driver;
        let url = "http://localhost:3000";

        beforeEach(async () => {
            driver = new Builder().forBrowser("chrome").build();
            driver.get(url);
            await driver.sleep(1000);
        });

        it("S2.2.1 - Successfully create a new user", async () => {
            await login(driver);

            await driver.findElement(By.linkText("Users")).click();

            await driver.findElement(By.xpath("/html/body/div/div/div/div/div[1]/div/div/table/thead/tr/th[5]/div/button")).click();

            let form = await driver.findElement(By.xpath("/html/body/div/div/div/div/div[2]"));
            assert.equal(await form.getAttribute("class"), "container-form-enabled-form");

            let email = "mathieu@benoit-cote.com";
            let password = "CoolCool123";
            let role = "employee";

            await driver.findElement(By.id("floatingEmail")).sendKeys(email, Key.RETURN);
            await driver.findElement(By.id("floatingPassword1")).sendKeys(password, Key.RETURN);
            await driver.findElement(By.id("floatingPassword2")).sendKeys(password, Key.RETURN);
            await driver.findElement(By.id("floatingModifyRole")).sendKeys(role);


            let submitButton = await driver.findElement(By.xpath("/html/body/div/div/div/div/div[2]/div/div/form/div[5]/button[1]"));
            await driver.wait(until.elementIsEnabled(submitButton), 2000);
            submitButton.click();
            submitButton.click();

            let goBackButton = await driver.findElement(By.xpath("/html/body/div/div/div/div/div[2]/div/div/form/div[5]/button[2]"));
            assert.equal(await goBackButton.getAttribute("class"), "btn btn-light py-2 px-5 my-1 shadow-sm border btn btn-primary");

            submitButton.click();
            submitButton.click();
            await driver.sleep(2000);
            assert.equal(await form.getAttribute("class"), "d-none");

            let users = await driver.findElements(By.css("tr"));
            assert.equal(users.length - 1, 3);
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

            let submitButton = await driver.findElement(By.xpath("/html/body/div/div/div/div/div[2]/div/div/form/div[5]/button[1]"));
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
            p2Entry.sendKeys(password + "a", Key.RETURN);

            submitButton.click();
            submitButton.click();

            errors = await driver.findElements(By.className("invalid-feedback"));
            assert.equal(await errors[0].getText(), invalidEmailError);
            assert.equal(await errors[1].getText(), passMatchError);
            assert.equal(await errors[2].getText(), passMatchError);

            p1Entry.sendKeys("a", Key.RETURN);

            submitButton.click();

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
            let notExistError = "Employee email doesn't exist.";

            let emailEntry = await driver.findElement(By.id("floatingEmail"));
            let p1Entry = await driver.findElement(By.id("floatingPassword1"));
            let p2Entry = await driver.findElement(By.id("floatingPassword2"));
            let roleEntry = await driver.findElement(By.id("floatingModifyRole")).sendKeys(role);
            emailEntry.sendKeys(email, Key.RETURN);
            p1Entry.sendKeys(password, Key.RETURN);
            p2Entry.sendKeys(password, Key.RETURN);

            await driver.sleep(2000)

            let submitButton = await driver.findElement(By.xpath("/html/body/div/div/div/div/div[2]/div/div/form/div[5]/button[1]"));
            await driver.wait(until.elementIsEnabled(submitButton), 2000);
            submitButton.click();

            let goBackButton = await driver.findElement(By.xpath("/html/body/div/div/div/div/div[2]/div/div/form/div[5]/button[2]"));
            assert.equal(await goBackButton.getAttribute("class"), "btn btn-light py-2 px-5 my-1 shadow-sm border btn btn-primary");

            submitButton.click();

            await driver.sleep(3000);
            assert.equal(await goBackButton.getAttribute("class"), "d-none btn btn-primary");

            let errorAlert = await driver.findElement(By.xpath("/html/body/div/div/div/div/div[2]/div/div/form/div[1]")).getText();
            assert.equal(errorAlert, existsError);

            submitButton.click();

            email = "cool@benoit-cote.com";

            emailEntry.sendKeys(email, Key.RETURN);
            await driver.sleep(2000);
            submitButton.click();
            await driver.sleep(2000);
            submitButton.click();
            await driver.sleep(2000);

            let errorAlert2 = await driver.findElement(By.xpath('//*[@id="alertUserForm"]')).getText();

            assert.equal(errorAlert2, notExistError);

        });

        afterEach(async () => {
            await driver.quit();
        });
    });

    describe("S2.3 - Admin wants to update an user", () => {
        let driver;
        let url = "http://localhost:3000";

        beforeEach(async () => {
            driver = new Builder().forBrowser("chrome").build();
            driver.get(url);
            await driver.sleep(1000);
        });

        it("S2.3.1 - Successfully updated an user", async () => {
            await login(driver);

            await driver.findElement(By.linkText("Users")).click();

            let table = await driver.findElement(By.className("table"));

            await driver.wait(until.elementIsVisible(table), 2000);

            await driver.sleep(2000);

            let currentRole = await driver.findElement(By.xpath("/html/body/div[1]/div/div/div/div[1]/div/div/table/tbody/tr[3]/td[4]"));
            //assert.equal(await currentRole.getText(), "employee");
            let expectedRole = '';
            if (await currentRole.getText() === 'employee')
                expectedRole = 'admin';
            else
                expectedRole = 'employee';

            let buttonEdit = await driver.findElements(By.className("btnEdit btn-edit"));
            buttonEdit[2].click();
            await driver.sleep(2000);

            let form = await driver.findElement(By.xpath("/html/body/div/div/div/div/div[2]"));
            assert.equal(await form.getAttribute("class"), "container-form-enabled-form");

            let password = "verySecurePassword1";

            await driver.findElement(By.id("floatingPassword1")).sendKeys(password);
            await driver.findElement(By.id("floatingPassword2")).sendKeys(password);
            await driver.sleep(2000)
            await driver.findElement(By.id("floatingModifyRole")).sendKeys(expectedRole);
            await driver.sleep(2000)

            let submitButton = await driver.findElement(By.xpath("/html/body/div/div/div/div/div[2]/div/div/form/div[5]/button[1]"));
            await driver.wait(until.elementIsEnabled(submitButton), 2000);
            await driver.sleep(2000)
            submitButton.click();
            await driver.sleep(2000)
            submitButton.click();
            await driver.sleep(2000)

            currentRole = await driver.findElement(By.xpath("/html/body/div[1]/div/div/div/div[1]/div/div/table/tbody/tr[3]/td[4]")).getText();
            assert.equal(currentRole, expectedRole);
        });

        it("S2.3.2 - Shows form input validation errors on update", async () => {
            await login(driver);

            await driver.findElement(By.linkText("Users")).click();

            await driver.findElement(By.xpath("/html/body/div/div/div/div/div[1]/div/div/table/thead/tr/th[5]/div/button")).click();

            let table = await driver.findElement(By.className("table"));

            await driver.wait(until.elementIsVisible(table), 2000);

            await driver.sleep(2000);

            let buttonEdit = await driver.findElements(By.className("btnEdit btn-edit"));
            buttonEdit[2].click();
            await driver.sleep(2000);

            let fakePassword = "CoolCool";
            let realPassword = "CoolCoola"

            let emptyError = "This field cannot be empty!";
            let passMatchError = "Passwords must match!";
            let passStrengthError = "Password must be at least 8 characters, contain 1 upper-case and 1 lower-case letter, and contain a number.";

            let submitButton = await driver.findElement(By.xpath("/html/body/div/div/div/div/div[2]/div/div/form/div[5]/button[1]"));
            await driver.wait(until.elementIsEnabled(submitButton), 2000);
            submitButton.click();
            submitButton.click();

            let errors = await driver.findElements(By.className("invalid-feedback"));
            assert.equal(errors.length - 1, 3);
            assert.equal(await errors[1].getText(), emptyError);
            assert.equal(await errors[2].getText(), emptyError);
            await driver.sleep(2000);

            await driver.findElement(By.id("floatingPassword1")).sendKeys(fakePassword);
            await driver.findElement(By.id("floatingPassword2")).sendKeys(realPassword);

            submitButton.click();
            await driver.sleep(2000);

            errors = await driver.findElements(By.className("invalid-feedback"));
            assert.equal(await errors[1].getText(), passMatchError);
            assert.equal(await errors[2].getText(), passMatchError);
            await driver.sleep(2000);

            await driver.findElement(By.id("floatingPassword1")).sendKeys("a");
            submitButton.click();

            errors = await driver.findElements(By.className("invalid-feedback"));
            assert.equal(await errors[1].getText(), passStrengthError);
            assert.equal(await errors[2].getText(), "");
            await driver.sleep(2000);
        });

        it("S2.3.3 - Successfully go back changing info if necessary and closing the edit panel", async () => {
            await login(driver);

            await driver.findElement(By.linkText("Users")).click();

            await driver.sleep(1000);

            let currentRole = await driver.findElement(By.xpath("/html/body/div/div/div/div/div[1]/div/div/table/tbody/tr[3]/td[4]"));
            let expectedRole = await currentRole.getText();

            let buttonEdit = await driver.findElements(By.className("btnEdit btn-edit"));
            buttonEdit[2].click();
            await driver.sleep(3000);

            let form = await driver.findElement(By.xpath("/html/body/div/div/div/div/div[2]"));
            assert.equal(await form.getAttribute("class"), "container-form-enabled-form");

            let password = "CoolCool123";

            await driver.findElement(By.id("floatingPassword1")).sendKeys(password);
            await driver.findElement(By.id("floatingPassword2")).sendKeys(password);
            await driver.findElement(By.id("floatingModifyRole")).sendKeys("admin");

            let submitButton = await driver.findElement(By.xpath("/html/body/div/div/div/div/div[2]/div/div/form/div[5]/button[1]"));
            await driver.wait(until.elementIsEnabled(submitButton), 2000);
            submitButton.click();
            await driver.sleep(3000);

            let goBackButton = await driver.findElement(By.xpath("/html/body/div/div/div/div/div[2]/div/div/form/div[5]/button[2]"));
            await driver.wait(until.elementIsEnabled(goBackButton), 2000);
            goBackButton.click();
            await driver.sleep(3000);

            currentPasswordEntry = await driver.findElement(By.id("floatingPassword1")).getAttribute("value");
            assert.equal(currentPasswordEntry, "CoolCool123");

            await driver.findElement(By.className("btn-close position-absolute top-0 end-0 m-4")).click();

            currentRole = await driver.findElement(By.xpath("/html/body/div[1]/div/div/div/div[1]/div/div/table/tbody/tr[3]/td[4]")).getText();
            assert.equal(currentRole, expectedRole);
            await driver.sleep(3000);
        });

        afterEach(async () => {
            await driver.quit();
        });

    });


    describe("S2.4 - Admin wants to delete a user", () => {
        let driver;
        let url = "http://localhost:3000";

        beforeEach(async () => {
            driver = new Builder().forBrowser("chrome").build();
            driver.get(url);
            await driver.sleep(1000);
        });

        it("S2.4.1- Successfully deleted a user as an admin", async () => {

            await login(driver, "admin");
            await driver.findElement(By.linkText("Users")).click();

            await driver.sleep(2000);

            let users = await driver.findElements(By.css("tr"));
            assert.equal(users.length - 1, 3);

            let buttonDelete = await driver.findElements(By.className("btnDelete btn-delete"));
            buttonDelete[2].click();
            await driver.sleep(2000);
            let confirmDelete = await driver.findElement(By.className("deleteUserButton"));
            confirmDelete.click();
            await driver.sleep(2000);

            users = await driver.findElements(By.css("tr"));
            assert.equal(users.length - 1, 2);
        });

        it("S2.4.2- Refused to delete a user as an admin", async () => {

            await login(driver, "admin");
            await driver.findElement(By.linkText("Users")).click();

            await driver.sleep(2000);

            let users = await driver.findElements(By.css("tr"));
            assert.equal(users.length - 1, 2);

            let buttonDelete = await driver.findElements(By.className("btnDelete btn-delete"));
            buttonDelete[0].click();
            await driver.sleep(2000);
            let confirmRefuse = await driver.findElement(By.className("cancelDeleteUserButton"));
            confirmRefuse.click();
            await driver.sleep(2000);


            users = await driver.findElements(By.css("tr"));
            assert.equal(users.length - 1, 2);
        });
        afterEach(async () => {
            await driver.quit();
        });
    });
});