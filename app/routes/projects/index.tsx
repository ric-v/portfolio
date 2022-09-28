import { useContext } from 'react'
import AppLayout from '~/components/layouts/AppLayout';
import Project from '~/components/Project';
import { ghContext } from '~/github-api/auth';

type Props = {}

const Index = (props: Props) => {
  const projects = useContext(ghContext)

  return (
    <AppLayout>
      <div className="flex flex-col justify-center items-center mt-24 mb-10">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-sky-300">Projects</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4 md:gap-6 overflow-y-scroll scrollbar-none">
        {projects.data.map((project: GithubRepoType, index: number) => (
          (!project?.fork) && <Project owner={project?.owner?.login} name={project?.name} key={index} />
        ))}
      </div>
    </AppLayout>
  )
}

export default Index;
