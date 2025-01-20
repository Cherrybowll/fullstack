import { useState } from 'react'

const Header = ({text}) => <h1>{text}</h1>

const Button = ({onClick, text}) =>
  <button onClick={onClick}>{text}</button>

const Statistic = ({type, count}) => {
  return <div>{type} {count}</div>
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodFeedback = () => setGood(good + 1)
  const handleNeutralFeedback = () => setNeutral(neutral + 1)
  const handleBadFeedback = () => setBad(bad + 1)

  const total = good + neutral + bad

  return (
    <div>
      <Header text="give feedback" />
      <Button onClick={handleGoodFeedback} text="good" />
      <Button onClick={handleNeutralFeedback} text="neutral" />
      <Button onClick={handleBadFeedback} text="bad" />
      <Header text="statistics" />
      <Statistic type="good" count={good} />
      <Statistic type="neutral" count={neutral} />
      <Statistic type="bad" count={bad} />
      <Statistic type="all" count={total} />
      <Statistic type="average" count={
        (good + bad * (-1)) / (total)
      } />
      {/* A really janky expression here lol */}
      <Statistic type="positive" count={
        good / (total) * 100 + "%"
      } />
    </div>
  )
}

export default App