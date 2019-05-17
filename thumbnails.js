const sharp = require('sharp')
const util = require('util')
const fs = require('fs')
const path = require('path')

const readDir = util.promisify(fs.readdir)

const toThumbnail = async image => {
    return new Promise((res, rej) => {
        sharp(path.join(__dirname, 'public', 'images', image))
        .resize({ width: 200 })
        .toFile(path.join(__dirname, 'public', 'thumbnails', image))
    })
}

const toThumbnails = async () => {
    var files = await readDir(path.join(__dirname, 'public', 'images'))
    files.map(async n => await toThumbnail(n))
}

toThumbnails()



