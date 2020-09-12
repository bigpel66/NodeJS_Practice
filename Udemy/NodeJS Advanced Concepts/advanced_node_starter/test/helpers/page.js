const puppeteer = require('puppeteer');
const userFactory = require('../factories/userFactory');
const sessionFactory = require('../factories/sessionFactory');

class CustomPage {
    static async build() {
        const browser = await puppeteer.launch({
            headless: false,
        });

        const page = await browser.newPage();

        const customPage = new CustomPage(page, browser);

        return new Proxy(customPage, {
            get: function (target, property) {
                return target[property] || page[property] || browser[property];
            },
        });
    }

    constructor(page, browser) {
        this.page = page;
        this.browser = browser;
    }

    async login() {
        const user = await userFactory();

        const { session, sig } = sessionFactory(user);

        await this.page.setCookie({ name: 'session', value: session });
        await this.page.setCookie({ name: 'session.sig', value: sig });

        await this.page.goto('localhost:3000');
    }
}

module.exports = CustomPage;
