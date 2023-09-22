const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
require('dotenv').config()

const Person = require('./models/person')

let persons = []

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    console.log("ErrorHandler called")

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}
app.use(cors())
app.use(express.json())
app.use(express.static('build'))



app.use(express.json())
app.use(morgan(':method :url :status :response-time ms - :res[content-length]'))

// const generateId = () => {
//     const maxId = 65535;

//     const id = Math.floor(Math.random() * maxId)
//     return id;
// }

// POST
app.post('/api/persons', (request, response, next) => {
    console.log("POST handler called")
    const body = request.body

    // console.log(request.headers)
    // console.log(body.name);

    if (body.name === null || body.number === null) {
        return response.status(400).json({
            error: 'Name or number missing'
        })
    } else if (persons.filter(p => p.name === body.name).length > 0) {
        return response.status(400).json({
            error: 'Name must be unique'
        })
    }

    // const person = {
    //     name: body.name,
    //     number: body.number,
    //     id: generateId(),
    // }


    // console.log("body.name: ", body.name);
    // console.log("body.number: ", body.number);
    const person = new Person(
        {
            name: body.name,
            number: body.number
        }
    )
    // response.json(person)
    person.save().then((savedPer) => {
        response.json(savedPer)
        persons = persons.concat(savedPer)

    }).catch((err) => next(err))
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/info', (request, response) => {
    const timestamp = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <br/> ${timestamp}`)
    // response.json(persons)
})
app.get('/api/persons/:id', (request, response, next) => {
    // const id = Number.parseInt(request.params.id)


    Person.findById(request.params.id)
        .then(pers => {
            if (pers) {
                response.json(pers)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.content,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {

    Person.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)