const mongoose = require('mongoose')
const validators = require('./validators')
// Add new type
require('mongoose-type-email')
const Schema = mongoose.Schema


const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        validate: validators.usernameValidator
    },
    first_name: {
        type: String,
        maxlength: 50,
        required: true,
        validate: validators.firstNameValidator
    },
    last_name: {
        type: String,
        maxlength: 50,
        required: true,
        validate: validators.lastNameValidator
    },
    email: {
        type: mongoose.SchemaTypes.Email,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    is_active: {
        type: Boolean,
        default: () => false,
    },
    is_staff: {
        type: Boolean,
        default: () => false,
    }
})


module.exports = mongoose.model('User', UserSchema)