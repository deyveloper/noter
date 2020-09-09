const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NoteSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false
    },
    body: {
        type: String,
        required: false
    },
    hide: {
        type: Boolean,
        default: () => false
    }
})


module.exports = mongoose.model('Note', NoteSchema)