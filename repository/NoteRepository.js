const Promise = require('promise') // thu vien promise
const fs = require('fs') // Thư viện sửa dụng file (file system)
const path = require('path')

// const db = admin.initializeApp({
//     credential: admin.credential.cert(firebaseServer),
//     databaseURL: "https://note-a0967.firebaseio.com"
// }).firestore().collection(dbName)

/*
class Repository{

    insert(note)

    update(note)

    delete(id)

    getNote(id)

    get notes()

}*/

function deleteImage(imageName) {
    imageName = path.parse(imageName).base
    console.log(imageName)
    fs.unlink(`${path.dirname(__dirname)}/database/images/${imageName}`, (err) => {
        console.log(err)
    })
}

function deleteSound(soundName) {
    soundName = path.parse(soundName).base
    fs.unlink(`${path.dirname(__dirname)}/database/sounds/${soundName}`, (err) => {
        console.log(err)
    })
}

class DefaultNoteRepository {
    insertNote(uid, note) {
        return new Promise(function (resolve, reject) {
            const root = `./database/notes/`
            const dir = `${root}${uid}.json`
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(root, { recursive: true })
                fs.writeFile(dir, JSON.stringify({}), (err)=>{

                })
            }
            fs.readFile(dir, (err, data) => {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                else {
                    const notes = JSON.parse(data)
                    notes[`${note.nid}`] = note
                    resolve(note)
                    fs.writeFile(dir, JSON.stringify(notes), err => {
                        reject(err)
                    })
                }
            })
        })
    }

    updateNote(uid, note) {
        return new Promise(function (resolve, reject) {
            const dir = `./database/notes/${uid}.json`
            fs.readFile(dir, (err, data) => {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                else {
                    const notes = JSON.parse(data)
                    const oldNote = notes[note.nid]
                    if (oldNote) {
                        if (oldNote.images) {
                            for (var i = 0; i < oldNote.images.length; i++) {
                                if (note.images.find(element => element == oldNote.images[i]) == undefined) {
                                    deleteImage(oldNote.images[i])
                                }
                            }
                        }
                        if (oldNote.sounds) {
                            for (var i = 0; i < oldNote.sounds.length; i++) {
                                if (note.sounds.find(element => element == oldNote.sounds[i]) == undefined) {
                                    deleteSound(oldNote.sounds[i])
                                }
                            }
                        }
                        notes[`${note.nid}`] = note
                        resolve(note)
                        fs.writeFile(dir, JSON.stringify(notes), err => {
                            reject(err)
                        })
                    } else {
                        resolve(404)
                    }
                }
            })
        })
    }

    deleteNote(uid, nid) {
        return new Promise(function (resolve, reject) {
            const link = `./database/notes/${uid}.json`
            fs.readFile(link, (err, data) => {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                else {
                    const notes = JSON.parse(data)
                    const note = notes[nid]
                    if (note) {
                        if (note.images) {
                            for (var i = 0; i < note.images.length; i++) {
                                deleteImage(note.images[i])
                            }
                        }
                        if (note.sounds) {
                            for (var i = 0; i < note.sounds.length; i++) {
                                deleteSound(note.sounds[i])
                            }
                        }
                        resolve(delete notes[nid])
                        fs.writeFile(link, JSON.stringify(notes), (err => {
                            reject(err)
                        }))
                    } else {
                        reject(404)
                    }
                }
            })
        })
    }

    notes(uid, start, amount) {
        return new Promise(function (resolve, reject) {
            fs.readFile(`./database/notes/${uid}.json`, (err, data) => {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                else {
                    if (data.length != 0) {
                        data = JSON.parse(data)
                        if (start || amount) {
                            start = (start) ? start : -1
                            amount = (amount) ? amount : data.length
                            var newData = {}
                            var count = 0
                            var key
                            for (key in data) {
                                if (count >= start && count < amount) {
                                    newData[key] = data[key]
                                }
                                count++
                            }
                            data = newData
                        }
                        resolve(data)
                    } else {
                        resolve({})
                    }
                }
            })
        })
    }

    saveImages(images, imagesLink) {
        const urlImages = imagesLink ? JSON.parse(imagesLink) : []
        for (var i = 0; i < images.length; i++) {
            urlImages.push(path.basename(images[i].filename))
        }
        return urlImages
    }

    saveSounds(sounds, soundsLink) {
        const urlSounds = soundsLink ? JSON.parse(soundsLink) : []
        for (var i = 0; i < sounds.length; i++) {
            urlSounds.push(path.basename(sounds[i].filename))
        }
        return urlSounds
    }
}

const repository = new DefaultNoteRepository()

module.exports = repository