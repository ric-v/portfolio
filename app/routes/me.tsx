import { Link } from 'react-router-dom'
import AppLayout from '~/components/layouts/AppLayout'
import type { IParallax } from '@react-spring/parallax';
import { Parallax, ParallaxLayer } from '@react-spring/parallax'
import { useRef } from 'react';

type Props = {}

const Me = (props: Props) => {
  const parallax = useRef<IParallax>(null!)

  return (
    <AppLayout>
      <Parallax ref={parallax} pages={7} className='scrollbar-none'>
        <ParallaxLayer offset={0} speed={0} onClick={() => parallax.current.scrollTo(1)} >
          <div className='bg-amber-400 dark:bg-sky-500 bg-opacity-10 dark:bg-opacity-10 h-screen'></div>
        </ParallaxLayer>
        <ParallaxLayer offset={1} speed={0} onClick={() => parallax.current.scrollTo(2)} >
          <div className='bg-sky-200 dark:bg-sky-700 bg-opacity-20 dark:bg-opacity-20 h-screen'></div>
        </ParallaxLayer>
        <ParallaxLayer offset={2} speed={0} onClick={() => parallax.current.scrollTo(3)} >
          <div className='bg-sky-500 dark:bg-sky-900 bg-opacity-20 dark:bg-opacity-30 h-screen'></div>
        </ParallaxLayer>
        <ParallaxLayer offset={3} speed={0} onClick={() => parallax.current.scrollTo(4)} >
          <div className='bg-sky-700 dark:bg-slate-700 bg-opacity-20 dark:bg-opacity-20 h-screen'></div>
        </ParallaxLayer>
        <ParallaxLayer offset={4} speed={0} onClick={() => parallax.current.scrollTo(5)} >
          <div className='bg-amber-600 dark:bg-slate-900 bg-opacity-20 dark:bg-opacity-20 h-screen'></div>
        </ParallaxLayer>
        <ParallaxLayer offset={5} speed={0} onClick={() => parallax.current.scrollTo(6)} >
          <div className='bg-orange-800 dark:bg-zinc-900 bg-opacity-30 dark:bg-opacity-30 h-screen'></div>
        </ParallaxLayer>
        <ParallaxLayer offset={6} speed={0} onClick={() => parallax.current.scrollTo(0)} >
          <div className='bg-orange-900 dark:bg-zinc-900 bg-opacity-50 dark:bg-opacity-50 h-screen'></div>
        </ParallaxLayer>
      </Parallax>
    </AppLayout>
  )
}

export default Me;
