'use strict'

const resolve = require('path').resolve
const expect = require('chai').expect

const Node = require('node-html-light').Node
const Injector = require(resolve('lib/injector'))

describe('Injector', () => {

    let injector = null

    beforeEach(() => {
        injector = new Injector(/index[-0-9a-z]*.html/, Node.fromString('<div id="test-div"></div>'))
    })

    describe('.matches', () => {
        it('index.html', () => {
            const matches = injector.matches('index.html')
            expect(matches).to.be.truthy
        })

        it('index-abc.html', () => {
            const matches = injector.matches('index-abc.html')
            expect(matches).to.be.truthy
        })

        it('index-a2b3c.html', () => {
            const matches = injector.matches('index-a2b3c.html')
            expect(matches).to.be.truthy
        })

        it('does no match', () => {
            const matches = injector.matches('file.html')
            expect(matches).to.be.falsy
        })
    })
})