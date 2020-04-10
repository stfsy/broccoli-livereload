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
    before(() => {
        return puppeteer.launch({ headless: true }).then((b) => {
            browser = b
            return browser.newPage()
        }).then((p) => {
            page = p
        })
    })
    after(() => {
        fs.writeFileSync('test/fixtures/test.html', fs.readFileSync('test/fixtures/index-hi.html'))
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
            })
            .then(() => {
                fs.writeFileSync('test/fixtures/app/test.html', fs.readFileSync('test/fixtures/index-hello.html'));
            })
            .then(() => {
                let count = 0
                const selectHeadlineAndAssert = () => {
                    return page.evaluate(() => {
                        return document.querySelector("h1").textContent;
                    }).then((text) => {
                        expect(text).to.equal('Hello!')
                        console.log('Found Hello in', text)
                    }).catch((error) => {
                        console.log('Received error', error)
                        if (count++ < 10) {
                            console.log('Will retry')
                            return new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    selectHeadlineAndAssert().then(resolve).catch(reject)
                                }, 3000)
                            })
                        } else {
                            console.log('I\'m out')
                            return Promise.reject(error)
                        }
                    })
                }

                return selectHeadlineAndAssert()

            })
    })
})