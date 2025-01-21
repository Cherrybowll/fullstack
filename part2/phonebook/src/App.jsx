import { useState, useEffect } from 'react'
import PersonsService from './services/persons'

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
    PersonsService
      .getInitial()
        .then(personsInitial => setPersons(personsInitial))
  }, [])

  const handleNewEntry = (event) => {
    event.preventDefault()
    if (persons.find(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
    } else {
      const newPerson = {name: newName, number: newNumber}
      PersonsService
        .create(newPerson)
          .then(addedPerson => {
            setPersons(persons.concat(addedPerson))
            setNewName("")
            setNewNumber("")
          })
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
