//set up lib
const express = require('express') // khoi chay web app express js
const router = express.Router() // lien ket router
const { User } = require('../model/User')
const { Utils } = require('../utils/utils')
const userRepository = require('../repository/UserRepository')
const path = require("path")
const multer = require('multer') // khoi tao thu vien phan giai form data cua html
const fs = require('fs') // lien ket toi thu vien xu ly file cua he thong (file system)

const upload = multer().array()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let dir = `${path.dirname(__dirname)}/database/images`
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
        }
        cb(null, dir)

    },
    filename: (req, file, cb) => {
        cb(null, `${new Date().getTime()}${path.extname(file.originalname)}`)
    }
})

const type = multer({ storage: storage }).single('avatar')

router.get('/login', (req, res) => {
    const query = req.query
    userRepository.login(query.username, query.password, query.type).then((user) => {
        res.json(user)
    }).catch((err) => {
        res.sendStatus(err)
    })
})

router.put('/addtoken', upload, (req, res) => {
    const body = req.body
    userRepository.addtoken(
        body.uid,
        body.username,
        body.password,
        body.type
    ).then((user) => {
        res.json(user)
    }).catch((err) => {
        res.sendStatus(err)
    })
})

router.post('/register', type, (req, res) => {
    const body = req.body
    userRepository.registration(
        body.username,
        body.password,
        body.type,
        (req.file) ? req.file.filename : undefined,
        body.fname,
        body.lname,
        body.birthDay
    ).then((user) => {
        res.json(user)
    }).catch((err) => {
        res.sendStatus(err)
    })
})

router.put('/editprofile', type, (req, res) => {
    const body = req.body
    userRepository.editProfile(
        body.uid,
        (body.avatar) ? body.avatar : (req.file) ? req.file.filename : undefined,
        (body.avatar!= null || body.avatar != undefined) && (req.file != null || req.file != undefined),
        body.fname,
        body.lname,
        body.birthDay
    ).then((user) => {
        res.json(user)
    }).catch((err) => {
        res.sendStatus(err)
    })
})

router.put('/changepassword', upload, (req, res) => {
    const body = req.body
    userRepository.changePassword(
        body.username,
        body.old_password,
        body.new_password
    ).then((user) => {
        res.json(user)
    }).catch((err) => {
        res.sendStatus(err)
    })
})

router.put('/forgotpassword', upload, (req, res) => {
    const body = req.body
    userRepository.forgotPassword(body.username)
        .then((user) => {
            res.json(200)
        }).catch((err) => {
            res.sendStatus(404)
        })
})

module.exports = router //xuat router ra cho server