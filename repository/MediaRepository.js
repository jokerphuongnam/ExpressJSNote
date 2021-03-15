const fs = require('fs')
const path = require('path')

class DefaultNoteRepository{
    image(imageName) {
        const dir = `${path.dirname(__dirname)}/database/images/${imageName}`
        return new Promise(function (resolve, reject) {
            fs.readFile(dir, (err, img) => {
                if (err) {
                    console.log(err)
                    reject(404)
                } else {
                    resolve(dir)
                }
            })
        })
    }

    sound(soundName) {
        const dir = `${path.dirname(__dirname)}/database/sounds/${soundName}`
        return new Promise(function (resolve, reject) {
            fs.readFile(dir, (err, img) => {
                if (err) {
                    console.log(err)
                    reject(404)
                } else {
                    resolve(dir)
                }
            })
        })
    }
}

const repository = new DefaultNoteRepository()

module.exports = repository