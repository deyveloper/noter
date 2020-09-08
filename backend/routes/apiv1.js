// Imports
const express = require('express')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const { canCreateAccount } = require('./helpers')
const { SECRET_KEY, BCRYPT_SALT_ROUNDS } = require('../appconfig')

// Models
const User = require('../User/user')

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
        last_name: reqData.last_name,
        password: reqData.password
    }
    
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

router.post('/login', async (req, res) => {

})

module.exports = router