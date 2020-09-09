const MONGO_HOST = process.env.MONGO_HOST || 'localhost'
const MONGO_PORT = process.env.MONGO_PORT || '27017'
const MONGO_DB = process.env.MONGO_PORT || 'noter'

const connectionString = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`

module.exports = { connectionString }