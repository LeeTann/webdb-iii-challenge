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

server.post('/api/cohorts', async (req, res) => {
    try {
        const [id] = await db('cohorts').insert(req.body)
        const cohorts = await db('cohorts').where({id}).first()
        res.status(201).json(cohorts)
    } catch(error) {
        res.status(500).json(error)
    }
})

server.get('/api/cohorts', async (req, res) => {
    try {
        const cohorts = await db('cohorts')
        res.status(200).json(cohorts)
    } catch(error) {
        res.status(500).json(error)
    }
})

server.get('/api/cohorts/:id', async (req, res) => {
    try {
        const cohort = await db('cohorts').where({id: req.params.id}).first()
        res.status(200).json(cohort)
    } catch(error) {
        res.status(500).json(error)
    }
})

server.get('/api/cohorts/:id/students', async (req, res) => {
    try{
        const {id} = req.params
        const students = await db('students').where({ cohort_id: id })
        res.status(200).json(students)
    } catch(error) {
        res.status(500).json(error)
    }
}) 

server.put('/api/cohorts/:id', async (req, res) => {
    try{
        const count = await db('cohorts').where({id: req.params.id}).update(req.body)

        if (count > 0) {
            const cohort = await db('cohorts').where({id: req.params.id}).first()

        res.status(200).json(cohort)
        } else {
            res.status(404).json({ message: 'Records not found'})
        }
    } catch(error) {
        res.status(500).json(error)
    }
})

server.delete('/api/cohorts/:id', async (req, res) => {
    try{
        const count = await db('cohorts').where({id: req.params.id}).delete()

        if (count > 0) {
            res.status(204).end()
        } else {
            res.status(404).json({ message: 'Record not found'})
        }
    } catch(error) {
        res.status(500).json(error)
    }
})

// Students route

server.post('/api/students', async (req, res) => {
    try {
        const [id] = await db('students').insert(req.body)
        const students = await db('students').where({id}).first()
        res.status(204).json(students)
    } catch(error) {
        res.status(500).json(error)
    }
})

server.get('/api/students', async (req, res) => {
    try{
        const students = await db('students')
        res.status(200).json(students)
    } catch(error) {
        res.status(500).json(error)
    }
})

server.get('/api/students/:id', async (req, res) => {
    try {
        const id = req.params.id
        const student = await db('students').join('cohorts', 'students.cohort_id', 'cohorts.id')
            .select('students.id', 'students.name', 'cohorts.name as cohort')
            .where('students.id', id)
            .first()
        res.status(200).json(student)
    } catch(error) {
        res.status(500).json(error)
    }
})


server.put('/api/students/:id', async (req, res) => {
    try {
        const count = await db('students').where({id: req.params.id}).update(req.body)

        if (count > 0) {
            const student = await db('students').where({id: req.params.id}).first()

        res.status(200).json(student)
        } else {
            res.status(404).json({ message: 'Records not found'})
        }
    } catch(error) {
        res.status(500).json(error)
    }
})

server.delete('/api/students/:id', async (req, res) => {
    try {
        const count = await db('students').where({id: req.params.id}).delete()

        if (count > 0) {
            res.status(204).end()
        } else {
            res.status(404).json({ message: 'Record not found'})
        }
    } catch(error) {
        res.status(500).json(error)
    }
})

const port = process.env.PORT || 5000
server.listen(port, () => console.log(`\nrunning on port ${port}\n`))