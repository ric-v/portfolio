import { Link } from '@remix-run/react'
import { useState } from 'react'
import { HiOutlineMenuAlt2 } from 'react-icons/hi'
import { IoCloseSharp } from 'react-icons/io5'
import { animated } from 'react-spring'
import { transition } from '~/theme/animate'
import { useFadeIn } from '~/theme/animate'

type Props = {}

const FloatingActionBar = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className={`fixed bottom-10 md:bottom-5 right-5 z-10 rounded-full p-2 
        bg-slate-100 dark:bg-slate-700 cursor-pointer drop-shadow-2xl
        border border-slate-700 dark:border-slate-100
        ${transition}`}
      onClick={() => setIsOpen(!isOpen)}
    >
      {
        isOpen ? (
          <IoCloseSharp size={24} className='text-slate-800 dark:text-slate-100' />
        ) : (
          <HiOutlineMenuAlt2 size={24} className='text-slate-800 dark:text-slate-100' />
        )
      }

      {
        isOpen && (
          <animated.div className={`absolute bottom-10 right-10 text-xl bg-slate-100 dark:bg-slate-700 rounded-lg shadow-lg p-5 ${transition}`}>
            <div className='flex flex-col justify-between'>
              <Link to='/' className='text-gray-600 dark:text-gray-300 hover:text-gray-800 hover:dark:text-gray-50 p-1'>Home</Link>
              <Link to='/me' className='text-gray-600 dark:text-gray-300 hover:text-gray-800 hover:dark:text-gray-50 p-1'>About</Link>
              <Link to='/contact' className='text-gray-600 dark:text-gray-300 hover:text-gray-800 hover:dark:text-gray-50 p-1'>Contact</Link>
            </div>
          </animated.div>
        )
      }
    </div>
  )
}

export default FloatingActionBar