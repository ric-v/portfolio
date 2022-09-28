import { useRef } from "react";
import AppLayout from "~/components/layouts/AppLayout";
import type { IParallax } from '@react-spring/parallax';
import { Parallax, ParallaxLayer } from '@react-spring/parallax'
import { Link } from "react-router-dom";
import * as blogs from './blog/*.mdx'

export default function Index() {
  const parallax = useRef<IParallax>(null!)
  const url = (name: string, wrap = false) =>
    `${wrap ? 'url(' : ''}https://awv3node-homepage.surge.sh/build/assets/${name}.svg${wrap ? ')' : ''}`

  return (
    <AppLayout>
      <Parallax ref={parallax} pages={4} className='scrollbar-none'>
        <ParallaxLayer offset={0} speed={0} onClick={() => parallax.current.scrollTo(1)}>
          <div className="flex flex-col justify-center items-center h-screen text-2xl font-mono bg-amber-200  bg-opacity-20 dark:bg-sky-800 dark:bg-opacity-20">
            working on something cool!
          </div>
        </ParallaxLayer>
        <ParallaxLayer offset={1} speed={0} onClick={() => parallax.current.scrollTo(2)} >
          <div className="flex flex-col justify-center items-center h-screen text-2xl font-mono bg-cyan-800 bg-opacity-20 dark:bg-indigo-800 dark:bg-opacity-20">
            or, maybe not!
          </div>
        </ParallaxLayer>
        <ParallaxLayer offset={2} speed={0} onClick={() => parallax.current.scrollTo(3)} >
          <div className="flex flex-col justify-center items-center h-screen text-2xl font-mono bg-orange-700 bg-opacity-20 dark:bg-slate-800 dark:bg-opacity-20">
            definitely trying!
          </div>
        </ParallaxLayer>
        <ParallaxLayer offset={3} speed={0} onClick={() => parallax.current.scrollTo(0)} >
          <div className="flex flex-col justify-center items-center h-screen text-2xl font-mono bg-orange-900 bg-opacity-30 dark:bg-slate-800 dark:bg-opacity-30">
            <p>Meanwhile, Checkme out at useful links:</p>
            <div className="flex flex-col text-center text-sky-900 dark:text-amber-200 font-sans">
              <a href="https://github.com/ric-v/" rel="noreferrer" target={"_blank"} className='hover:text-sky-700 dark:hover:text-amber-400'>Github</a>
              <a href="https://www.linkedin.com/in/ric-v/" rel="noreferrer" target={"_blank"} className='hover:text-sky-700 dark:hover:text-amber-400'>Linkedin</a>
              <Link to="/me" className='hover:text-sky-700 dark:hover:text-amber-400'>About me</Link>
            </div>
          </div>
        </ParallaxLayer>

        {/* 
        <ParallaxLayer offset={1.3} speed={-0.3} style={{ pointerEvents: 'none' }}>
          <img src={url('satellite4')} style={{ width: '15%', marginLeft: '70%' }} />
        </ParallaxLayer>

        <ParallaxLayer offset={1} speed={0.8} style={{ opacity: 0.1 }}>
          <img src={url('cloud')} style={{ display: 'block', width: '20%', marginLeft: '55%' }} />
          <img src={url('cloud')} style={{ display: 'block', width: '10%', marginLeft: '15%' }} />
        </ParallaxLayer>

        <ParallaxLayer offset={1.75} speed={0.5} style={{ opacity: 0.1 }}>
          <img src={url('cloud')} style={{ display: 'block', width: '20%', marginLeft: '70%' }} />
          <img src={url('cloud')} style={{ display: 'block', width: '20%', marginLeft: '40%' }} />
        </ParallaxLayer>

        <ParallaxLayer offset={1} speed={0.2} style={{ opacity: 0.2 }}>
          <img src={url('cloud')} style={{ display: 'block', width: '10%', marginLeft: '10%' }} />
          <img src={url('cloud')} style={{ display: 'block', width: '20%', marginLeft: '75%' }} />
        </ParallaxLayer>

        <ParallaxLayer offset={1.6} speed={-0.1} style={{ opacity: 0.4 }}>
          <img src={url('cloud')} style={{ display: 'block', width: '20%', marginLeft: '60%' }} />
          <img src={url('cloud')} style={{ display: 'block', width: '25%', marginLeft: '30%' }} />
          <img src={url('cloud')} style={{ display: 'block', width: '10%', marginLeft: '80%' }} />
        </ParallaxLayer>

        <ParallaxLayer offset={2.6} speed={0.4} style={{ opacity: 0.6 }}>
          <img src={url('cloud')} style={{ display: 'block', width: '20%', marginLeft: '5%' }} />
          <img src={url('cloud')} style={{ display: 'block', width: '15%', marginLeft: '75%' }} />
        </ParallaxLayer>

        <ParallaxLayer
          offset={3.5}
          speed={-0.4}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}>
          <img src={url('earth')} style={{ width: '30%' }} />
        </ParallaxLayer>

        <ParallaxLayer
          offset={2}
          speed={-0.3}
          style={{
            backgroundSize: '80%',
            backgroundPosition: 'center',
            backgroundImage: url('clients', true),
          }}
        />

        <ParallaxLayer
          offset={0}
          speed={0.1}
          onClick={() => parallax.current.scrollTo(1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <img src={url('server')} style={{ width: '20%' }} />
        </ParallaxLayer>

        <ParallaxLayer
          offset={1}
          speed={0.1}
          onClick={() => parallax.current.scrollTo(2)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <img src={url('bash')} style={{ width: '20%' }} />
        </ParallaxLayer>

        <ParallaxLayer
          offset={2}
          speed={-0}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => parallax.current.scrollTo(0)}>
          <img src={url('clients-main')} style={{ width: '20%' }} />
        </ParallaxLayer> */}
      </Parallax>
    </AppLayout>
  );
}
