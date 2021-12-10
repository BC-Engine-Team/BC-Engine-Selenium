const { By, Key, Builder, until } = require("selenium-webdriver");
require("chromedriver");
const assert = require("assert");
const { describe, beforeEach, afterEach } = require("mocha");
const { elementIsVisible, elementLocated } = require("selenium-webdriver/lib/until");
const should = require('chai').should();

describe("Login as specific user", function() {
    let driver;

    beforeEach(function() {
        driver = new Builder().forBrowser("chrome").build();
        driver.get("http://localhost:3000");
    });

        it("Successfully loged in as admin", function () {

            username = "first@benoit-cote.com";
            password = "verySecurePassword";

            driver.wait(until.urlContains("login"));

            driver.findElement(By.id("floatingEmail")).sendKeys(username, Key.RETURN);
            driver.findElement(By.id("floatingPassword")).sendKeys(password, Key.RETURN);

            driver.findElement(By.className("btn")).click();

            driver.wait(until.urlContains("dashboard"));

            let navElements = driver.findElement(By.className("px-2 nav-link"));

            assert.equal(navElements.length, 4)
            console.log('Logged in as admin.');

            driver.wait(until.elementLocated(By.id("sign_out")), 10000).click();

            let title = driver.findElement(By.className("display-1 font-weight-bold text-center mt-5")).getText();
            console.log(title);
        
            console.assert(title === "login");
            console.log('Logged out.')

            // let role = "admin";
    
            // login(driver, role);
            
            // logout(driver);
        });
        // it("Successfully loged in as employee", function () {

        //     username = "second@benoit-cote.com";
        //     password = "verySecurePassword";

        //     driver.findElement(By.id("floatingEmail")).sendKeys(username, Key.RETURN);
        //     driver.findElement(By.id("floatingPassword")).sendKeys(password, Key.RETURN);

        //     driver.findElement(By.className("btn")).click();

        //     let navElements = driver.wait(function() {
        //         return elementsLocated(By.className("px-2 nav-link"));
        //     }, 3000);
        //     // let navElements = driver.wait(until.elementsLocated(By.className("px-2 nav-link")), 10000);

        //     assert.equal(navElements.length, 2)
        //     console.log('Logged in as employee.');

        //     driver.wait(function() {
        //         elementLocated(By.id("sign_out")).click();
        //     }, 3000);

        //     let title = driver.findElement(By.className("display-1 font-weight-bold text-center mt-5")).getText();
        //     console.log(title);
        
        //     console.assert(title === "login");
        //     console.log('Logged out.')

            // let role = "employee";
    
            // login(driver, role);

            // logout(driver);
        //});
    

    // describe("login as an employee", function() {
    //     it("Successfully loged out", function () {

    //         login(driver);
    
    //         logout(driver);
    //     });
    // })
    

    afterEach(function() {
        driver.quit().then(function() {
        })
    });
})

async function login(driver, role = "admin") {

    let username,
        password;

    if (role === "admin") {
        username = "first@benoit-cote.com";
        password = "verySecurePassword";
    }
    else if (role = "employee") { 
        username = "second@benoit-cote.com";
        password = "verySecurePassword";
    }

    await driver.findElement(By.id("floatingEmail")).sendKeys(username, Key.RETURN);
    await driver.findElement(By.id("floatingPassword")).sendKeys(password, Key.RETURN);

    await driver.findElement(By.className("btn")).click();

    let navElements = await driver.wait(until.elementsLocated(By.className("px-2 nav-link")), 10000);

    if (role === "admin") {
        assert.equal(navElements.length, 5)
        console.log('Logged in as admin.');
    }
    else if (role = "employee") {
        assert.equal(navElements.length, 2)
        console.log('Logged in as employee.');
    }
}

async function logout(driver) {

   await driver.wait(until.elementLocated(By.id("sign_out")), 10000).click();

    let title = await driver.findElement(By.className("display-1 font-weight-bold text-center mt-5")).getText();
    console.log(title);

    console.assert(title === "login");
    console.log('Logged out.')

}