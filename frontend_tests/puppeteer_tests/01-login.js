const assert = require("assert");
const common = require('../puppeteer_lib/common');
const test_credentials = require('../../var/casper/test_credentials.js').test_credentials;
const realm_url = "http://zulip.zulipdev.com:9981/";

async function log_in(page, credentials) {
    console.log("Logging in");
    assert.equal(realm_url + 'login/', page.url());
    await page.type('#id_username', credentials.username);
    await page.type('#id_password', credentials.password);
    await page.$eval('#login_form', form => form.submit());
}

async function log_out(page) {
    await page.goto(realm_url);
    const menu_selector = '#settings-dropdown';
    const logout_selector = 'a[href="#logout"]';
    await page.waitForSelector(menu_selector, {visible: true});
    await page.click(menu_selector);
    await page.waitForSelector(logout_selector);
    await page.click(logout_selector);
    assert(page.url().includes('accounts/login/'));
}

async function run() {
    const page = await common.get_page(realm_url + 'login/');
    try {
        await log_in(page, test_credentials.default_user);
        await log_out(page);
    } catch (e) {
        console.log(e);
        process.exit(1);
    } finally {
        common.browser.close();
    }
}
run();
