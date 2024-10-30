import Layout from "@/components/Layout";
import { GithubCtx } from "@/store/github_api";
import { useContext, useEffect, useState } from "react";
import { SiGithub } from "react-icons/si";
import { FiExternalLink, FiX } from "react-icons/fi";
import { button } from "leva";

type Props = {};

const Projects = (props: Props) => {
  const github = useContext(GithubCtx);
  const repos = github.repos.sort(
    (a, b) => b.stargazers_count - a.stargazers_count,
  );

  const [selectedRepo, setSelectedRepo] = useState({} as GithubRepoType);

  return (
    <Layout navbarTitle={github.user.name}>
      <h1 className='text-2xl md:text-4xl font-bold text-slate-700 dark:text-sky-500 underline text-center mb-6 md:mb-12 mt-32'>
        Personal Projects
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-4 md:px-12 mt-64'>
        {repos.map((repo, i) => (
          <div
            key={i}
            className='bg-slate-400 dark:bg-slate-500 bg-opacity-10 hover:bg-opacity-30 cursor-pointer
                dark:bg-opacity-10 dark:hover:bg-opacity-60 p-3 py-5 h-auto my-3 rounded-xl backdrop-blur-sm shadow-xl hover:shadow-4xl
                transition-all duration-1000 border-b-2 border-l-2 border-opacity-10 border-slate-500 dark:border-slate-700'
            onClick={() => setSelectedRepo(repo)}>
            <p className='text-slate-800 dark:text-sky-500 text-center font-bold text-lg md:text-xl p-2 overflow-clip'>
              {repo.name.replace(/-/g, " ").replace(/_/g, " ").toUpperCase()}
            </p>
            <p className='text-slate-900 dark:text-slate-300 text-center text-sm md:text-md overflow-clip'>
              {repo.description}
            </p>
            {/* topics */}
            <div className='flex flex-row justify-center mt-4'>
              {repo.topics.map((topic, i) =>
                i > 2 ? null : (
                  <div
                    key={i}
                    className='rounded-full p-1 px-2 mx-2 transition-all duration-1000
                          bg-slate-700 dark:bg-slate-700 bg-opacity-10 hover:scale-110'>
                    <p className='text-slate-700 dark:text-sky-400 text-center text-sm md:text-md overflow-clip'>
                      {topic}
                    </p>
                  </div>
                ),
              )}
            </div>
            {/* links */}
            <div className='flex flex-row justify-center mt-5 text-2xl'>
              <a
                href={repo.html_url}
                target='_blank'
                rel='noreferrer'
                className='rounded-full p-1 px-2 mx-2 transition-all duration-1000 text-slate-700 dark:text-slate-200'>
                <SiGithub />
              </a>
              {repo.homepage && (
                <a
                  href={repo.homepage}
                  target='_blank'
                  rel='noreferrer'
                  className='rounded-full p-1 px-2 mx-2 transition-all duration-1000 text-slate-700 dark:text-slate-200'>
                  <FiExternalLink />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedRepo.name && (
        // modal for repo details
        <div
          className='fixed top-0 left-0 w-full h-full bg-slate-400 dark:bg-slate-700 bg-opacity-10 dark:bg-opacity-10 backdrop-blur-xl z-100'
          onClick={() => setSelectedRepo({} as GithubRepoType)}>
          <div className='flex flex-col justify-center items-center h-full'>
            <div className='rounded-xl p-4'>
              <div className='flex flex-row justify-center items-center'>
                <p className='text-slate-900 underline underline-offset-4 dark:text-sky-400 font-bold text-xl md:text-4xl p-2 overflow-clip'>
                  {selectedRepo.name
                    .replace(/-/g, " ")
                    .replace(/_/g, " ")
                    .toUpperCase()}
                </p>
              </div>
              <div className='flex flex-row justify-center items-center'>
                <p className='text-indigo-600 dark:text-amber-500 text-center text-md md:text-lg overflow-clip'>
                  {selectedRepo.owner.login.toUpperCase()}
                </p>
              </div>
              {/* last updated date */}
              <div className='flex flex-row justify-center items-center'>
                <p className='text-slate-700 dark:text-slate-400 text-center text-sm md:text-md overflow-clip'>
                  Last Updated:{" "}
                  {new Date(selectedRepo.updated_at).toDateString()}
                </p>
              </div>
              <p className='text-slate-700 text-center dark:text-slate-200 px-4 text-md md:text-2xl mt-5 overflow-clip'>
                {selectedRepo.description}
              </p>
              {/* topics */}
              <div className='flex flex-row justify-center mt-4'>
                {selectedRepo.topics.map((topic, i) =>
                  i > 2 ? null : (
                    <div
                      key={i}
                      className='rounded-full p-1 px-2 mx-2 transition-all duration-1000
                          bg-slate-100 dark:bg-slate-800 bg-opacity-10 hover:scale-110'>
                      <p className='text-slate-800 dark:text-sky-500 text-center text-sm md:text-md overflow-clip'>
                        {topic}
                      </p>
                    </div>
                  ),
                )}
              </div>

              {/* links */}
              <div className='flex flex-row justify-center mt-5 text-2xl'>
                <a
                  href={selectedRepo.html_url}
                  target='_blank'
                  rel='noreferrer'
                  className='rounded-full p-1 px-2 mx-2 transition-all duration-1000 text-slate-700 dark:text-slate-200'>
                  <SiGithub />
                </a>
                {selectedRepo.homepage && (
                  <a
                    href={selectedRepo.homepage}
                    target='_blank'
                    rel='noreferrer'
                    className='rounded-full p-1 px-2 mx-2 transition-all duration-1000 text-slate-700 dark:text-slate-200'>
                    <FiExternalLink />
                  </a>
                )}
              </div>
            </div>
            <button
              className='rounded-full p-1 px-2 mx-2 transition-all text-xl duration-1000 text-slate-400 dark:text-slate-400'
              onClick={() => setSelectedRepo({} as GithubRepoType)}>
              <FiX />
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Projects;
