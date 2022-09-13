import React from 'react'
import { Link } from 'react-router-dom'

type Props = {}

const About = (props: Props) => {
  return (
    <div>
      <h1>About</h1>
      <Link to='/'>Home</Link>

    </div>
  )
}

export default About