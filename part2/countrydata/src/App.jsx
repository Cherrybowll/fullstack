import { useEffect, useState } from 'react'
import axios from 'axios'

// Incredibly bad code that I won't bother fixing.
// Used Open-Meteo instead of Open weather map because
// the latter requires payment information

const Searchbar = ({countryQuery, onChangeCountryQuery}) =>
  <div>
    find countries
    <input value={countryQuery} onChange={onChangeCountryQuery} placeholder="enter country"/>
  </div>

const Countries = ({countries, countryShown, onShowCountry, weatherData}) => {
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
          : <Country key={country.name.common} country={country} weatherData={weatherData} />
        )}
      </div>
    )
  } else if (count === 1) {
    return <Country country={countries[0]} weatherData={weatherData} />
  }
  return <div>No matches</div>
}

const Country = ({country, weatherData}) => {
  if (weatherData === null) {
    return (
      <div>
        <h2>{country.name.common}</h2>
        <p>capital {country.capital[0]}</p>
        <p>area {country.area}</p>
        <h4>languages</h4>
        <ul>
          {Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}
        </ul>
        <img src={country.flags.png} alt={country.flags.alt} />
        <h4>Weather in {country.capital[0]}</h4>
      </div>
    )
  }
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {country.capital[0]}</p>
      <p>area {country.area}</p>
      <h4>languages</h4>
      <ul>
        {Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt} />
      <h4>Weather in {country.capital[0]}</h4>
      <p>temperature {weatherData.current.temperature_2m} Celsius</p>
      <p>precipitation {weatherData.current.precipitation} mm</p>
      <p>wind speed {weatherData.current.wind_speed_10m} m/s</p>
    </div>
  )
}

const App = () => {
  const [countryQuery, setCountryQuery] = useState('')
  const [allCountries, setAllCountries] = useState(null)
  const [countryShown, setCountryShown] = useState(null)
  const [weatherData, setWeatherData] = useState(null)

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
        .then(response => setAllCountries(response.data))
        .catch(error => null)
  }, [])

  useEffect(() => {
    if (allCountries === null) {
      return
    }
    const country = allCountries.find(c => c.name.common === countryShown)
    if (country) {
      axios
        .get(`https://api.open-meteo.com/v1/forecast?latitude=${country.latlng[0]}&longitude=${country.latlng[1]}&current=temperature_2m,precipitation,wind_speed_10m`)
          .then(response => setWeatherData(response.data))
          .catch(error => setWeatherData(null))
    }
  }, [countryShown])

  useEffect(() => {
    if (allCountries === null) {
      return
    }
    const filteredCountries = countryQuery != '' ? allCountries.filter(c => c.name.common.toLowerCase().includes(countryQuery.toLowerCase())) : allCountries
    if (filteredCountries != null && filteredCountries.length === 1) {
      console.log("Match found")
      setCountryShown(filteredCountries[0].name.common)
    }
  }, [countryQuery])

  const handleChangeCountryQuery = (event) => {
    setCountryQuery(event.target.value)
    setCountryShown(event.target.value)
  }
  const handleShowCountry = (country) => setCountryShown(country)
  const filterCountries = () => {
    if (allCountries === null || countryQuery === '') {
      return allCountries
    }
    return (
      allCountries.filter(c => c.name.common.toLowerCase().includes(countryQuery.toLowerCase()))
    )
  }

  return (
    <div>
      <Searchbar countryQuery={countryQuery} onChangeCountryQuery={handleChangeCountryQuery} />
      <Countries
        countries={filterCountries(countryQuery)}
        countryShown={countryShown}
        onShowCountry={handleShowCountry}
        weatherData={weatherData} />
    </div>
  )
}

export default App
