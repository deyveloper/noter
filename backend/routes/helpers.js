// Models
const User = require('../models/User/user')

// Returning format (err, data)
const canCreateAccount = async (data) => {
    const usersByEmail = await User.find({ email: data.email }).countDocuments()

    if (usersByEmail > 0) {
        return { err: {
            "message": "Email taken.",
        }, data }
    }

    const usersByUsername = await User.find({ username: data.username }).countDocuments()

    if (usersByUsername > 0) {
        return { err: {
            "message": "Username taken.",
        }, data }
    }

    return { err: null, data }
}

const canLogin = async (data) => {

    if (!data.username) {
        return { err: {
            "message": "Username required.",
        }, data }
    }

    if (!data.password) {
        return { err: {
            "message": "Password required.",
        }, data }
    }

    return { err: null, data }
}

const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers["authorization"]
    if (bearerHeader) {
        const bearerToken = bearerHeader.split(" ")[1]
        req.token = bearerToken
        next()
    } else {
        res.sendStatus(403) // Forbidden
    }
}

module.exports = {
    canCreateAccount,
    canLogin,
    verifyToken
}