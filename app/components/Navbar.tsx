import { RiMoonFoggyFill } from 'react-icons/ri'
import { BsFillSunFill } from 'react-icons/bs'
import { animated } from 'react-spring'
import { transition, useFadeIn, useExpand } from '~/theme/animate'

type Props = {
  toggleTheme: () => void,
  colorMode: 'dark' | 'light',
  children: React.ReactNode,
}

const Navbar = ({ toggleTheme, colorMode, children }: Props) => {

  return (
    <>
      {/* set fixed nav bar on top */}
      <nav className='fixed top-0 left-0 w-full backdrop-blur-xl z-10'>
        <animated.div
          style={useFadeIn()}
          className="flex flex-row justify-between p-5"
        >
          <h1 className="text-4xl md:text-5xl col-span-2 dark:text-gray-200 font-sans">
            asterix.dev
          </h1>
          <button
            className={`p-2 mr-8 col-span-2 rounded-full shadow-xl mx-5 bg-amber-50 dark:bg-slate-800
              border border-amber-200 dark:border-slate-800 ${colorMode === 'light' ? 'light-mode-shadow' : 'dark-mode-shadow'}
              hover:px-10 hover:mr-0 hover:border hover:rounded-full hover:border-amber-300  dark:hover:border-slate-600
              ${transition}`}
            onClick={toggleTheme}
          >
            {
              colorMode === "light" ? (
                <BsFillSunFill size={32} className='text-amber-600' />
              ) : (
                <RiMoonFoggyFill size={32} className='text-slate-200' />
              )
            }
          </button>
        </animated.div>
      </nav>
      <div className=''>
        {children}
      </div>

      <animated.div
        style={useExpand()}
        className={`text-center font-display py-5 mt-5 text-gray-700 dark:text-gray-400 drop-shadow-2xl
         backdrop-blur-md ${transition}`}
      >
        Created by, Richie Varghese © 2022
      </animated.div>
    </>
  )
}

export default Navbar
