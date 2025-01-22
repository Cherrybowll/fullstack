import { useEffect, useState } from 'react'
import axios from 'axios'

const Searchbar = ({countryQuery, onChangeCountryQuery}) =>
  <div>
    find countries
    <input value={countryQuery} onChange={onChangeCountryQuery} placeholder="enter country"/>
  </div>

const Countries = ({countries, countryShown, onShowCountry}) => {
  if (countries === null) {
    return
  }
  const count = countries.length
  if (count > 10) {
    return <div>Too many matches, specify another filter</div>
  } else if (count > 1) {
    return (
      <div>
        {countries.map(country => (country.name.common != countryShown) ?
          <div key={country.name.common}>
            {country.name.common}
            <button onClick={() => onShowCountry(country.name.common)}>show</button>
          </div>
          : <Country key={country.name.common} country={country} />
        )}
      </div>
    )
  } else if (count === 1) {
    return <Country country={countries[0]} />
  }
  return <div>No matches</div>
}

const Country = ({country}) =>
  <div>
    <h2>{country.name.common}</h2>
    <p>capital {country.capital[0]}</p>
    <p>area {country.area}</p>
    <h4>languages</h4>
    <ul>
      {Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}
    </ul>
    <img src={country.flags.png} alt={country.flags.alt} />
  </div>

const App = () => {
  const [countryQuery, setCountryQuery] = useState('')
  const [allCountries, setAllCountries] = useState(null)
  const [countryShown, setCountryShown] = useState(null)

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
        .then(response => setAllCountries(response.data))
  }, [])

  const handleChangeCountryQuery = (event) => {
    setCountryQuery(event.target.value)
    setCountryShown(null)
  }
  const handleShowCountry = (country) => setCountryShown(country)
  const filterCountries = () => {
    if (allCountries === null || countryQuery === '') {
      return allCountries
    }
    return (
      allCountries.filter(c => c.name.common.includes(countryQuery))
    )
  }

  return (
    <div>
      <Searchbar countryQuery={countryQuery} onChangeCountryQuery={handleChangeCountryQuery} />
      <Countries
        countries={filterCountries(countryQuery)}
        countryShown={countryShown}
        onShowCountry={handleShowCountry} />
    </div>
  )
}

export default App
