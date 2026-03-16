const express = require('express')
const app = express()

app.use(express.json())

let persons = [
  {
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/', (request, response) => {
  response.send("<h1>Heiyah!</h1>")
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const found_person = persons.find(p => p.id === id)

  if (!found_person) {
    return response.status(404).end()
  }

  response.json(found_person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id

  persons = persons.filter(p => p.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  new_person = request.body
  console.log(request.body)
  const new_id = Math.floor(Math.random()*100000)

  new_person_object = {
    id: new_id,
    name: new_person.name,
    number: new_person.number
  }

  persons = persons.concat(new_person_object)
  response.json(new_person_object)
})

app.get('/info', (request, response) => {
  const cur_date = new Date()
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${cur_date}</p>`)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})