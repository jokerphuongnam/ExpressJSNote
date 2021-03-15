//set up lib
const express = require('express') // khoi chay web app express js
const router = express.Router() // lien ket router
const noteRepository = require('../repository/MediaRepository.js') // liên kết repository

router.get('/image/:id', (req, res) => {
    const id = req.params.id
    noteRepository.image(id).then(path => {
        res.sendFile(path)
    }).catch(err => {
        res.sendStatus(404)
    })
})

router.get('/sound/:id', (req, res) => {
    const id = req.params.id
    noteRepository.sound(id).then(path => {
        res.sendFile(path)
    }).catch(err => {
        res.sendStatus(404)
    })
})

module.exports = router // xuat router ra cho 1