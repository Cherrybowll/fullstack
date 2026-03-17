const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

// Tämä ilmeisesti toimii
morgan.token('body', (request, response) => {
  return JSON.stringify(request.body)
})
// Toimii nyt paremmin viime vuonna kirjoittamallani versiolla
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :body',
    {skip: (request, response) => request.method !== "POST"}
  )
)
app.use(
  morgan(
    'tiny',
    {skip: (request, response) => request.method === "POST"}
  )
)

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

  if (!(new_person.name && new_person.number)) {
    return response.status(400).json({
      error: "content missing"
    })
  }

  if (persons.find(p => p.name === new_person.name)) {
    return response.status(400).json({
      error: "name must be unique"
    })
  }

  const new_id = String(Math.floor(Math.random()*100000))

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