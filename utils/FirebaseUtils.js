const firebase = require('firebase') // thu vien de su dung firebase (firebase auth)
const configure = require('../utils/firebaseconfigure.json') // doc file json configure

firebase.initializeApp(configure) // initial firebase

const provider = new firebase.auth.GoogleAuthProvider()
provider.addScope('https://www.googleapis.com/auth/contacts.readonly')


const Type = {
    EMAIL_PASS: 'email_pass',
    GOOGLE_SIGN_IN: 'google_sign_in'
}

class FirebaseUtils {

    get auth() {
        return firebase.auth()
    }

    logins(username, password, type) {
        switch (type) {
            case Type.EMAIL_PASS:
                return new Promise((resolve, reject) => {
                    firebase.auth().signInWithEmailAndPassword(username, password)
                        .then(() => {
                            resolve(firebase.auth().currentUser.uid)
                        })
                        .then(() => {
                            return firebase.auth().signOut()
                        })
                        .catch((err) => {
                            reject(err)
                        })
                })
            case Type.GOOGLE_SIGN_IN:
                return new Promise((resolve, reject) => {
                    provider.setCustomParameters({
                        'login_hint': username
                    })
                    firebase.auth()
                        .signInWithPopup(provider).then((result) => {
                            console.log(result.user)
                        })
                })
            default:
                break
        }
    }

    addtoken(username, password, type) {
        switch (type) {
            case Type.GOOGLE_SIGN_IN:
                return new Promise((resolve, reject) => {

                })
            default:
                break
        }
    }

    changePassword(username, oldPassword, newPassword) {
        return new Promise((resolve, reject) => {
            firebase.auth().signInWithEmailAndPassword(username, oldPassword)
                .then(() => {
                    const user = firebase.auth().currentUser
                    user.updatePassword(newPassword).then(() => {
                        resolve(user.uid)
                    }).catch((err) => {
                        console.log(err)
                        reject(451)
                    })
                })
                .then(() => {
                    return firebase.auth().signOut()
                })
                .catch((err) => {
                    reject(404)
                })
        })
    }

    forgotPassword(username){
        return new Promise((resolve, reject)=>{
            firebase.auth().sendPasswordResetEmail(username)
            .then(()=>{
                resolve(200)
            }).then(()=>{
                return firebase.auth().signOut()
            }).catch((err)=>{
                console.log(err)
                resolve(404)
            })
        })
    }

    registration(username, password, type){
        switch (type) {
            case Type.EMAIL_PASS:
                return new Promise((resolve, reject) => {
                    firebase.auth().createUserWithEmailAndPassword(username, password)
                        .then((user) => {
                            resolve(firebase.auth().currentUser.uid)
                        })
                        .then(() => {
                            return firebase.auth().signOut()
                        })
                        .catch((err) => {
                            reject(err)
                        })
                })
            case Type.GOOGLE_SIGN_IN:
                return new Promise((resolve, reject) => {

                })
            default:
                break
        }
    }
}

const firebaseUtils = new FirebaseUtils()

module.exports = firebaseUtils