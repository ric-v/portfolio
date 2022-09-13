import { animated } from 'react-spring'
import Navbar from './Navbar'
import { Link } from '@remix-run/react'
import { transition, useExpand } from '~/theme/animate'

type Props = {
  toggleTheme: () => void,
  colorMode: 'dark' | 'light'
}

const App = ({ toggleTheme, colorMode }: Props) => {

  return (
    <animated.div
      className='min-h-screen min-w-screen p-4 flex flex-col justify-between overflow-hidden scrollbar scrollbar-thumb-gray-900 scrollbar-track-gray-100'>
      <Navbar toggleTheme={toggleTheme} colorMode={colorMode}>
        <div
          className="flex flex-col justify-center relative top-20 dark:text-slate-300"
        >

          {/* <animated.button
          className='border border-zinc-700 dark:border-zinc-300 dark:text-zinc-200 text-lg rounded-2xl h-14 w-36'
          style={useTraverseStartToEnd()}
        >
          submit
        </animated.button> */}

          <Link to='/about'>
            <animated.button
              className='border border-zinc-700 dark:border-zinc-300 dark:text-zinc-200 text-lg rounded-2xl h-14 w-36'
            // style={useTraverseStartToEnd()}
            >
              about
            </animated.button>
          </Link>
        </div>
      </Navbar>
    </animated.div>
  )
}

export default App;
