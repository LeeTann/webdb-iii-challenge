const express = require('express')
const helmet = require('helmet')
const knex = require('knex')

const knexConfig = {
    client: 'sqlite3',
    connection: {
        filename: './data/lambda.sqlite3'
    },
    useNullAsDefault: true
}

const db = knex(knexConfig)

const server = express()

server.use(express.json())
server.use(helmet())

const port = process.env.PORT || 5000
server.listen(port, () => console.log(`\nrunning on port ${port}\n`))