import React, { useContext } from 'react'
import { transition } from '~/theme/animate'
import { IoCloseSharp } from 'react-icons/io5'
import { ghContext } from '~/github-api/auth'
import { VscGlobe } from 'react-icons/vsc'
import { FaGithub } from 'react-icons/fa'
import { MdHttp } from 'react-icons/md'
import { HiTerminal } from 'react-icons/hi'
import { SiGo, SiTypescript, SiNextdotjs, SiMaterialui, SiJavascript, SiTailwindcss, SiCsswizardry, SiReact, SiRedux, SiDart, SiFlutter, SiPostgresql, SiMysql, SiGraphql, SiNodedotjs, SiHtml5, SiPhp, SiPython, SiMongodb } from 'react-icons/si'

type Props = {
  owner: string
  name: string
}

const Project = ({ owner, name }: Props) => {
  const projects = useContext(ghContext);
  const project = projects.data.find((project: GithubRepoType) => project.name === name && project.owner.login === owner) as GithubRepoType;
  const [expand, setExpand] = React.useState(false);

  const findLang = (lang: string) => {
    return project.topics.find((topic: string) => topic.toLowerCase().includes(lang))
  }

  return (
    <>
      <div className={`rounded-2xl text-center p-2 backdrop-blur-sm backdrop-brightness-95 hover:scale-110 hover:backdrop-brightness-90 cursor-pointer ${transition}`} onClick={() => setExpand(true)}>
        <h2 className="text-xs lg:text-lg text-amber-800 dark:text-orange-300 font-medium animate-pulse">{owner}</h2>
        <h1 className="text-md lg:text-2xl text-slate-800 dark:text-sky-300 font-bold uppercase">{name}</h1>
        {/* <img className="w-32 h-32 rounded-xl mx-auto mt-4" src={`${project.owner?.avatar_url}&s=64`} alt="avatar" /> */}
        <p className="text-sm lg:text-xl text-slate-700 dark:text-sky-100 mt-2">{project?.description}</p>
      </div>

      {expand && (
        <>
          <div className='fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center z-50 backdrop-blur-2xl backdrop-brightness-90'>
            <div className='rounded-2xl p-2 md:p-10 mt-20 overflow-y-scroll scrollbar-thin'>
              <div className='text-center'>
                <div className='text-md md:text-xl text-amber-800 dark:text-orange-300 animate-pulse'>
                  {owner}
                </div>
                <div className='text-2xl md:text-3xl mt-2 font-bold text-slate-800 dark:text-sky-300'>
                  {name}
                </div>
                <div className='text-md md:text-xl mt-2 text-slate-700 dark:text-slate-300'>
                  {project.description}
                </div>
                <div className='text-md md:text-xl text-slate-600 dark:text-sky-300'>
                  updated: {project.updated_at ? new Date(project.updated_at).toLocaleDateString() : 'unknown'}
                </div>
                <div className='flex flex-row justify-center items-center mt-4'>
                  {project.language && (
                    <div className='text-xs md:text-sm text-slate-600 dark:text-sky-300'>
                      Languages Used: {project.language}
                    </div>
                  )}
                </div>
                <div className={`flex flex-row justify-center my-5`}>
                  <a href={project.html_url} target='_blank' rel='noreferrer' className={` text-slate-700 hover:text-slate-900 dark:text-sky-200 hover:dark:text-sky-400 hover:scale-110 mt-2  mx-2 ${transition}`}>
                    <FaGithub size={32} />
                  </a>
                  {project.homepage && <a href={project.homepage} target='_blank' rel='noreferrer' className={` text-slate-700 hover:text-slate-900 dark:text-sky-200 hover:dark:text-sky-400 hover:scale-110 mt-2  mx-2 ${transition}`}>
                    <VscGlobe size={32} />
                  </a>}
                </div>
              </div>
              <div className='flex flex-row flex-wrap justify-center text-center md:text-left mt-2'>
                {project.topics?.map((topic: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined, index: React.Key | null | undefined) => (
                  <span key={index} className={`text-sm md:text-md text-center text-slate-700 dark:text-slate-200 bg-sky-200 dark:bg-slate-700 hover:scale-125 rounded-full p-2 m-2 ${transition}`}>{topic}</span>
                ))}
              </div>
              <div className='flex flex-row flex-wrap justify-center text-center md:text-left mt-2'>
                {(findLang('go') || findLang('golang')) && (<SiGo size={32} className='mx-2' />)}
                {(findLang('node')) && (<SiNodedotjs size={32} className='mx-2' />)}
                {(findLang('php')) && (<SiPhp size={32} className='mx-2' />)}
                {(findLang('ts') || findLang('typescript')) && (<SiTypescript size={32} className='mx-2' />)}
                {(findLang('js') || findLang('javascript')) && (<SiJavascript size={32} className='mx-2' />)}
                {(findLang('react')) && (<SiReact size={32} className='mx-2' />)}
                {(findLang('nextjs')) && (<SiNextdotjs size={32} className='mx-2' />)}
                {(findLang('redux')) && (<SiRedux size={32} className='mx-2' />)}
                {(findLang('mui') || findLang('material')) && (<SiMaterialui size={32} className='mx-2' />)}
                {(findLang('tailwind')) && (<SiTailwindcss size={32} className='mx-2' />)}
                {(findLang('html')) && (<SiHtml5 size={32} className='mx-2' />)}
                {(findLang('css')) && (<SiCsswizardry size={32} className='mx-2' />)}
                {(findLang('graphql') || findLang('gql')) && (<SiGraphql size={32} className='mx-2' />)}
                {(findLang('rest') || findLang('http')) && (<MdHttp size={32} className='mx-2' />)}
                {(findLang('python')) && (<SiPython size={32} className='mx-2' />)}
                {(findLang('dart')) && (<SiDart size={32} className='mx-2' />)}
                {(findLang('flutter')) && (<SiFlutter size={32} className='mx-2' />)}
                {(findLang('postgres') || findLang('pgsql') || (findLang('pl/pgsql'))) && (<SiPostgresql size={32} className='mx-2' />)}
                {(findLang('mysql')) && (<SiMysql size={32} className='mx-2' />)}
                {(findLang('mongo')) && (<SiMongodb size={32} className='mx-2' />)}
                {(findLang('linux') || findLang('terminal') || findLang('shell') || findLang('bash')) && (<HiTerminal size={32} className='mx-2' />)}
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
