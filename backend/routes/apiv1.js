// Imports
const express = require('express')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const {
    canLogin,
    canCreateAccount,
    verifyToken
} = require('./helpers')
const { SECRET_KEY, BCRYPT_SALT_ROUNDS } = require('../appconfig')

// Models
const User = require('../models/User/user')
const Note = require('../models/Note/note')
const { find } = require('../models/User/user')

// Config
const router = express.Router()

// -- Routings
router.post('/user/register', async (req, res) => {
    const newUser = new User()
    const reqData = req.body
    const _data = {
        email: reqData.email,
        username: reqData.username,
        first_name: reqData.first_name,
        last_name: reqData.last_name
    }

    bcrypt.hash(reqData.password, BCRYPT_SALT_ROUNDS)
    .then((hashedPassword) => {
        _data['password'] = hashedPassword

        canCreateAccount(_data)
        .then(({ err, data }) => {
            if (err) {
                res.status(400).json(err)
                return
            }
    
            newUser.set(_data)
            newUser.save((err, data) => {
                if (err) {
                    res.status(400).json(err)
                    return
                }
                const _respdata = {
                    _id: data._id,
                    is_active: data.is_active,
                    is_staff: data.is_staff,
                    email: data.email,
                    username: data.username
                }
                res.json(_respdata)
            })
        })
    })
    .catch((err) => {
        res.sendStatus(500)
    })
})

router.post('/user/login', async (req, res) => {
    var username = req.body.username
    var password = req.body.password

    canLogin({ username, password })
    .then(async ({ err, data }) => {
        if (err) {
            res.status(400).json(err)
            return
        }

        const user = await User.findOne({ username: username })
        if (!user) {
            res.status(401).json({
                "message": "User not found."
            })
            return
        }
        
        if (!user.is_active) {
            res.status(401).json({
                "message": "User is not active."
            })
            return
        }

        const samePassword = await bcrypt.compare(password, user.password)
        
        if (!samePassword) {
            res.status(401).json({
                "message": "Username and password didn't match."
            })
            return
        }

        jwt.sign({ user, authorized_time: (new Date()) }, SECRET_KEY, (err, token) => {
            res.json({
                "status": "success",
                "message": "Authorized successfuly.",
                "token": token
            })
        })

        return
    })
    .catch((err) => {
        res.sendStatus(500)
    })
})


router.post('/note', verifyToken, async (req, res) => {
    jwt.verify(req.token, SECRET_KEY, async (err, authData) => {
        if (err) {
            res.status(403).json(err)
        } else {
            const user = await User.findById(authData.user._id)
            if (user.is_active) {
                const newNote = new Note()
                newNote.user = authData.user._id
                newNote.title = req.body.title
                if (req.body.hide) {
                    newNote.hide = req.body.hide
                }
                newNote.description = req.body.description
                newNote.body = req.body.body
                newNote.save()

                res.json({
                    message: 'Note created.',
                })
            }  else {
                res.status(403).json({
                    message: "User is not active."
                })
            }
        }
    })
})

router.get('/note', verifyToken, async (req, res) => {
    jwt.verify(req.token, SECRET_KEY, async (err, authData) => {
        if (err) {
            res.status(403).json(err)
        } else {
            const user = await User.findById(authData.user._id)
            if (user.is_active) {
                if (req.body.id) {
                    const note = await Note.find({ _id: req.body.id, user: user._id })
                    res.json(note)
                    return
                }

                const notes = await Note.find({ user: user._id })
                res.json(notes)
            }  else {
                res.status(403).json({
                    message: "User is not active."
                })
            }
        }
    })
})

module.exports = router