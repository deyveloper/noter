// Imports
const express = require('express')
var bodyParser = require('body-parser')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const router = require('./routes/apiv1.js')
const { connectionString } = require('./dbConfig.js')


mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, () => {
    console.log(`DB connected`);
})

// Models
const User = require('./models/User/user')

// App config
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(bodyParser.json())
app.use('/api/v1/', router)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))