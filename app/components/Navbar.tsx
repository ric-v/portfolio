import { RiMoonFoggyFill } from 'react-icons/ri'
import { BsFillSunFill } from 'react-icons/bs'
import { animated } from 'react-spring'
import { transition, useFadeIn } from '~/theme/animate'

type Props = {
  toggleTheme: () => void,
  colorMode: 'dark' | 'light'
}

const Navbar = ({ toggleTheme, colorMode }: Props) => {

  return (
    <nav>
      <animated.div
        style={useFadeIn()}
        className="flex flex-row justify-between mb-10 p-5"
      >
        <h1 className="text-4xl md:text-5xl col-span-2 dark:text-gray-200 font-sans">
          asterix.dev
        </h1>
        <button
          className={`p-2 mr-8 col-span-2 rounded-full shadow-xl mx-5 bg-indigo-100 dark:bg-zinc-800
              border border-amber-200 dark:border-zinc-800
              hover:px-10 hover:mr-0 hover:border hover:rounded-full hover:border-amber-300  dark:hover:border-slate-600
              ${transition}`}
          onClick={toggleTheme}
        >
          {
            colorMode === "light" ? (
              <BsFillSunFill size={32} className='text-amber-500' />
            ) : (
              <RiMoonFoggyFill size={32} className='text-slate-400' />
            )
          }
        </button>
      </animated.div>
    </nav>
  )
}

export default Navbar
