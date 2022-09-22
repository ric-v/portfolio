import AppLayout from "~/components/layouts/AppLayout";
import type { IParallax } from "@react-spring/parallax";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import { useEffect, useRef, useState } from "react";
import { VscGithubInverted } from "react-icons/vsc";
import { GrLinkedinOption } from 'react-icons/gr';
import { AiFillFilePdf } from 'react-icons/ai';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import { transition } from "~/theme/animate";
import Timeline from "~/components/Timeline";

type Props = {};

const Me = (props: Props) => {
  const parallax = useRef<IParallax>(null!);

  return (
    <AppLayout>
      <Parallax ref={parallax} pages={7} className="scrollbar-none">
        {/* {Intro(parallax)} */}

        {Experience(parallax)}

        {Projects(parallax)}

        {Skills(parallax)}

        <ParallaxLayer
          offset={4}
          speed={0}
          className="bg-amber-600 dark:bg-slate-900 bg-opacity-20 dark:bg-opacity-20 h-screen flex flex-col justify-center px-2"
          onClick={() => parallax.current.scrollTo(5)}
        />
        <ParallaxLayer
          offset={5}
          speed={0}
          className="bg-orange-800 dark:bg-zinc-900 bg-opacity-30 dark:bg-opacity-30 h-screen flex flex-col justify-center px-2"
          onClick={() => parallax.current.scrollTo(6)}
        />
        <ParallaxLayer
          offset={6}
          speed={0}
          className="bg-orange-900 dark:bg-zinc-900 bg-opacity-50 dark:bg-opacity-50 h-screen flex flex-col justify-center px-2"
          onClick={() => parallax.current.scrollTo(0)}
        >
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-5">
            <div className="bg-black rounded-xl p-2">01</div>
            <div className="bg-black rounded-xl p-2">02</div>
            <div className="bg-black rounded-xl p-2">03</div>
            <div className="col-span-2 rounded-xl bg-black p-2">04</div>
            <div className="bg-black rounded-xl p-2">05</div>
            <div className="bg-black rounded-xl p-2">06</div>
            <div className="col-span-2 rounded-xl bg-black p-2">07</div>
            <div className="bg-black rounded-xl p-2">08</div>
            <div className="bg-black rounded-xl p-2">09</div>
            <div className="bg-black rounded-xl p-2">10</div>
          </div>
        </ParallaxLayer>
      </Parallax>
    </AppLayout >
  );
};

export default Me;

const Intro = (parallax: React.MutableRefObject<IParallax>) => {
  return (
    <>
      <ParallaxLayer
        offset={0}
        speed={1}
        className="bg-amber-400 dark:bg-sky-500 bg-opacity-10 dark:bg-opacity-10 h-screen flex flex-col justify-center px-2"
      // onClick={() => parallax.current.scrollTo(1)}
      />
      <ParallaxLayer
        offset={-0.1}
        speed={0}
        className="h-screen flex flex-col justify-center px-2"
      // onClick={() => parallax.current.scrollTo(1)}
      >
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          <div className="col-span-3 h-20 md:col-span-2" />
          <div className="col-span-3 md:col-span-2 bg-amber-400 dark:bg-sky-500 bg-opacity-10 dark:bg-opacity-10 h-64 rounded-3xl backdrop-blur-sm shadow-2xl -rotate-6 m-5">
            <div className="h-full w-full flex flex-col justify-center items-center">
              <div className="text-2xl font-medium text-center text-slate-700 dark:text-sky-300">
                Hi, this is <span className="font-bold">Richie</span> 👋, a <span className={`font-bold`}>Full Stack Engineer</span> from Bengaluru, India.
              </div>
            </div>
          </div>
        </div>
      </ParallaxLayer>
      <ParallaxLayer
        offset={0.3}
        speed={2}
        className="flex flex-col justify-center px-2"
      // onClick={() => parallax.current.scrollTo(1)}
      >
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4 text-lg font-bold">
          <div className="col-span-3 md:col-span-1" />
          <a
            className={`col-span-3 md:col-span-1 flex flex-row justify-center py-2 backdrop-blur-sm rounded-2xl hover:shadow-2xl text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-all duration-1000`}
            href="https://github.com/ric-v" target={'_blank'} rel={'noreferrer'}
          >
            <span className="mr-2">Github</span>
            <VscGithubInverted size={32} />
          </a>
          <a
            className={`col-span-3 md:col-span-1 flex flex-row justify-center py-2 backdrop-blur-sm rounded-2xl hover:shadow-2xl text-slate-600 hover:text-sky-700 dark:text-slate-400 dark:hover:text-sky-500 transition-all duration-1000`}
            href="https://www.linkedin.com/in/ric-v/" target={'_blank'} rel={'noreferrer'}
          >
            <span className="mr-2">LinkedIn</span>
            <GrLinkedinOption size={32} />
          </a>
          <a
            className={`col-span-3 md:col-span-1 flex flex-row justify-center py-2 backdrop-blur-sm rounded-2xl hover:shadow-2xl text-slate-600 hover:text-red-700 dark:text-slate-400 dark:hover:text-red-400 transition-all duration-1000`}
            href="https://drive.google.com/file/d/1-34NxUJF_Fj6-s4vUZVZIjIVO0VD-WX9/view?usp=sharing" target={'_blank'} rel={'noreferrer'}
          >
            <span className="mr-2">Resume</span>
            <AiFillFilePdf size={32} />
          </a>
        </div>
      </ParallaxLayer>
    </>
  )
}

