import React, { useContext } from "react";
import { transition } from "~/theme/animate";
import { ghContext } from "~/github-api/auth";
import { VscGlobe } from "react-icons/vsc";
import { FaGithub } from "react-icons/fa";
import ProgrammingLanguages from "./ProgrammingLanguages";

type Props = {
  owner: string;
  name: string;
};

const Project = ({ owner, name }: Props) => {
  const projects = useContext(ghContext);
  const project = projects.data.find(
    (project: GithubRepoType) =>
      project.name === name && project.owner.login === owner
  ) as GithubRepoType;
  const [expand, setExpand] = React.useState(false);

  return (
    <>
      <div
        className={`rounded-2xl text-center p-2 md:p-5 backdrop-blur-sm backdrop-brightness-95 hover:backdrop-brightness-75 cursor-pointer ${transition}`}
        onClick={() => setExpand(true)}
      >
        <div
          className={`flex flex-row justify-center my-5 absolute top-0 right-0 opacity-30 hover:opacity-100`}
        >
          <a
            href={project?.html_url}
            target="_blank"
            rel="noreferrer"
            className={` text-slate-700 drop-shadow-xl hover:text-slate-900 dark:text-sky-200 hover:dark:text-sky-400 hover:scale-110 mt-2 mx-2 ${transition}`}
          >
            <FaGithub size={28} />
          </a>
          {project?.homepage && (
            <a
              href={project?.homepage}
              target="_blank"
              rel="noreferrer"
              className={` text-slate-700 drop-shadow-xl hover:text-slate-900 dark:text-sky-200 hover:dark:text-sky-400 hover:scale-110 mt-2 mx-2 ${transition}`}
            >
              <VscGlobe size={28} />
            </a>
          )}
        </div>
        <h2 className="text-xs lg:text-lg text-amber-800 dark:text-orange-300 font-medium animate-pulse">
          {owner}
        </h2>
        <h1 className="text-md lg:text-xl text-slate-800 dark:text-sky-300 font-bold uppercase">
          {name.replace(/[-_.]/g, " ")}
        </h1>
        {/* <img className="w-32 h-32 rounded-xl mx-auto mt-4" src={`${project.owner?.avatar_url}&s=64`} alt="avatar" /> */}
        <p className="text-sm lg:text-xl text-slate-700 dark:text-sky-100 mt-2">
          {project?.description.length > 30
            ? `${project?.description.slice(0, 30)}...`
            : project?.description}
        </p>
        <div className="flex flex-row flex-wrap justify-center text-center md:text-left mt-2 cursor-pointer">
          {project?.topics.map((topic: string) => (
            <ProgrammingLanguages key={topic} size={22} topic={topic} />
          ))}
        </div>
      </div>

      {expand && (
        <>
          <div
            className="fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center z-50 backdrop-blur-2xl backdrop-brightness-90"
            onClick={() => setExpand(false)}
          >
            <div className="rounded-2xl w-full md:w-1/2 p-2 md:p-10 mt-20 overflow-y-scroll scrollbar-thin">
              <div className="text-center">
                <div className="text-md md:text-xl text-amber-800 dark:text-orange-300 animate-pulse">
                  {owner}
                </div>
                <div className="text-2xl md:text-3xl mt-2 font-bold text-slate-800 dark:text-sky-300">
                  {name.replace(/[-_.]/g, " ").toUpperCase()}
                </div>
                <div className="text-md md:text-xl mt-2 text-slate-700 dark:text-slate-300">
                  {project.description}
                </div>
                <div className={`flex flex-row justify-center my-5`}>
                  <a
                    href={project.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className={` text-slate-700 drop-shadow-xl hover:text-slate-900 dark:text-sky-200 hover:dark:text-sky-400 hover:scale-110 mt-2  mx-2 ${transition}`}
                  >
                    <FaGithub size={32} />
                  </a>
                  {project.homepage && (
                    <a
                      href={project.homepage}
                      target="_blank"
                      rel="noreferrer"
                      className={` text-slate-700 drop-shadow-xl hover:text-slate-900 dark:text-sky-200 hover:dark:text-sky-400 hover:scale-110 mt-2  mx-2 ${transition}`}
                    >
                      <VscGlobe size={32} />
                    </a>
                  )}
                </div>
                <div className="text-xs md:text-sm text-slate-600 dark:text-sky-300">
                  updated:{" "}
                  {project.updated_at
                    ? new Date(project.updated_at).toLocaleDateString()
                    : "unknown"}
                </div>
              </div>
              <div className="flex flex-row flex-wrap justify-center text-center md:text-left mt-2">
                {project.topics?.map(
                  (
                    topic:
                      | string
                      | number
                      | boolean
                      | React.ReactElement<
                          any,
                          string | React.JSXElementConstructor<any>
                        >
                      | React.ReactFragment
                      | React.ReactPortal
                      | null
                      | undefined,
                    index: React.Key | null | undefined
                  ) => (
                    <span
                      key={index}
                      className={`text-sm md:text-md text-center text-slate-700 dark:text-slate-200 bg-sky-200 dark:bg-slate-700 hover:scale-125 rounded-full p-2 m-2 ${transition}`}
                    >
                      {topic}
                    </span>
                  )
                )}
              </div>
              <div className="flex flex-row flex-wrap justify-center text-center md:text-left mt-2 cursor-pointer">
                {project?.topics.map((topic: string) => (
                  <ProgrammingLanguages key={topic} size={32} topic={topic} />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Project;
