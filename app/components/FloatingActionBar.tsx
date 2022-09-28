import { Link } from '@remix-run/react'
import { useState } from 'react'
import { HiOutlineMenuAlt2 } from 'react-icons/hi'
import { IoCloseSharp } from 'react-icons/io5'
import { transition } from '~/theme/animate'

type Props = {
  enableStarLight: boolean
  setEnableStarLight: (enable: boolean) => void
}

const FloatingActionBar = ({ enableStarLight, setEnableStarLight }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* <animated.div className={`${!isOpen && 'hidden'} h-screen w-screen backdrop-brightness-90 backdrop-blur-md ${transition}`}></animated.div> */}
      <div
        className={`fixed bottom-10 md:bottom-5 right-5 z-10 rounded-full p-2 border border-slate-100 dark:border-slate-600
        bg-slate-100 hover:bg-slate-300 dark:bg-slate-700 hover:dark:bg-slate-800 cursor-pointer drop-shadow-2xl ${transition}`}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {
          isOpen ? (
            <IoCloseSharp size={32} className='text-slate-800 dark:text-slate-100' />
          ) : (
            <HiOutlineMenuAlt2 size={32} className='text-slate-800 dark:text-slate-100' />
          )
        }

        {
          isOpen && (
            <div className={`absolute bottom-16 right-10 w-56 text-xl bg-slate-100 dark:bg-slate-700 rounded-lg shadow-lg p-5`}>
              <div className='flex flex-col justify-between'>
                <Link to='/' className='text-gray-400 dark:text-gray-400 hover:text-gray-800 hover:dark:text-gray-50 p-1'>Home</Link>
                <div className='border border-slate-200 dark:border-slate-600' />
                <Link to='/projects' className='text-gray-400 dark:text-gray-400 hover:text-gray-800 hover:dark:text-gray-50 p-1'>Projects</Link>
                <div className='border border-slate-200 dark:border-slate-600' />
                <p className='text-gray-400 dark:text-gray-400 hover:text-gray-800 hover:dark:text-gray-50 p-1' onClick={() => {
                  setEnableStarLight(!enableStarLight);
                  localStorage.setItem('enableStarLight', (!enableStarLight).toString());
                }}>
                  {
                    enableStarLight ? (
                      'Disable Starlight'
                    ) : (
                      'Enable Starlight'
                    )
                  }
                </p>
              </div>
            </div>
          )
        }
      </div>
    </>
  )
}

export default FloatingActionBar;
