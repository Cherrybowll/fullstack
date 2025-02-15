const Course = ({course}) =>
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  
  const Header = ({name}) => <h1>{name}</h1>
  
  const Total = ({parts}) =>
    <p><b>Total of {parts.reduce((sum, cur) => sum + cur.exercises, 0)} exercises</b></p>
  
  const Part = ({part}) => 
    <p>
      {part.name} {part.exercises}
    </p>
  
  const Content = ({parts}) => 
    <>
      {parts.map(part => <Part key={part.id} part={part} />)} 
    </>

export default Course
