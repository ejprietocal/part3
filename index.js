const express = require('express')
const app = express()
app.use(express.json())

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


const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...notes.map(n => n.id))
      : 0
    return maxId + 1
  }

app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

app.get('/api/persons/:id', (request, response) => {

    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
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
    const id = Number(request.params.id)
    const personFiltered = persons.filter(person => person.id !== id)

    response.json(personFiltered)
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    const person = {
        id: Math.random() * 99999999999,
        name: body.name,
        number: body.number,
    }
    if(persons.find(per => per.name === person.name)){
        return response.status(400).json({ 
            error: 'name must be unique' 
          })
    }
    if (!person.name) {
      return response.status(400).json({ 
        error: 'The name is missing' 
      })
    }
    if (!person.number) {
      return response.status(400).json({ 
        error: 'The number is missing' 
      })
    }

    persons = persons.concat(person)
  
    response.json(persons)
  })
  



const PORT = 3002

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})