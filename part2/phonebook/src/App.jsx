import { useState, useEffect } from 'react'
import axios from 'axios'

// All components defined in a single file against good practices

const PhonebookForm = ({name, number, onChangeName, onChangeNumber, onSubmit}) =>
  <form onSubmit={onSubmit}>
  <div>
    name: <input value={name} onChange={onChangeName} />
    <br />
    number: <input value={number} onChange={onChangeNumber} />
  </div>
  <div>
    <button type="submit">add</button>
  </div>
  </form>

const Filter = ({text, filter, onChange}) =>
  <div>
    {text} <input value={filter} onChange={onChange} />
  </div>

const Persons = ({persons}) =>
  <div>
    {persons.map(person => <Person key={person.id} person={person} />)}
  </div>

const Person = ({person}) =>
  <div>
    {person.name} {person.number}
  </div>

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')

  useEffect(() => {
    axios
      .get("http://localhost:3001/persons")
      .then(response => setPersons(response.data))
  }, [])

  const handleNewEntry = (event) => {
    event.preventDefault()
    if (persons.find(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
    } else {
      setPersons(persons.concat({name: newName, number: newNumber, id: persons.length + 1}))
      setNewName("")
      setNewNumber("")
    }
  }

  const handleChangeName = (event) => setNewName(event.target.value)
  const handleChangeNumber = (event) => setNewNumber(event.target.value)
  const handleChangeFilter = (event) => setNameFilter(event.target.value)

  const personsfiltered = persons.filter(person =>
    person.name.toLowerCase().includes(nameFilter.toLowerCase())
  )

  return (
    <div>
      <h1>Phonebook</h1>
      <Filter text="Name filter" filter={nameFilter} onChange={handleChangeFilter} />
      <h2>Add new entry</h2>
      <PhonebookForm
        name={newName} number={newNumber} onChangeName={handleChangeName}
        onChangeNumber={handleChangeNumber} onSubmit={handleNewEntry}
      />
      <h2>Numbers</h2>
      <Persons persons={personsfiltered} />
    </div>
  )
}

export default App
