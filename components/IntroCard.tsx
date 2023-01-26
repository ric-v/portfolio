import React from 'react'
import Image from 'next/image'
import Typewriter from 'typewriter-effect';
import { TiLocationArrow } from 'react-icons/ti';
import { GithubUserType } from '@/store/github_api';
import { VscGithubInverted } from "react-icons/vsc";
import { GrLinkedinOption } from "react-icons/gr";
import { AiFillFilePdf, AiFillMediumSquare } from "react-icons/ai";
import { BiCodeCurly } from "react-icons/bi";
import { SiLeetcode } from 'react-icons/si'

type Props = {
  user: GithubUserType;
}

const IntroCard = ({ user }: Props) => {
  return (
    <>
      {/* card */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-1 scale-90 hover:scale-100 transition-all duration-1000">
        <div className="col-span-3 h-20 md:col-span-1" />
        <div className="col-span-3 md:col-span-2 bg-amber-400 dark:bg-sky-500 bg-opacity-10 '
            dark:bg-opacity-10 h-auto p-5 md:p-20 rounded-3xl backdrop-blur-sm shadow-2xl -rotate-6 m-5">
          <Image
            loader={({ src }: { src: string; }) => `${src}`}
            src={user.avatar_url}
            alt="profile"
            width={200}
            height={200}
            className={
              `rounded-full w-40 h-40 z-70 drop-shadow-xl absolute top-1.5 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                  grayscale border-slate-400 border-spacing-16 border-8 opacity-90 contrast-125 brightness-100
                  hover:scale-150 transition-all duration-1000`
            }
          />
          <div className="h-full w-full mt-5 flex flex-col justify-center items-center">

            {/* user name and salutation */}
            <div className="mt-2 font-sans text-3xl md:text-4xl font-medium text-center text-slate-700 
                dark:text-sky-300 drop-shadow-xl animate-pulse hover:animate-none hover:scale-110 transition-all duration-1000">
              <div className='mt-5 font-display text-sm md:text-md font-medium text-center 
                  text-slate-500 dark:text-sky-200 drop-shadow-xl'
              >
                Hey, this is
              </div>
              <Typewriter
                onInit={(typewriter) => {
                  typewriter.pasteString(`${user.name} 🖖`, null).start();
                }}
              />
            </div>

            {/* user designation */}
            <div className='mt-5 font-mono text-md md:text-lg font-medium italic text-center 
                  text-slate-500 dark:text-sky-200 drop-shadow-xl hover:scale-125 transition-all duration-1000'>
              <Typewriter
                onInit={(typewriter) => {
                  typewriter.typeString('Full Stack Developer').pauseFor(1000).deleteAll()
                    .typeString('Golang Developer').pauseFor(1000).deleteAll()
                    .typeString('Rust Developer').pauseFor(1000).deleteAll()
                    .typeString('C/C++ Developer').pauseFor(1000).deleteAll()
                    .typeString('React.js / Next.js Developer').pauseFor(1000).deleteAll()
                    .typeString('Flutter / Dart Mobile Applications').pauseFor(1000).deleteAll()
                    .typeString('SQL / Pl/pgSQL Database Administration').pauseFor(1000).deleteAll()
                    .typeString('Bash / Shell Scripting').pauseFor(1000).deleteAll()
                    .start();
                }}
                options={{
                  autoStart: true,
                  loop: true,
                }}
              />
            </div>

            {/* user location */}
            <div className="mt-5 font-sans text-md md:text-xl font-medium text-center text-slate-700
                dark:text-sky-300 drop-shadow-xl hover:scale-110 transition-all animate-pulse hover:animate-none duration-1000
                flex flex-row justify-center">
              <TiLocationArrow size={30} className='text-slate-500 dark:text-sky-200 mr-4' />
              {user.location}
            </div>
          </div>
        </div>
      </div>

      {/* social links */}
      <div className="mt-14 md:px-10 grid grid-cols-3 md:grid-cols-6 gap-4 text-sm md:text-xl font-bold">
        <a
          className={`col-span-1 flex flex-row justify-center py-2 
              rounded-2xl text-slate-600 hover:text-slate-800
              dark:text-slate-400 dark:hover:text-slate-200 hover:scale-125 transition-all duration-1000`}
          href="https://github.com/ric-v"
          target={"_blank"}
          rel={"noreferrer"}
        >
          <VscGithubInverted className="text-2xl drop-shadow-xl hover:scale-125 transition-transform duration-1000" />
          <span className="ml-4 md:inline text-md">Github</span>
        </a>
        <a
          className={`col-span-1 flex flex-row justify-center py-2 
              rounded-2xl text-slate-600 hover:text-sky-700 dark:text-slate-400
              dark:hover:text-sky-500 hover:scale-125 transition-all duration-1000`}
          href="https://www.linkedin.com/in/ric-v/"
          target={"_blank"}
          rel={"noreferrer"}
        >
          <GrLinkedinOption className="text-2xl drop-shadow-xl hover:scale-125 transition-transform duration-1000" />
          <span className="ml-4 md:inline text-md">LinkedIn</span>
        </a>
        <a
          className={`col-span-1 flex flex-row justify-center py-2 
              rounded-2xl text-slate-600 hover:text-yellow-700 dark:text-slate-400
              dark:hover:text-yellow-400 hover:scale-125 transition-all duration-1000`}
          href="https://medium.com/@astrx-dev"
          target={"_blank"}
          rel={"noreferrer"}
        >
          <AiFillMediumSquare className="text-2xl drop-shadow-xl hover:scale-125 transition-transform duration-1000" />
          <span className="ml-4  md:inline text-md">Medium</span>
        </a>
        <a
          className={`col-span-1 flex flex-row justify-center py-2 
              rounded-2xl text-slate-600 hover:text-purple-500 dark:text-slate-400
              dark:hover:text-purple-400 hover:scale-125 transition-all duration-1000`}
          href="https://exercism.org/profiles/ric-v"
          target={"_blank"}
          rel={"noreferrer"}
        >
          <BiCodeCurly className="text-2xl drop-shadow-xl hover:scale-125 transition-transform duration-1000" />
          <span className="ml-4  md:inline text-md">Exercism</span>
        </a>
        <a
          className={`col-span-1 flex flex-row justify-center py-2 
              rounded-2xl text-slate-600 hover:text-orange-400 dark:text-slate-400
              dark:hover:text-orange-400 hover:scale-125 transition-all duration-1000`}
          href="https://leetcode.com/ric-v/"
          target={"_blank"}
          rel={"noreferrer"}
        >
          <SiLeetcode className="text-2xl drop-shadow-xl hover:scale-125 transition-transform duration-1000" />
          <span className="ml-4  md:inline text-md">Leetcode</span>
        </a>
        <a
          className={`col-span-1 flex flex-row justify-center py-2 
              rounded-2xl text-slate-600 hover:text-red-700 dark:text-slate-400
              dark:hover:text-red-400 hover:scale-125 transition-all duration-1000`}
          href="https://drive.google.com/file/d/1-34NxUJF_Fj6-s4vUZVZIjIVO0VD-WX9/view?usp=sharing"
          target={"_blank"}
          rel={"noreferrer"}
        >
          <AiFillFilePdf className="text-2xl drop-shadow-xl hover:scale-125 transition-transform duration-1000" />
          <span className="ml-4  md:inline text-md">Résumé</span>
        </a>
      </div>
    </>
  )
}

export default IntroCard;
