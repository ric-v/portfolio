import React from 'react'
import { transition } from '~/theme/animate'

type Props = {
  duration: string
  title: string
  company: string
  desc: string
}

const Timeline = ({ duration, title, company, desc }: Props) => {
  return (
    <>
      <div className={`col-span-3 lg:col-span-2 flex flex-row justify-center backdrop-blur-sm backdrop-brightness-95 rounded-2xl py-5 mx-2 neumorphic-shadow hover:backdrop-brightness-50 ${transition}`}>
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
          <div className='text-sm sm:text-md md:text-lg text-slate-600 dark:text-slate-300'>
            {desc.length > 30 ? `${desc.slice(0, 30)}...` : desc}
            <br />
            <span className={`text-xs cursor-pointer hover:text-sky-500 ${transition}`}>{'click to expand'}</span>
          </div>
        </div>
      </div>
    </>
  )
}
export default Timeline;
