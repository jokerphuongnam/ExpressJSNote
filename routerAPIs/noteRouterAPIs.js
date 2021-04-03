//set up lib
const express = require('express') // khoi chay web app express js
const router = express.Router() // lien ket router
const noteRepository = require('../repository/NoteRepository') // liên kết repository
const { Note } = require('../model/Note')
const { Utils } = require('../utils/utils')
const path = require("path")
const multer = require('multer') // khoi tao thu vien phan giai form data cua html
const fs = require('fs')
const TypeMedia = {
    images: "images",
    sounds: "sounds"
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let dir = `${path.dirname(__dirname)}/database/`
        if (file.fieldname === TypeMedia.images) {
            dir = path.join(dir, TypeMedia.images)
        } else if (file.fieldname === TypeMedia.sounds) {
            dir = path.join(dir, TypeMedia.sounds)
        }
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
        }
        cb(null, dir)

    },
    filename: (req, file, cb) => {
        cb(null, `${new Date().getTime()}${path.extname(file.originalname)}`)
    }
})

const types = multer({ storage: storage }).fields([{
    name: TypeMedia.images
}, {
    name: TypeMedia.sounds
}])

router.post('/insert', types, (req, res) => {
    // chuan bi data
    res.setHeader('Content-Type', 'application/json')
    const body = req.body
    noteRepository.insertNote(body.uid, new Note(
        Number(new Date().getTime()),
        body.title,
        Utils.parseBoolean(body.isFavorite),
        body.detail,
        Utils.parseArray(body.tags),
        Utils.tasks(body.tasks),
        noteRepository.saveImages(req.files.images),
        noteRepository.saveSounds(req.files.sounds),
        Utils.parseArray(body.noticeTimes)
    )).then(note => {
        res.json(note)
        noteRepository.incNid()
    }).catch(errMsg => {
        res.status(500).json(errMsg)
    })
})

router.put('/update', types, (req, res) => {
    const body = req.body
    res.setHeader('Content-Type', 'application/json')
    noteRepository.updateNote(body.uid, new Note(
        Number(body.nid),
        body.title,
        Utils.parseBoolean(body.isFavorite),
        body.detail,
        Utils.parseArray(body.tags),
        Utils.tasks(body.tasks),
        noteRepository.saveImages(req.files.images, req.body.images),
        noteRepository.saveSounds(req.files.sounds, req.body.sounds),
        Utils.parseArray(body.noticeTimes)
    )).then(note => {
        res.json(note)
    }).catch(errMsg => {
        res.status(500).json(errMsg)
    })
})

router.delete('/delete/:uid/:nid', (req, res) => {
    const uid = req.params.uid
    const nid = req.params.nid
    console.log(req.body)
    res.setHeader('Content-Type', 'application/json')
    noteRepository.deleteNote(Number(uid), Number(nid)).then(note => {
        res.json(note)
    }).catch(errMsg => {
        res.status(500).json(errMsg)
    })
})

router.get('/notes', (req, res) => {
    const query = req.query
    noteRepository.notes(query.uid, query.start, query.amount).then(notes => {
        res.json(notes)
    }).catch(errMsg => {
        res.sendStatus(404)
    })
})

module.exports = router // xuat router ra cho server