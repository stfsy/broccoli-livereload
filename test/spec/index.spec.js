'use strict'

const puppeteer = require('puppeteer')

const expect = require('chai').expect
const fs = require('fs')

describe('BroccoliLivereload', () => {
    let browser = null
    let page = null
    before(() => {
        fs.writeFileSync('test/fixtures/app/test.html', fs.readFileSync('test/fixtures/index-hi.html'));
    })
    before(function () {
        this.timeout(10000);
        return puppeteer.launch().then((b) => {
            browser = b
            return browser.newPage()
        }).then((p) => {
            page = p
        })
    })
    after(() => {
        fs.writeFileSync('test/fixtures/test.html', fs.readFileSync('test/fixtures/index-hi.html'));
        return browser.close()
    })

    it('should notify the browser of updates', () => {
        return page.goto('http://localhost:4200/test.html')
            .then(() => {
                return page.evaluate(() => {
                    return document.querySelector("h1").textContent;
                })
            }).then((text) => {
                expect(text).to.equal('Hi!')
            }).then(() => {
                fs.writeFileSync('test/fixtures/app/test.html', fs.readFileSync('test/fixtures/index-hello.html'));
                return new Promise((resolve) => setInterval(resolve, 1000)) // wait because we debounce changes
            }).then(() => {
                return page.evaluate(() => {
                    return document.querySelector("h1").textContent;
                })
            }).then((text) => {
                expect(text).to.equal('Hello!')
            })
    })
})