import { IParallax } from '@react-spring/parallax';
import React, { MutableRefObject } from 'react'
import { HiChevronDoubleDown } from 'react-icons/hi';

type Props = {
  toPage: number;
  parallax: MutableRefObject<IParallax>;
}

const ParallaxScroll = ({ toPage, parallax }: Props) => {
  return (
    <button className='flex flex-row justify-center mt-5 md:mt-20 absolute right-1/2 bottom-5 animate-bounce hover:animate-none cursor-pointer'
      onClick={() => parallax.current.scrollTo(toPage)}
    >
      <h1 className='text-xl md:text-xl rounded-full p-2 font-bold text-slate-500 bg-white bg-opacity-40 dark:bg-opacity-10'>
        <HiChevronDoubleDown />
      </h1>
    </button>
  )
}

export default ParallaxScroll;
