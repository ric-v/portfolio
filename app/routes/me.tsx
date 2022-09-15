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
          <div className='bg-violet-700 bg-opacity-10 min-h-full'></div>
        </ParallaxLayer>
        <ParallaxLayer offset={1} speed={0} onClick={() => parallax.current.scrollTo(2)} >
          <div className='bg-sky-900 bg-opacity-20 min-h-full'></div>
        </ParallaxLayer>
        <ParallaxLayer offset={2} speed={0} onClick={() => parallax.current.scrollTo(3)} >
          <div className='bg-slate-800 bg-opacity-30 min-h-full'></div>
        </ParallaxLayer>
        <ParallaxLayer offset={3} speed={0} onClick={() => parallax.current.scrollTo(4)} >
          <div className='bg-slate-900 bg-opacity-20 min-h-full'></div>
        </ParallaxLayer>
        <ParallaxLayer offset={4} speed={0} onClick={() => parallax.current.scrollTo(5)} >
          <div className='bg-slate-900 bg-opacity-50 min-h-full'></div>
        </ParallaxLayer>
        <ParallaxLayer offset={5} speed={0} onClick={() => parallax.current.scrollTo(6)} >
          <div className='bg-slate-900 bg-opacity-70 min-h-full'></div>
        </ParallaxLayer>
        <ParallaxLayer offset={6} speed={0} onClick={() => parallax.current.scrollTo(0)} >
          <div className='bg-slate-900 bg-opacity-90 min-h-full'></div>
        </ParallaxLayer>
        {/* <ParallaxLayer offset={3} speed={0.5} style={{ backgroundColor: '#87BCDE' }} /> */}
      </Parallax>
    </AppLayout>
  )
}

export default Me;
