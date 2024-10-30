import React from 'react'

type Props = {}

const Contact = (props: Props) => {
  return (
    <div className='flex flex-col justify-center items-center contact-card'>
      <h1 className='text-2xl md:text-4xl font-bold text-slate-500 mb-6'>
        Contact
      </h1>
      <p className='text-md md:text-lg text-slate-700 dark:text-slate-300 mb-4'>
        Feel free to reach out to me via email or connect with me on social media.
      </p>
      <div className='flex flex-col md:flex-row justify-center items-center'>
        <a href='mailto:ric-v@astrx.dev' className='text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors duration-300 mb-2 md:mb-0 md:mr-4'>
          ric-v@astrx.dev
        </a>
        <a href='tel:+918281756733' className='text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors duration-300 mb-2 md:mb-0 md:mr-4'>
          +91-8281756733
        </a>
        <a href='https://www.linkedin.com/in/ric-v' target='_blank' rel='noreferrer' className='text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors duration-300'>
          LinkedIn
        </a>
      </div>
    </div>
  )
}

export default Contact