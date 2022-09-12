import React from 'react'
import { HiOutlineSun } from 'react-icons/hi'
import { RiMoonFoggyFill } from 'react-icons/ri'
import { transition } from '~/routes'

type Props = {
  toggleTheme: () => void,
  colorMode: 'dark' | 'light'
}

const Navbar = ({
  toggleTheme, colorMode
}: Props) => {
  return (
    <nav className="flex flex-row justify-between mb-10">
      <h1 className="text-4xl md:text-5xl col-span-2 dark:text-gray-200 font-sans">
        asterix.dev
      </h1>
      <button
        className={`p-2 mr-8 col-span-2 border rounded-full dark:border-gray-700 
              hover:bg-gray-300 dark:hover:bg-gray-900
              hover:px-10 hover:mr-0 hover:border hover:rounded-full hover:border-slate-600
              ${transition}`}
        onClick={toggleTheme}
      >
        {
          colorMode === "light" ? (
            <RiMoonFoggyFill size={32} />
          ) : (
            <HiOutlineSun size={32} className='text-white' />
          )
        }
      </button>
    </nav>
  )
}

export default Navbar