import { useState } from 'react'

const Header = ({text}) => <h1>{text}</h1>

const Button = ({onClick, text}) =>
  <button onClick={onClick}>{text}</button>

const StatisticLine = ({type, count, unit=""}) => {
  return <tr>
    <td>{type}</td><td>{count}{unit}</td>
  </tr>
}

const Statistics = ({good, neutral, bad}) => {
  const total = good + neutral + bad

  if (total === 0) {
    return <div>No feedback given</div>
  }

  return (
    <div>
      <table>
        <tbody>
          <StatisticLine type="good" count={good} />
          <StatisticLine type="neutral" count={neutral} />
          <StatisticLine type="bad" count={bad} />
          <StatisticLine type="all" count={total} />
          <StatisticLine type="average" count={
            (good + bad * (-1)) / (total)
          } />
          <StatisticLine type="positive" count={
            good / (total) * 100
          } unit="%" />
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodFeedback = () => setGood(good + 1)
  const handleNeutralFeedback = () => setNeutral(neutral + 1)
  const handleBadFeedback = () => setBad(bad + 1)

  return (
    <div>
      <Header text="give feedback" />
      <Button onClick={handleGoodFeedback} text="good" />
      <Button onClick={handleNeutralFeedback} text="neutral" />
      <Button onClick={handleBadFeedback} text="bad" />
      <Header text="statistics" />
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App