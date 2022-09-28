import React, { useContext } from 'react'
import { transition } from '~/theme/animate'
import { IoCloseSharp } from 'react-icons/io5'
import { ghContext } from '~/github-api/auth'
import { VscGlobe } from 'react-icons/vsc'
import { FaGithub } from 'react-icons/fa'
import { MdHttp } from 'react-icons/md'
import { HiTerminal } from 'react-icons/hi'
import { SiGo, SiTypescript, SiNextdotjs, SiMaterialui, SiJavascript, SiTailwindcss, SiCsswizardry, SiReact, SiRedux, SiDart, SiFlutter, SiPostgresql, SiMysql, SiGraphql, SiNodedotjs, SiHtml5, SiPhp, SiPython, SiMongodb, SiRust } from 'react-icons/si'
import ProgrammingLang from './ProgrammingLang'

type Props = {
  owner: string
  name: string
}

const Project = ({ owner, name }: Props) => {
  const projects = useContext(ghContext);
  const project = projects.data.find((project: GithubRepoType) => project.name === name && project.owner.login === owner) as GithubRepoType;
  const [expand, setExpand] = React.useState(false);

  return (
    <>
      <div className={`rounded-2xl text-center p-2 md:p-5 backdrop-blur-sm backdrop-brightness-95 hover:backdrop-brightness-75 cursor-pointer ${transition}`} onClick={() => setExpand(true)}>
        <div className={`flex flex-row justify-center my-5 absolute top-0 right-0 opacity-30 hover:opacity-100`}>
          <a href={project?.html_url} target='_blank' rel='noreferrer' className={` text-slate-700 drop-shadow-xl hover:text-slate-900 dark:text-sky-200 hover:dark:text-sky-400 hover:scale-110 mt-2 mx-2 ${transition}`} onClick={() => setExpand(false)}>
            <FaGithub size={28} />
          </a>
          {project?.homepage && <a href={project?.homepage} target='_blank' rel='noreferrer' className={` text-slate-700 drop-shadow-xl hover:text-slate-900 dark:text-sky-200 hover:dark:text-sky-400 hover:scale-110 mt-2 mx-2 ${transition}`} onClick={() => setExpand(false)}>
            <VscGlobe size={28} />
          </a>}
        </div>
        <h2 className="text-xs lg:text-lg text-amber-800 dark:text-orange-300 font-medium animate-pulse">{owner}</h2>
        <h1 className="text-md lg:text-2xl text-slate-800 dark:text-sky-300 font-bold uppercase">
          {name.replace(/[-_.]/g, ' ')}
        </h1>
        {/* <img className="w-32 h-32 rounded-xl mx-auto mt-4" src={`${project.owner?.avatar_url}&s=64`} alt="avatar" /> */}
        <p className="text-sm lg:text-xl text-slate-700 dark:text-sky-100 mt-2">
          {project?.description.length > 40 ? `${project?.description.slice(0, 40)}...` : project?.description}
        </p>
        <div className='flex flex-row flex-wrap justify-center text-center md:text-left mt-2 cursor-pointer'>
          <ProgrammingLang size={18} color='text-sky-500' programmingLang={['go', 'golang']} project={project} Icon={SiGo} />
          <ProgrammingLang size={18} color='text-indigo-500' programmingLang={['php']} project={project} Icon={SiPhp} />
          <ProgrammingLang size={18} color='text-green-600' programmingLang={['node']} project={project} Icon={SiNodedotjs} />
          <ProgrammingLang size={18} color='text-blue-700' programmingLang={['typescript', 'ts']} project={project} Icon={SiTypescript} />
          <ProgrammingLang size={18} color='text-yellow-500' programmingLang={['javascript', 'js']} project={project} Icon={SiJavascript} />
          <ProgrammingLang size={18} color='text-cyan-700' programmingLang={['react']} project={project} Icon={SiReact} />
          <ProgrammingLang size={18} color='text-black' programmingLang={['nextjs']} project={project} Icon={SiNextdotjs} />
          <ProgrammingLang size={18} color='text-purple-700' programmingLang={['redux']} project={project} Icon={SiRedux} />
          <ProgrammingLang size={18} color='text-sky-500' programmingLang={['mui', 'material']} project={project} Icon={SiMaterialui} />
          <ProgrammingLang size={18} color='text-sky-600' programmingLang={['tailwind']} project={project} Icon={SiTailwindcss} />
          <ProgrammingLang size={18} color='text-orange-600' programmingLang={['html']} project={project} Icon={SiHtml5} />
          <ProgrammingLang size={18} color='text-yellow-400' programmingLang={['css']} project={project} Icon={SiCsswizardry} />
          <ProgrammingLang size={18} color='text-rose-500' programmingLang={['graphql']} project={project} Icon={SiGraphql} />
          <ProgrammingLang size={18} color='text-black' programmingLang={['rest', 'http']} project={project} Icon={MdHttp} />
          <ProgrammingLang size={18} color='text-emerald-600' programmingLang={['python']} project={project} Icon={SiPython} />
          <ProgrammingLang size={18} color='text-stone-600' programmingLang={['rust']} project={project} Icon={SiRust} />
          <ProgrammingLang size={18} color='text-cyan-500' programmingLang={['dart']} project={project} Icon={SiDart} />
          <ProgrammingLang size={18} color='text-cyan-600' programmingLang={['flutter']} project={project} Icon={SiFlutter} />
          <ProgrammingLang size={18} color='text-blue-500' programmingLang={['postgres', 'pgsql', 'pl/pgsql']} project={project} Icon={SiPostgresql} />
          <ProgrammingLang size={18} color='text-orange-500' programmingLang={['mysql']} project={project} Icon={SiMysql} />
          <ProgrammingLang size={18} color='text-emerald-700' programmingLang={['mongo']} project={project} Icon={SiMongodb} />
          <ProgrammingLang size={18} color='text-black' programmingLang={['linux', 'terminal', 'shell', 'bash']} project={project} Icon={HiTerminal} />
        </div>
      </div>

      {expand && (
        <>
          <div className='fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center z-50 backdrop-blur-2xl backdrop-brightness-90'>
            <div className='rounded-2xl w-full md:w-1/2 p-2 md:p-10 mt-20 overflow-y-scroll scrollbar-thin'>
              <div className='text-center'>
                <div className='text-md md:text-xl text-amber-800 dark:text-orange-300 animate-pulse'>
                  {owner}
                </div>
                <div className='text-2xl md:text-3xl mt-2 font-bold text-slate-800 dark:text-sky-300'>
                  {name.replace(/[-_.]/g, ' ').toUpperCase()}
                </div>
                <div className='text-md md:text-xl mt-2 text-slate-700 dark:text-slate-300'>
                  {project.description}
                </div>
                <div className={`flex flex-row justify-center my-5`}>
                  <a href={project.html_url} target='_blank' rel='noreferrer' className={` text-slate-700 drop-shadow-xl hover:text-slate-900 dark:text-sky-200 hover:dark:text-sky-400 hover:scale-110 mt-2  mx-2 ${transition}`}>
                    <FaGithub size={32} />
                  </a>
                  {project.homepage && <a href={project.homepage} target='_blank' rel='noreferrer' className={` text-slate-700 drop-shadow-xl hover:text-slate-900 dark:text-sky-200 hover:dark:text-sky-400 hover:scale-110 mt-2  mx-2 ${transition}`}>
                    <VscGlobe size={32} />
                  </a>}
                </div>
                <div className='text-xs md:text-sm text-slate-600 dark:text-sky-300'>
                  updated: {project.updated_at ? new Date(project.updated_at).toLocaleDateString() : 'unknown'}
                </div>
              </div>
              <div className='flex flex-row flex-wrap justify-center text-center md:text-left mt-2'>
                {project.topics?.map((topic: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined, index: React.Key | null | undefined) => (
                  <span key={index} className={`text-sm md:text-md text-center text-slate-700 dark:text-slate-200 bg-sky-200 dark:bg-slate-700 hover:scale-125 rounded-full p-2 m-2 ${transition}`}>{topic}</span>
                ))}
              </div>
              <div className='flex flex-row flex-wrap justify-center text-center md:text-left mt-2 cursor-pointer'>
                <ProgrammingLang size={32} color={'text-sky-500'} programmingLang={['go', 'golang']} project={project} Icon={SiGo} />
                <ProgrammingLang size={32} color={'text-indigo-500'} programmingLang={['php']} project={project} Icon={SiPhp} />
                <ProgrammingLang size={32} color={'text-green-600'} programmingLang={['node']} project={project} Icon={SiNodedotjs} />
                <ProgrammingLang size={32} color={'text-blue-700'} programmingLang={['typescript', 'ts']} project={project} Icon={SiTypescript} />
                <ProgrammingLang size={32} color={'text-yellow-500'} programmingLang={['javascript', 'js']} project={project} Icon={SiJavascript} />
                <ProgrammingLang size={32} color={'text-cyan-700'} programmingLang={['react']} project={project} Icon={SiReact} />
                <ProgrammingLang size={32} color={'text-black'} programmingLang={['nextjs']} project={project} Icon={SiNextdotjs} />
                <ProgrammingLang size={32} color={'text-purple-700'} programmingLang={['redux']} project={project} Icon={SiRedux} />
                <ProgrammingLang size={32} color={'text-sky-500'} programmingLang={['mui', 'material']} project={project} Icon={SiMaterialui} />
                <ProgrammingLang size={32} color={'text-sky-600'} programmingLang={['tailwind']} project={project} Icon={SiTailwindcss} />
                <ProgrammingLang size={32} color={'text-orange-600'} programmingLang={['html']} project={project} Icon={SiHtml5} />
                <ProgrammingLang size={32} color={'text-yellow-400'} programmingLang={['css']} project={project} Icon={SiCsswizardry} />
                <ProgrammingLang size={32} color={'text-rose-500'} programmingLang={['graphql']} project={project} Icon={SiGraphql} />
                <ProgrammingLang size={32} color={'text-black'} programmingLang={['rest', 'http']} project={project} Icon={MdHttp} />
                <ProgrammingLang size={32} color={'text-emerald-600'} programmingLang={['python']} project={project} Icon={SiPython} />
                <ProgrammingLang size={32} color={'text-stone-600'} programmingLang={['rust']} project={project} Icon={SiRust} />
                <ProgrammingLang size={32} color={'text-cyan-500'} programmingLang={['dart']} project={project} Icon={SiDart} />
                <ProgrammingLang size={32} color={'text-cyan-600'} programmingLang={['flutter']} project={project} Icon={SiFlutter} />
                <ProgrammingLang size={32} color={'text-blue-500'} programmingLang={['postgres', 'pgsql', 'pl/pgsql']} project={project} Icon={SiPostgresql} />
                <ProgrammingLang size={32} color={'text-orange-500'} programmingLang={['mysql']} project={project} Icon={SiMysql} />
                <ProgrammingLang size={32} color={'text-emerald-700'} programmingLang={['mongo']} project={project} Icon={SiMongodb} />
                <ProgrammingLang size={32} color={'text-black'} programmingLang={['linux', 'terminal', 'shell', 'bash']} project={project} Icon={HiTerminal} />
              </div>
            </div>
            <button className={`px-3 py-3 rounded-full hover:backdrop-brightness-50 hover:scale-110 hover:bg-black hover:bg-opacity-40 animate-pulse hover:animate-none ${transition}`} onClick={() => setExpand(false)}>
              <IoCloseSharp size={32} />
            </button>
          </div>
        </>
      )}
    </>
  )
}

export default Project;
