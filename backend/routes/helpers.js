// Models
const User = require('../User/user')

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


module.exports = { canCreateAccount }