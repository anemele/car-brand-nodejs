/**
 * Target: https://car-brand-names.com/car-logos-a-z/
 */

const fs = require('fs')
const path = require('path')
const axios = require('axios')
const cheerio = require('cheerio')
// customized module
const request = require('./request')
const config = require('./config');
const logger = require('./logger')

function mkdirSync(path) {
    if (!fs.existsSync(path)) {
        logger.info('mkdir', path)
        fs.mkdirSync(path)
    }
}

mkdirSync(config.savePath)


axios.get(config.startUrl).then(response => {
    /**
     * The root page request
     */
    cheerio.load(response.data)('a.brands--inner').toArray()
        // All car pages href
        .map(x => x.attribs.href)
        // A car page rref and its save path
        .map(href => [href, path.join(savePath, path.basename(href))])
        .forEach(args => {
            let [href, carLogoPath] = args
            mkdirSync(carLogoPath)

            axios.get(href).then(response => {
                cheerio.load(response.data)('div.left-cont a:has(img)').toArray()
                    .map(x => x.attribs.href)
                    .map(href => [href, path.join(carLogoPath, path.basename(href))])
                    // Exlude existing files
                    .filter((_, x) => !fs.existsSync(x))
                    .forEach((url, path) => {
                        request.getBytes(url, path);
                        logger.info('save', path)
                    })

            }).catch(err => { if (err) logger.error(err.message) })
        })
}).catch(err => { if (err) logger.error(err.message) })
