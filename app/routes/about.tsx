import { Link } from 'react-router-dom'
import AppLayout from '~/components/layouts/AppLayout'

type Props = {}

const About = (props: Props) => {
  return (
    <AppLayout>
      <Link to='/'>Home</Link>
    </AppLayout>
  )
}

export default About