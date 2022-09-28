import React, { useEffect } from 'react'
import { transition } from '~/theme/animate'
import { IoCloseSharp } from 'react-icons/io5'

type Props = {
  owner: string
  name: string
}

const Project = ({ owner, name }: Props) => {
  const [project, setProject] = React.useState(null)
  const [expand, setExpand] = React.useState(false)

  // fetch data from GitHub API here
  useEffect(() => {
    console.log(`Fetching data for ${owner}/${name}`)
    fetch(`https://api.github.com/repos/${owner}/${name}`)
      .then(response => response.json())
      .then(data => setProject(data))
  }, [owner, name])

  return (
    <>
      <div className={`rounded-2xl text-center p-2 backdrop-blur-sm backdrop-brightness-95 hover:scale-110 hover:backdrop-brightness-90 cursor-pointer ${transition}`} onClick={() => setExpand(true)}>
        <h2 className="text-xs lg:text-lg text-amber-800 dark:text-orange-300 font-medium animate-pulse">{owner}</h2>
        <h1 className="text-md lg:text-2xl text-slate-800 dark:text-sky-300 font-bold uppercase">{name}</h1>
        {/* <img className="w-32 h-32 rounded-xl mx-auto mt-4" src={`${project?.owner?.avatar_url}&s=64`} alt="avatar" /> */}
        <p className="text-sm lg:text-xl text-slate-700 dark:text-sky-100 mt-2">{project?.description}</p>
      </div>

      {expand && (
        <></>
      )}
    </>
  )
}

export default Project;
