import { SiGithub } from "react-icons/si";
import { FiExternalLink } from "react-icons/fi";
import Link from "next/link";

type Props = {
  repos: GithubRepoType[];
};

const Projects = ({ repos }: Props) => {
  repos = repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
  // get 1st 6 repos
  repos = repos.slice(0, 6);

  // get screen size - xs or md
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  isMobile && repos.splice(3, repos.length - 2);

  return (
    <div className='flex flex-row justify-center mt-20'>
      <div className='flex flex-col justify-center'>
        <h1 className='text-2xl md:text-4xl font-bold text-slate-900 dark:text-sky-500 text-center mb-6 md:mb-12'>
          Personal Projects
        </h1>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 md:px-4'>
          {repos.map(
            (repo, i) =>
              !repo.fork && (
                <div
                  key={i}
                  className='bg-amber-100 dark:bg-slate-900 bg-opacity-10 hover:bg-opacity-30 scale-90 hover:scale-100 
                dark:bg-opacity-10 dark:hover:bg-opacity-60 p-3 py-5 h-auto my-3 rounded-xl backdrop-blur-sm shadow-2xl hover:shadow-5xl
                transition-all duration-2000 border-b-2 border-l-2 border-opacity-50 border-slate-500 dark:border-slate-700'>
                  <p className='text-slate-800 dark:text-sky-400 text-center font-bold text-lg md:text-xl p-2 overflow-clip'>
                    {repo.name.replace(/-/g, " ").replace(/_/g, " ")}
                  </p>
                  <p className='text-slate-900 dark:text-slate-400 text-center text-sm md:text-md overflow-clip'>
                    {repo.description.slice(0, 100)}
                    {repo.description.length > 100 && "..."}
                  </p>
                  {/* topics */}
                  <div className='flex flex-row justify-center mt-2'>
                    {repo.topics.map((topic, i) =>
                      i > 2 ? null : (
                        <div
                          key={i}
                          className='rounded-full p-1 px-2 mx-2 transition-all duration-1000
                          bg-slate-700 dark:bg-slate-700 bg-opacity-10 hover:scale-110'>
                          <p className='text-slate-600 dark:text-sky-400 text-center text-sm md:text-md overflow-clip'>
                            {topic}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                  {/* buttons */}
                  <div className='flex flex-row justify-center mt-4 px-5'>
                    <a
                      href={repo.html_url}
                      target='_blank'
                      rel='noreferrer'
                      className='text-slate-600 dark:text-slate-400 text-center text-md md:text-2xl overflow-clip mx-2'>
                      <SiGithub />
                    </a>

                    {repo.homepage && (
                      <a
                        href={repo.homepage}
                        target='_blank'
                        rel='noreferrer'
                        className='text-slate-500 dark:text-slate-400 text-center text-md md:text-2xl overflow-clip mx-2'>
                        <FiExternalLink />
                      </a>
                    )}
                  </div>
                </div>
              ),
          )}
        </div>
        {/* see more */}
        <div className='flex flex-row justify-center mt-12'>
          <Link
            href='/projects'
            className='text-slate-800 dark:text-slate-300 text-center text-lg overflow-clip transition-all 
                      hover:scale-110 hover:underline hover:underline-offset-4 hover:text-indigo-700'>
            See more...
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Projects;
