import { MdHttp } from "react-icons/md";
import { HiTerminal } from "react-icons/hi";
import {
  SiGo,
  SiTypescript,
  SiNextdotjs,
  SiMaterialui,
  SiJavascript,
  SiTailwindcss,
  SiCsswizardry,
  SiReact,
  SiRedux,
  SiDart,
  SiFlutter,
  SiPostgresql,
  SiMysql,
  SiGraphql,
  SiNodedotjs,
  SiHtml5,
  SiPhp,
  SiPython,
  SiMongodb,
  SiRust,
  SiJson,
} from "react-icons/si";

type Props = {
  size: number;
  topic: string;
  showLabel?: boolean;
};

const ProgrammingLanguages = ({ size, topic, showLabel }: Props) => {
  const githubURL =
    "https://github.com/ric-v?tab=repositories&q=&type=&language=";
  if (topic && topic.length === 0) {
    return null;
  }

  switch (topic) {
    case "golang":
      return (
        <a
          href={`${githubURL}go`}
          target={"_blank"}
          rel="noreferrer"
          className="flex flex-row justify-start md:justify-center items-center text-xs md:text-lg text-slate-500 hover:scale-125 hover:text-sky-500 drop-shadow-xl transition-all duration-500 cursor-none"
        >
          <SiGo size={size} className="mx-2" />
          {showLabel && <span>Go Lang</span>}
        </a>
      );
    case "php":
      return (
        <a
          href={`${githubURL}php`}
          target={"_blank"}
          rel="noreferrer"
          className="flex flex-row justify-start md:justify-center items-center text-xs md:text-lg text-slate-500 hover:scale-125 hover:text-indigo-500 drop-shadow-xl transition-all duration-500 cursor-none"
        >
          <SiPhp size={size} className="mx-2" />
          {showLabel && <span>PHP</span>}
        </a>
      );
    case "node":
    case "nodejs":
      return (
        <a
          href={`${githubURL}javascript`}
          target={"_blank"}
          rel="noreferrer"
          className="flex flex-row justify-start md:justify-center items-center text-xs md:text-lg text-slate-500 hover:scale-125 hover:text-green-500 drop-shadow-xl transition-all duration-500 cursor-none"
        >
          <SiNodedotjs size={size} className="mx-2" />
          {showLabel && <span>NodeJS</span>}
        </a>
      );
    case "typescript":
    case "ts":
      return (
        <a
          href={`${githubURL}typescript`}
          target={"_blank"}
          rel="noreferrer"
          className="flex flex-row justify-start md:justify-center items-center text-xs md:text-lg text-slate-500 hover:scale-125 hover:text-blue-700 drop-shadow-xl transition-all duration-500 cursor-none"
        >
          <SiTypescript size={size} className="mx-2" />
          {showLabel && <span>TypeScript</span>}
        </a>
      );
    case "javascript":
    case "js":
      return (
        <a
          href={`${githubURL}javascript`}
          target={"_blank"}
          rel="noreferrer"
          className="flex flex-row justify-start md:justify-center items-center text-xs md:text-lg text-slate-500 hover:scale-125 hover:text-yellow-500 drop-shadow-xl transition-all duration-500 cursor-none"
        >
          <SiJavascript size={size} className="mx-2" />
          {showLabel && <span>JavaScript</span>}
        </a>
      );
    case "react":
    case "react.js":
    case "reactjs":
      return (
        <a
          href={`${githubURL}typescript`}
          target={"_blank"}
          rel="noreferrer"
          className="flex flex-row justify-start md:justify-center items-center text-xs md:text-lg text-slate-500 hover:scale-125 hover:text-cyan-700 drop-shadow-xl transition-all duration-500 cursor-none"
        >
          <SiReact size={size} className="mx-2" />
          {showLabel && <span>ReactJS</span>}
        </a>
      );
    case "nextjs":
    case "next.js":
      return (
        <a
          href={`${githubURL}typescript`}
          target={"_blank"}
          rel="noreferrer"
          className="flex flex-row justify-start md:justify-center items-center text-xs md:text-lg text-slate-500 hover:scale-125 hover:text-black drop-shadow-xl transition-all duration-500 cursor-none"
        >
          <SiNextdotjs size={size} className="mx-2" />
          {showLabel && <span>NextJS</span>}
        </a>
      );
    case "redux":
    case "redux-toolkit":
    case "reduxjs":
      return (
        <a
          href={`${githubURL}typescript`}
          target={"_blank"}
          rel="noreferrer"
          className="flex flex-row justify-start md:justify-center items-center text-xs md:text-lg text-slate-500 hover:scale-125 hover:text-purple-700 drop-shadow-xl transition-all duration-500 cursor-none"
        >
          <SiRedux size={size} className="mx-2" />
          {showLabel && <span>Redux</span>}
        </a>
      );
    case "mui":
    case "material":
    case "materialui":
    case "material-ui":
      return (
        <a
          href={`${githubURL}typescript`}
          target={"_blank"}
          rel="noreferrer"
          className="flex flex-row justify-start md:justify-center items-center text-xs md:text-lg text-slate-500 hover:scale-125 hover:text-sky-500 drop-shadow-xl transition-all duration-500 cursor-none"
        >
          <SiMaterialui size={size} className="mx-2" />
          {showLabel && <span>MaterialUI</span>}
        </a>
      );
    case "tailwind":
    case "tailwindcss":
    case "tailwind-css":
      return (
        <a
          href={`${githubURL}typescript`}
          target={"_blank"}
          rel="noreferrer"
          className="flex flex-row justify-start md:justify-center items-center text-xs md:text-lg text-slate-500 hover:scale-125 hover:text-sky-600 drop-shadow-xl transition-all duration-500 cursor-none"
        >
          <SiTailwindcss size={size} className="mx-2" />
          {showLabel && <span>Tailwind CSS</span>}
        </a>
      );
    case "html":
    case "html5":
      return (
        <a
          href={`${githubURL}html`}
          target={"_blank"}
          rel="noreferrer"
          className="flex flex-row justify-start md:justify-center items-center text-xs md:text-lg text-slate-500 hover:scale-125 hover:text-orange-600 drop-shadow-xl transition-all duration-500 cursor-none"
        >
          <SiHtml5 size={size} className="mx-2" />
          {showLabel && <span>HTML5</span>}
        </a>
      );
    case "css":
    case "css3":
      return (
        <a
          href={`${githubURL}typescript`}
          target={"_blank"}
          rel="noreferrer"
          className="flex flex-row justify-start md:justify-center items-center text-xs md:text-lg text-slate-500 hover:scale-125 hover:text-yellow-400 drop-shadow-xl transition-all duration-500 cursor-none"
        >
          <SiCsswizardry size={size} className="mx-2" />
          {showLabel && <span>CSS3</span>}
        </a>
      );
    case "graphql":
    case "gql":
      return (
        <a
          href={`${githubURL}typescript`}
          target={"_blank"}
          rel="noreferrer"
          className="flex flex-row justify-start md:justify-center items-center text-xs md:text-lg text-slate-500 hover:scale-125 hover:text-rose-500 drop-shadow-xl transition-all duration-500 cursor-none"
        >
          <SiGraphql size={size} className="mx-2" />
          {showLabel && <span>GraphQL</span>}
        </a>
      );
    case "rest":
    case "rest-api":
    case "http":
      return (
        <a
          href={`${githubURL}go`}
          target={"_blank"}
          rel="noreferrer"
          className="flex flex-row justify-start md:justify-center items-center text-xs md:text-lg text-slate-500 hover:scale-125 hover:text-sky-500 drop-shadow-xl transition-all duration-500 cursor-none"
        >
          <MdHttp size={size} className="mx-2" />
          {showLabel && <span>REST API</span>}
        </a>
      );
    case "python":
      return (
        <a
          href={`${githubURL}python`}
          target={"_blank"}
          rel="noreferrer"
          className="flex flex-row justify-start md:justify-center items-center text-xs md:text-lg text-slate-500 hover:scale-125 hover:text-emerald-600 drop-shadow-xl transition-all duration-500 cursor-none"
        >
          <SiPython size={size} className="mx-2" />
          {showLabel && <span>Python</span>}
        </a>
      );
    case "rust":
      return (
        <a
          href={`${githubURL}rust`}
          target={"_blank"}
          rel="noreferrer"
          className="flex flex-row justify-start md:justify-center items-center text-xs md:text-lg text-slate-500 hover:scale-125 hover:text-stone-600 drop-shadow-xl transition-all duration-500 cursor-none"
        >
          <SiRust size={size} className="mx-2" />
          {showLabel && <span>Rust</span>}
        </a>
      );
    case "dart":
    case "dartlang":
    case "dart-lang":
      return (
        <a
          href={`${githubURL}dart`}
          target={"_blank"}
          rel="noreferrer"
          className="flex flex-row justify-start md:justify-center items-center text-xs md:text-lg text-slate-500 hover:scale-125 hover:text-cyan-600 drop-shadow-xl transition-all duration-500 cursor-none"
        >
          <SiDart size={size} className="mx-2" />
          {showLabel && <span>Dart</span>}
        </a>
      );
    case "flutter":
      return (
        <a
          href={`${githubURL}dart`}
          target={"_blank"}
          rel="noreferrer"
          className="flex flex-row justify-start md:justify-center items-center text-xs md:text-lg text-slate-500 hover:scale-125 hover:text-blue-600 drop-shadow-xl transition-all duration-500 cursor-none"
        >
          <SiFlutter size={size} className="mx-2" />
          {showLabel && <span>Flutter</span>}
        </a>
      );
    case "postgres":
    case "pgsql":
    case "pl/pgsql":
      return (
        <a
          href={`${githubURL}`}
          target={"_blank"}
          rel="noreferrer"
          className="flex flex-row justify-start md:justify-center items-center text-xs md:text-lg text-slate-500 hover:scale-125 hover:text-cyan-600 drop-shadow-xl transition-all duration-500 cursor-none"
        >
          <SiPostgresql size={size} className="mx-2" />
          {showLabel && <span>PostgreSQL</span>}
        </a>
      );
    case "mysql":
      return (
        <a
          href={`${githubURL}`}
          target={"_blank"}
          rel="noreferrer"
          className="flex flex-row justify-start md:justify-center items-center text-xs md:text-lg text-slate-500 hover:scale-125 hover:text-orange-600 drop-shadow-xl transition-all duration-500 cursor-none"
        >
          <SiMysql size={size} className="mx-2" />
          {showLabel && <span>MySQL</span>}
        </a>
      );
    case "mongo":
    case "mongodb":
      return (
        <a
          href={`${githubURL}`}
          target={"_blank"}
          rel="noreferrer"
          className="flex flex-row justify-start md:justify-center items-center text-xs md:text-lg text-slate-500 hover:scale-125 hover:text-green-600 drop-shadow-xl transition-all duration-500 cursor-none"
        >
          <SiMongodb size={size} className="mx-2" />
          {showLabel && <span>MongoDB</span>}
        </a>
      );
    case "json":
    case "jsonp":
      return (
        <a
          href={`${githubURL}`}
          target={"_blank"}
          rel="noreferrer"
          className="flex flex-row justify-start md:justify-center items-center text-xs md:text-lg text-slate-500 hover:scale-125 hover:text-yellow-600 drop-shadow-xl transition-all duration-500 cursor-none"
        >
          <SiJson size={size} className="mx-2" />
          {showLabel && <span>JSON</span>}
        </a>
      );
    case "linux":
    case "terminal":
    case "shell":
    case "bash":
      return (
        <a
          href={`${githubURL}shell`}
          target={"_blank"}
          rel="noreferrer"
          className="flex flex-row justify-start md:justify-center items-center text-xs md:text-lg text-slate-500 hover:scale-125 hover:text-slate-800 drop-shadow-xl transition-all duration-500 cursor-none"
        >
          <HiTerminal size={size} className="mx-2" />
          {showLabel && <span>Linux</span>}
        </a>
      );
    default:
      return null;
  }
};

export default ProgrammingLanguages;