const Experience = (parallax: React.MutableRefObject<IParallax>) => {
  return (
    <>
      <ParallaxLayer
        offset={0}
        speed={0}
        className="bg-sky-200 dark:bg-sky-700 bg-opacity-20 dark:bg-opacity-20 h-screen flex flex-col justify-center px-2"
        onClick={() => parallax.current.scrollTo(2)}
      />
      <ParallaxLayer
        offset={-0.1}
        speed={0}
        className="h-screen flex flex-col justify-center mt-28 px-2"
      >
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
          <Timeline duration="Jun 2018 - May 2021" title="Software Developer L2" company="Algomox Pvt. Ltd." desc="An employee since start of the company. Worked on 2 major platform building cycle and most of the back-end server development. Associated with chief engineer to architect and design solutions based on the platforms. Had the opportunity to build servers from scratch, design them, document and debug the applications." key='1' />
          <Timeline duration="Jun 2021 - Sept 2022" title='Engineer - Software Development' company="Schnell Digital Technologies" desc='Worked as part of the initial team for building PBM engine for processing real-time pharmacy claims request for clients at high scale and high volume. Primarily worked on the processing engine with concurrent processing and adjudication capabilities based on business rules.' key='2' />
          <Timeline duration="Oct 2022 - Preset" title="Senior Engineer - Software Development" company="Schnell Digital Technologies" desc='Worked on the PBM claim processing engine for high scale and high volume pharmacy requests from clients. Worked on integration with external switch providers for managing the entire lifecycle of claims and their processing.' />
        </div>
      </ParallaxLayer>
    </>
  )
}

const Projects = (parallax: React.MutableRefObject<IParallax>) => {
  return (
    <>
      <ParallaxLayer
        offset={2}
        speed={0}
        className="bg-sky-500 dark:bg-sky-900 bg-opacity-20 dark:bg-opacity-30 h-screen flex flex-col justify-center px-2"
        onClick={() => parallax.current.scrollTo(3)}
      />
      <ParallaxLayer
        offset={1.9}
        speed={0}
        className="h-screen flex flex-col justify-center px-2"
        onClick={() => parallax.current.scrollTo(3)}
      >
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          <div className="col-span-3 h-20 md:col-span-2" />

        </div>
      </ParallaxLayer>
      <ParallaxLayer
        offset={1.9}
        speed={0}
        className="h-screen flex flex-col justify-end px-2"
      >
        <div className="grid grid-cols-12 md:grid-cols-12 gap-4">
          <div className="col-span-10 md:col-span-11" />
          <div className="col-span-2 md:col-span-1 cursor-pointer" onClick={() => parallax.current.scrollTo(1)}>
            <IoIosArrowUp className="text-4xl text-slate-700 dark:text-sky-300 animate-bounce" />
          </div>
        </div>
        <div className="grid grid-cols-12 md:grid-cols-12 gap-4">
          <div className="col-span-10 md:col-span-11" />
          <div className="col-span-2 md:col-span-1 cursor-pointer" onClick={() => parallax.current.scrollTo(3)}>
            <IoIosArrowDown className="text-4xl text-slate-700 dark:text-sky-300 animate-bounce" />
          </div>
        </div>
      </ParallaxLayer>
    </>
  )
}

const Skills = (parallax: React.MutableRefObject<IParallax>) => {
  return (
    <>
      <ParallaxLayer
        offset={3}
        speed={0}
        className="bg-sky-700 dark:bg-slate-700 bg-opacity-20 dark:bg-opacity-40 h-screen flex flex-col justify-center px-2"
        onClick={() => parallax.current.scrollTo(4)}
      />
      <ParallaxLayer
        offset={2.9}
        speed={0}
        className="h-screen flex flex-col justify-center px-2"
        onClick={() => parallax.current.scrollTo(4)}
      >
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          <div className="col-span-3 h-20 md:col-span-2" />

        </div>
      </ParallaxLayer>
      <ParallaxLayer
        offset={2.9}
        speed={0}
        className="h-screen flex flex-col justify-end px-2"
      >
        <div className="grid grid-cols-12 md:grid-cols-12 gap-4">
          <div className="col-span-10 md:col-span-11" />
          <div className="col-span-2 md:col-span-1 cursor-pointer" onClick={() => parallax.current.scrollTo(2)}>
            <IoIosArrowUp className="text-4xl text-slate-700 dark:text-sky-300 animate-bounce" />
          </div>
        </div>
        <div className="grid grid-cols-12 md:grid-cols-12 gap-4">
          <div className="col-span-10 md:col-span-11" />
          <div className="col-span-2 md:col-span-1 cursor-pointer" onClick={() => parallax.current.scrollTo(4)}>
            <IoIosArrowDown className="text-4xl text-slate-700 dark:text-sky-300 animate-bounce" />
          </div>
        </div>
      </ParallaxLayer>
    </>
  )
}
