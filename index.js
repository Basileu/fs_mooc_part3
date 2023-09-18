const express = require('express');
const morgan = require('morgan');
const app = express()
const cors = require('cors')

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]
app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('custom1', function (req, res) {
    // return req.headers['content-type']
    return JSON.stringify({
        url: req.url,
        "name": req.url,
        // method: req.method,
        httpVersion: req.httpVersion
    })
})
morgan.token('body1', (req, res) => {
    // const body = { ...JSON.parse(res.responseBody) };
    console.log(res.body);
    JSON.stringify(res.body)

});
// app.use(morgan('custom1'));
// app.use(morgan(':method :url :status :custom1'));
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
// app.use(morgan(':method :status :res[content-length] -=== :response-time ms :res[body]'));

app.use(express.json())
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body1 - :res[content-length]'));

const generateId = () => {
    const maxId = 65535;

    const id = Math.floor(Math.random() * maxId)
    return id;
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    // console.log(request.headers)
    // console.log(body.name);

    if (body.name == null || body.number == null) {
        return response.status(400).json({
            error: 'Name or number missing'
        })
    } else if (persons.filter(p => p.name === body.name).length > 0) {
        return response.status(400).json({
            error: 'Name must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat(person)

    response.json(person)
})
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/info', (request, response) => {
    const timestamp = new Date();
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <br/> ${timestamp}`);
    // response.json(persons)
})
app.get('/api/persons/:id', (request, response) => {
    const id = Number.parseInt(request.params.id)

    const person = persons.find(pers => pers.id == id)
    if (person) {
        response.json(person)
    } else {
        response.statusMessage = "Status message: id not found";
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(pers => pers.id !== id)
    response.status(204).end()
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)