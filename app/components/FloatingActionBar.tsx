import { Link } from '@remix-run/react'
import { useState } from 'react'
import { HiOutlineMenuAlt2 } from 'react-icons/hi'
import { IoCloseSharp } from 'react-icons/io5'
import { animated, useSpring } from 'react-spring'
import { transition } from '~/theme/animate'

type Props = {
  enableStarLight: boolean
  setEnableStarLight: (enable: boolean) => void
}

const FloatingActionBar = ({ enableStarLight, setEnableStarLight }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [style, animate] = useSpring(() => ({
    to: { opacity: 1 },
    from: { opacity: 0 },
    config: {
      duration: 500,
    }
  }))

  return (
    <>
      {/* <animated.div className={`${!isOpen && 'hidden'} h-screen w-screen backdrop-brightness-90 backdrop-blur-md ${transition}`}></animated.div> */}
      <div
        className={`fixed bottom-10 md:bottom-5 right-5 z-10 rounded-full p-2 border border-slate-100 dark:border-slate-600
        bg-slate-100 hover:bg-slate-300 dark:bg-slate-700 hover:dark:bg-slate-800 cursor-pointer drop-shadow-2xl ${transition}`}
        onClick={() => {
          setIsOpen(!isOpen);
          animate({ opacity: isOpen ? 0 : 1, delay: 100 });
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
            <animated.div style={style} className={`absolute bottom-16 right-10 w-56 text-xl bg-slate-100 dark:bg-slate-700 rounded-lg shadow-lg p-5`}>
              <div className='flex flex-col justify-between'>
                <Link to='/' className='text-gray-600 dark:text-gray-300 hover:text-gray-800 hover:dark:text-gray-50 p-1'>Home</Link>
                <Link to='/me' className='text-gray-600 dark:text-gray-300 hover:text-gray-800 hover:dark:text-gray-50 p-1'>About</Link>
                <Link to='/contact' className='text-gray-600 dark:text-gray-300 hover:text-gray-800 hover:dark:text-gray-50 p-1'>Contact</Link>
                <p className='text-gray-600 dark:text-gray-300 hover:text-gray-800 hover:dark:text-gray-50 p-1' onClick={() => setEnableStarLight(!enableStarLight)}>
                  {
                    enableStarLight ? (
                      'Disable Starlight'
                    ) : (
                      'Enable Starlight'
                    )
                  }
                </p>
              </div>
            </animated.div>
          )
        }
      </div>
    </>
  )
}

export default FloatingActionBar;
