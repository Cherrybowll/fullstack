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

const Persons = ({persons, onDelete}) =>
  <div>
    {persons.map(person => <Person key={person.id} person={person} onDelete={onDelete} />)}
  </div>

const Person = ({person, onDelete}) =>
  <div>
    {person.name} {person.number}
    <button onClick={() => onDelete(person)}>delete</button>
  </div>

const Message = ({message, error}) => {
  if (message === null) {
    return null
  } else if (error) {
    return <div className='error'>{message}</div>
  }
  return <div className='success'>{message}</div>
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [message, setMessage] = useState({message: null, error: true})

  useEffect(() => {
    PersonsService
      .getAll()
        .then(personsInitial => setPersons(personsInitial))
  }, [])

  const handleNewEntry = (event) => {
    event.preventDefault()
    const newPerson = {name: newName, number: newNumber}
    const foundPerson = persons.find(person => person.name === newPerson.name)
    if (foundPerson) {
      if (confirm(`${newPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
        PersonsService
          .edit(foundPerson.id, newPerson)
            .then(editedPerson => {
              setPersons(persons.map(p => p.id === foundPerson.id ? {...p, number: newPerson.number} : p))
              setNewName("")
              setNewNumber("")
              setMessage({message: `Edited ${foundPerson.name}`, error: false})
              setTimeout(() => setMessage({message: null, error: true}), 5000)
            })
            .catch(error => {
              setMessage({message: `${newPerson.name} doesn't exist on server`, error: true})
              setTimeout(() => setMessage({message: null, error: true}), 5000)
              setPersons(persons.filter(p => p.id != foundPerson.id))
            })
      }
    } else {
      PersonsService
        .create(newPerson)
          .then(addedPerson => {
            setPersons(persons.concat(addedPerson))
            setNewName("")
            setNewNumber("")
            setMessage({message: `Added ${addedPerson.name}`, error: false})
            setTimeout(() => setMessage({message: null, error: true}), 5000)
          })
          .catch(error => {
            setMessage({message: `Unable to add ${newPerson.name}`, error: true})
            setTimeout(() => setMessage({message: null, error: true}), 5000)
          })
    }
  }

  const handleDeleteEntry = person => {
    if (confirm(`Do you want to remove ${person.name}?`))
      PersonsService
        .exterminate(person.id)
          .then(removedPerson => {
            setPersons(persons.filter(p => p.id != removedPerson.id))
            setMessage({message: `Deleted ${removedPerson.name}`, error: false})
            setTimeout(() => setMessage({message: null, error: true}), 5000)
          })
          .catch(error => {
            setMessage({message: `${person.name} doesn't exist on server`, error: true})
            setTimeout(() => setMessage({message: null, error: true}), 5000)
            setPersons(persons.filter(p => p.id != person.id))
          })
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
      <Message message={message.message} error={message.error} />
      <Filter text="Name filter" filter={nameFilter} onChange={handleChangeFilter} />
      <h2>Add new entry</h2>
      <PhonebookForm
        name={newName} number={newNumber} onChangeName={handleChangeName}
        onChangeNumber={handleChangeNumber} onSubmit={handleNewEntry}
      />
      <h2>Numbers</h2>
      <Persons persons={personsfiltered} onDelete={handleDeleteEntry} />
    </div>
  )
}

export default App
