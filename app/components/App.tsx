import { animated } from 'react-spring'
import { transition, useExpand, useFadeIn, useTraverseStartToEnd } from '~/theme/animate'
import Navbar from './Navbar'
import bgStars from '~/styles/assets/stars.png'

type Props = {
  toggleTheme: () => void,
  colorMode: 'dark' | 'light'
}

const App = ({ toggleTheme, colorMode }: Props) => {

  return (
    <animated.div
      className='min-h-screen min-w-screen p-4 flex flex-col justify-between'
      style={{
        ...useFadeIn(),
        background: `url(${bgStars})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'repeat',
        backgroundSize: 'cover',
      }}
    >
      <Navbar toggleTheme={toggleTheme} colorMode={colorMode} />
      <div
        className="flex flex-row justify-center h-96"
      >
        {/* <animated.button
          className='border border-zinc-700 dark:border-zinc-300 dark:text-zinc-200 text-lg rounded-2xl h-14 w-36'
          style={useTraverseStartToEnd()}
        >
          submit
        </animated.button> */}
      </div>

      <animated.div
        style={useExpand()}
        className={`text-center font-display p-3 text-gray-700 dark:text-gray-400 drop-shadow-2xl
        bg-indigo-200 rounded-full dark:bg-zinc-800 ${transition}`}
      >
        Created by, Richie Varghese © 2022
      </animated.div>
    </animated.div>
  )
}

export default App;
