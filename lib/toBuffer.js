'use strict'

const numbers = process.versions.node.split('.')
/** Buffer.from(string) is available for node >= 5.1 */
let useBufferFrom = false

if (numbers[0] >= 6) {
    useBufferFrom = true
}

if (numbers[0] == 5) {
    if (numbers[1] >= 1) {
        useBufferFrom = true
    }
}

module.exports = function (string) {

    if (useBufferFrom) {
        return Buffer.from(string)
    } else {
        return new Buffer(string)
    }
}