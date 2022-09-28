import React from 'react'
import { transition } from '~/theme/animate'
import { IoCloseSharp } from 'react-icons/io5'

type Props = {
  duration: string
  title: string
  company: string
  companyLink: string
  domain: string
  desc: string
  children: React.ReactNode
}

const Timeline = ({ duration, title, company, companyLink, domain, desc, children }: Props) => {
  const [selected, setSelected] = React.useState(false)

  return (
    <>
      <div className={`col-span-3 lg:col-span-2 flex flex-row justify-center backdrop-blur-sm backdrop-brightness-95 rounded-2xl py-5 mx-2 hover:backdrop-brightness-75  dark:neumorphic-shadow hover:scale-110 cursor-pointer ${transition}`} onClick={() => setSelected(true)}>
        <div className='text-center'>
          <div className='text-xs sm:text-md md:text-lg text-amber-800 dark:text-orange-300 animate-pulse'>
            {duration}
          </div>
          <div className='text-lg sm:text-xl md:text-2xl font-medium text-slate-800 dark:text-sky-300'>
            {title}
          </div>
          <div className='text-md sm:text-xl md:text-2xl text-slate-800 dark:text-sky-300'>
            {company}
          </div>
          <div className='text-sm sm:text-md md:text-lg text-slate-800 dark:text-sky-300'>
            Domain: {domain}
          </div>
          {/* <div className='text-sm sm:text-md md:text-lg text-slate-600 dark:text-slate-300'>
            {desc.length > 30 ? `${desc.slice(0, 30)}...` : desc}
            <br />
          </div> */}
          <span className={`text-xs cursor-pointer hover:text-sky-500 animate-bounce ${transition}`}>{'click to expand'}</span>
        </div>
      </div>

      {/* if selected, show modal to display details */}
      {selected && (
        <div className='fixed top-0 left-0 h-full flex flex-col justify-center items-center z-50 backdrop-blur-2xl backdrop-brightness-90'>
          <div className='rounded-2xl w-full md:w-1/2 p-2 md:p-10 mt-20 overflow-y-scroll scrollbar-thin'>
            <div className='text-center md:text-left'>
              <div className='text-md md:text-xl text-amber-800 dark:text-orange-300 animate-pulse'>
                {duration}
              </div>
              <div className='text-xl md:text-3xl mt-2 font-bold text-slate-800 dark:text-sky-300'>
                {title}
              </div>
              <div className={`text-xl md:text-3xl mt-2 font-medium text-slate-800 dark:text-sky-300 hover:font-bold hover:text-amber-700 hover:dark:text-sky-500 ${transition}`}>
                <a href={companyLink} target={'_blank'} rel="noreferrer">{company}</a>
              </div>
              <div className='text-sm sm:text-md md:text-lg font-medium text-slate-800 dark:text-sky-300'>
                Domain: {domain}
              </div>
              <div className='text-left text-sm md:text-xl mt-2 text-slate-700 dark:text-slate-300'>
                {desc}
              </div>
            </div>
            <div className='text-center md:text-left mt-2'>
              {children}
            </div>
          </div>
          <button className={`px-3 py-3 rounded-full hover:backdrop-brightness-50 hover:scale-110 hover:bg-black hover:bg-opacity-40 animate-pulse hover:animate-none ${transition}`} onClick={() => setSelected(false)}>
            <IoCloseSharp size={32} />
          </button>
        </div>
      )}

    </>
  )
}

export default Timeline;
