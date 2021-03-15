'use_strict'

// khoi tao thu vien
const express = require('express')  // khoi tao express js web app
const bodyParser = require('body-parser')  // khoi tao thu vien phân giải json
const app = express()  // khoi chay web app express js

// khai bao thu muc chua resouce file  
app.use(express.static(__dirname + '/'))  // thu muc goc (root)

// su dung bo phan giai application/json
app.use(bodyParser.json())

// su dung bo phan giai application/xwww-
app.use(bodyParser.urlencoded({ extended: true }))
//form-urlencoded

// su dung bo phan giai multipart/form-data
app.use(express.static('database'))


// lien ket router dieu huong
app.use('/', require('./routerAPIs/noteRouterAPIs'))
app.use('/', require('./routerAPIs/userRouterAPIs'))
app.use('/', require('./routerAPIs/mediaRouterAPIs'))

// chay server
app.listen(process.env.PORT || 5000, () => { // port 500 dung de test , port con lai dung chay heroku
    console.log('Server running')
}) 