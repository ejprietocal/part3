require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Phone = require('./modules/persons')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


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

app.use(morgan((tokens, req, res) => {
  const log = [
    tokens.method(req, res),        
    tokens.url(req, res),            
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'),
    '-',
    tokens['response-time'](req, res),
    'ms'
  ].join(' ');

  if (req.method === 'POST') {
    return `${log} ${JSON.stringify(req.body)}`;
  }
  return log;
}));

app.get('/', (request, response) =>{
  response.send(`<h1>Welcome to the app</h1>`)
})
app.get('/api/persons', (request, response) => {
  Phone.find({}).then(persons =>{
      response.json(persons)
    })  
  })

app.get('/api/persons/:id', (request, response) => {
  Phone.findById(request.params.id).then(person => {
        response.json(person)
      })
  })
app.get('/info', (request , response) =>{
    const now = new Date();
    const options = {
        weekday: 'long', // Día de la semana completo (e.g., 'Monday')
        year: 'numeric', // Año completo (e.g., '2024')
        month: 'long', // Mes completo (e.g., 'August')
        day: 'numeric', // Día del mes (e.g., '12')
        hour: '2-digit', // Hora en formato de 2 dígitos (e.g., '08')
        minute: '2-digit', // Minuto en formato de 2 dígitos (e.g., '05')
        second: '2-digit', // Segundo en formato de 2 dígitos (e.g., '09')
        timeZoneName: 'short' // Nombre de la zona horaria (e.g., 'EST')
      };
      
    const formattedDate = now.toLocaleString('en-US', options);

    response.send(
        `<h3>Phonebook has info for ${persons.length} persons</h3>
        <h3>${formattedDate}</h3>`
    )
})
app.delete('/api/persons/:id', (request, response) =>{
    Phone.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    const {name, number} = body

    if (name === undefined ||number === undefined ) {
      return response.status(400).json({ error: 'content missing' })
    }
    const person = new Phone({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPhone => {
      response.json(savedPhone)
    })
  })

app.put('/api/persons/:name', (request, response, next) => {
  const body = request.body
  const name = request.params.name
  const person = {
    name: name,
    number: body.number
  }

  console.log(person)

  Phone.findOne({name: name})
    .then(phone => {
      Phone.findByIdAndUpdate(phone.id,person,{new: true})
      .then(updatedPerson =>{
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})

app.use(errorHandler)
app.use(unknownEndpoint)
  
const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})