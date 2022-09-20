import React from 'react'
import AppLayout from '~/components/layouts/AppLayout'

type Props = {}

const Contact = (props: Props) => {
  return (
    <AppLayout>
      <h3 className='font-display text-2xl'>Connect with me</h3>
      <input type='text' placeholder='Name' className='border border-gray-300 dark:border-gray-600 rounded-md p-2 my-2' />
      <input type='email' placeholder='Email' className='border border-gray-300 dark:border-gray-600 rounded-md p-2 my-2' />
      <textarea placeholder='Message' className='border border-gray-300 dark:border-gray-600 rounded-md p-2 my-2' />
      <button className='bg-gray-300 dark:bg-gray-600 rounded-md p-2 my-2'>Send</button>

    </AppLayout>
  )
}

export default Contact