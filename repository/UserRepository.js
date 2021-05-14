const { Note } = require('../model/Note') // them object Note tu Note.js
const Promise = require('promise') // thu vien promise
const fs = require('fs') // thu vien su dung file (file system)
const firebaseUtils = require('../utils/FirebaseUtils')
const { Utils } = require('../utils/utils')
const path = require('path')

function sendToClient(user) {
    return {
        uid: user.uid,
        fname: user.fname,
        lname: user.lname,
        avatar: user.avatar,
        birthDay: user.birthDay
    }
}

function deleteImage(imageName) {
    if (imageName) {
        imageName = path.parse(imageName).base
        console.log(imageName)
        fs.unlink(`${path.dirname(__dirname)}/database/images/${imageName}`, (err) => {
            console.log(err)
        })
    }
}

class DefaultUserRepository {
    login(username, password, type) {
        return new Promise((resolve, reject) => {
            firebaseUtils.logins(username, password, type).then((token) => {
                fs.readFile('./database/users.json', (err, data) => {
                    if (err) {

                    } else {
                        const user = Utils.getTokenFromUser(JSON.parse(`${data}`), token)
                        if (user) {
                            resolve(sendToClient(user))
                        } else {
                            resolve(404)
                        }
                    }
                })
            }).catch((err) => {
                reject(404)
            })
        })
    }

    addtoken(uid, username, password, type) {
        return new Promise((resolve, reject) => {
            firebaseUtils.addtoken(username, password, type).then((token) => {
                fs.readFile('./database/users.json', (err, data) => {
                    if (err) {
                        reject(404)
                    } else {
                        const users = JSON.parse(`${data}`)
                        if (token) {
                            const tokens = users[`${uid}`].tokens
                            if (tokens) { } else {
                                tokens = []
                            }
                            users[uid].tokens.push(token)
                            fs.writeFile('./database/users.json', JSON.stringify(users), (err) => {
                                reject(409)
                            })
                            resolve(sendToClient(users[uid]))
                        } else {
                            reject(409)
                        }
                    }
                })
            }).catch((err) => {
                reject(err)
            })
        })
    }

    changePassword(username, oldPassword, newPassword) {
        return new Promise((resolve, reject) => {
            firebaseUtils.changePassword(username, oldPassword, newPassword)
                .then((token) => {
                    fs.readFile('./database/users.json', (err, data) => {
                        if (err) {
                            reject(404)
                        } else {
                            const user = Utils.getTokenFromUser(JSON.parse(`${data}`), token)
                            if (user) {
                                resolve(sendToClient(user))
                            } else {
                                resolve(404)
                            }
                        }
                    })
                }).catch((err) => {
                    resolve(404)
                })
        })
    }

    forgotPassword(username) {
        return firebaseUtils.forgotPassword(username)
    }

    editProfile(uid, avatar, isDontChangeAvatar, firstName, lastName, birthDay) {
        return new Promise((resolve, reject) => {
            fs.readFile('./database/users.json', (err, data) => {
                const users = JSON.parse(`${data}`)
                const curentUser = users[`${uid}`]
                if (!isDontChangeAvatar) {
                    deleteImage(users[`${uid}`].avatar)
                    users[`${uid}`].avatar = avatar
                }
                const user = users[`${uid}`]
                user.fname = (firstName) ? firstName : curentUser.fname
                user.lname = (lastName) ? lastName : curentUser.lname
                user.birthDay = Number((birthDay) ? birthDay : curentUser.birthDay)
                users[`${uid}`] = user
                console.log(users[`${uid}`])
                fs.writeFile('./database/users.json', JSON.stringify(users), (err) => {
                    reject(409)
                })
                resolve(sendToClient(users[`${uid}`]))
            })
        })
    }

    registration(username, password, type, avatar, firstName, lastName, birthDay) {
        return new Promise((resolve, reject) => {
            const root = `./database/`
            const dir = `${root}users.json`
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(root, { recursive: true })
                fs.writeFile(dir, JSON.stringify({}), (err) => {

                })
            }
            firebaseUtils.registration(username, password, type).then((token) => {
                fs.readFile(dir, (err, data) => {
                    var users = {}
                    try {
                        users = JSON.parse(`${data}`)
                    } catch (error) {
                        users = {}
                    }
                    if (token) {
                        const uid = new Date().getTime()
                        users[`${uid}`] = {
                            uid: uid,
                            fname: firstName,
                            lname: lastName,
                            birthDay: Number(birthDay),
                            avatar: avatar,
                            tokens: [token]
                        }
                        fs.writeFile(dir, JSON.stringify(users), (err) => {
                            reject(409)
                        })
                        resolve(sendToClient(users[`${uid}`]))
                    } else {
                        reject(409)
                    }
                })
            }).catch((err) => {
                reject(409)
            })
        })
    }
}

const repository = new DefaultUserRepository()

module.exports = repository