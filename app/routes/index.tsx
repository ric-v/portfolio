import AppLayout from "~/components/layouts/AppLayout";
import type { IParallax } from "@react-spring/parallax";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import { useContext, useRef } from "react";
import { VscGithubInverted } from "react-icons/vsc";
import { GrLinkedinOption } from 'react-icons/gr';
import { AiFillFilePdf } from 'react-icons/ai';
import { transition } from "~/theme/animate";
import Timeline from "~/components/Timeline";
import Project from "~/components/Project";
import { Link } from "react-router-dom";
import Contributions from "~/components/Contributions";
import { HiChevronDoubleDown } from 'react-icons/hi';
import { ghContext } from "~/github-api/auth";
import Skill from "~/components/Skill";
import ProgrammingLanguages from "~/components/ProgrammingLanguages";

type Props = {};

const Index = (props: Props) => {
  const parallax = useRef<IParallax>(null!);

  return (
    <AppLayout>
      <Parallax ref={parallax} pages={5} className="scrollbar-none">
        {Intro(parallax)}

        {Experience(parallax)}

        {Projects(parallax)}

        {Skills(parallax)}

        {Contact(parallax)}
      </Parallax>
    </AppLayout >
  );
};

export default Index;

const Intro = (parallax: React.MutableRefObject<IParallax>) => {
  return (
    <>
      <ParallaxLayer
        offset={0}
        speed={1}
        className="bg-gradient-to-bl from-transparent bg-amber-400 dark:bg-sky-500 bg-opacity-10 dark:bg-opacity-10 h-screen flex flex-col justify-center px-2"
      />
      <ParallaxLayer
        offset={-0.05}
        speed={0}
        className="h-screen flex flex-col justify-center px-2"
      >
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          <div className="col-span-3 h-20 md:col-span-2" />
          <div className="col-span-3 md:col-span-2 bg-amber-400 dark:bg-sky-500 bg-opacity-10 dark:bg-opacity-10 h-64 rounded-3xl backdrop-blur-sm shadow-2xl -rotate-6 m-5">
            <img src="https://avatars.githubusercontent.com/u/20295778?v=4" alt="profile" className={`rounded-full w-36 h-36 absolute -top-20 -left-10 z-50 drop-shadow-xl grayscale border border-slate-400 border-spacing-16 border-8 opacity-90 `} />
            <div className="h-full w-full flex flex-col justify-center items-center">
              <div className="text-xl md:text-3xl font-medium text-center text-slate-700 dark:text-sky-300 drop-shadow-xl">
                Hi, this is <span className="font-bold">Richie</span> 👋, a <span className={`font-bold drop-shadow-xl`}>Full Stack Engineer</span> from Bengaluru, India.
              </div>
            </div>
          </div>
        </div>
      </ParallaxLayer>
      <ParallaxLayer
        offset={0.3}
        speed={1.4}
        className="flex flex-col justify-center px-2"
      >
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4 text-lg font-bold">
          <div className="col-span-3 md:col-span-1" />
          <a
            className={`col-span-3 md:col-span-1 flex flex-row justify-center py-2 backdrop-blur-sm rounded-2xl hover:shadow-2xl text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:scale-110 transition-all duration-1000`}
            href="https://github.com/ric-v" target={'_blank'} rel={'noreferrer'}
          >
            <span className="mr-2 drop-shadow-xl">Github</span>
            <VscGithubInverted size={32} className='drop-shadow-xl' />
          </a>
          <a
            className={`col-span-3 md:col-span-1 flex flex-row justify-center py-2 backdrop-blur-sm rounded-2xl hover:shadow-2xl text-slate-600 hover:text-sky-700 dark:text-slate-400 dark:hover:text-sky-500 hover:scale-110 transition-all duration-1000`}
            href="https://www.linkedin.com/in/ric-v/" target={'_blank'} rel={'noreferrer'}
          >
            <span className="mr-2 drop-shadow-xl">LinkedIn</span>
            <GrLinkedinOption size={32} className='drop-shadow-xl' />
          </a>
          <a
            className={`col-span-3 md:col-span-1 flex flex-row justify-center py-2 backdrop-blur-sm rounded-2xl hover:shadow-2xl text-slate-600 hover:text-red-700 dark:text-slate-400 dark:hover:text-red-400 hover:scale-110 transition-all duration-1000`}
            href="https://drive.google.com/file/d/1-34NxUJF_Fj6-s4vUZVZIjIVO0VD-WX9/view?usp=sharing" target={'_blank'} rel={'noreferrer'}
          >
            <span className="mr-2 drop-shadow-xl">Resume</span>
            <AiFillFilePdf size={32} className='drop-shadow-xl' />
          </a>
        </div>
        <div className="flex flex-row justify-center mt-5 animate-bounce cursor-pointer" onClick={() => parallax.current.scrollTo(1)}>
          <HiChevronDoubleDown size={32} />
        </div>
      </ParallaxLayer>
    </>
  )
}

const Experience = (parallax: React.MutableRefObject<IParallax>) => {
  return (
    <>
      <ParallaxLayer
        offset={1}
        speed={0.3}
        className="bg-gradient-to-bl from-transparent bg-sky-200 dark:bg-sky-700 bg-opacity-20 dark:bg-opacity-20 h-screen flex flex-col justify-center px-2"
        onClick={() => parallax.current.scrollTo(2)}
      />
      <ParallaxLayer
        offset={1}
        speed={1}
        className="h-screen flex flex-col justify-center mt-22 px-2"
      >
        <p className={`text-2xl md:text-4xl font-bold text-center text-slate-700 dark:text-sky-300 mb-5 hover:scale-125 cursor-none drop-shadow-xl ${transition}`}>
          Work Experience
        </p>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
          <Timeline
            duration="Jun 2018 - May 2021"
            title="Software Developer L2"
            company="Algomox Pvt. Ltd."
            companyLink="http://algomox.com/"
            domain="AIOPS & MLOPS"
            desc="An employee since start of the company. Worked on 2 major platform building cycle and most of the back-end server development. 
            Associated with chief engineer to architect and design solutions based on the platforms. 
            Had the opportunity to build servers from scratch, design them, document and debug the applications."
            key='1'
          >
            <>
              <Contributions>
                <li>Senior back-end developer, system administrator and SCM</li>
                <li>Assisted in solution design and architecture</li>
                <li>Microservice based server development in GO and Python</li>
                <li>REST API based integration with in-house AI solutions and external tools</li>
                <li>Automation and system operations with headless server development in GO and shell scripts</li>
                <li>Byte-code engineering experience in Java (ASM) for high volume and dynamic data manipulation</li>
                <li>Technical designing and functional documentation of developed products</li>
                <li>Technical demo with customers and experience in deploying products at customer’s end</li>
              </Contributions>
            </>
          </Timeline>

          <Timeline
            duration="Jun 2021 - Sept 2022"
            title='Engineer - Software Development'
            company="Schnell Digital Technologies"
            companyLink="https://schnelldigitech.com/"
            domain="PBM (Pharmacy Benefit Management)"
            desc='Worked as part of the initial team for building PBM engine for processing real-time pharmacy claims request for clients at high scale and high volume. Primarily worked on the processing engine with concurrent processing and adjudication capabilities based on business rules.'
            key='2'
          >
            <>
              <Contributions>
                <li>Golang developer working on socket connection based micro-services for claim processing</li>
                <li>Worked with the team to integrate SQL functions and logic with processing engine</li>
                <li>Did POC with team to add server logging and tracing with Prometheus</li>
              </Contributions>
            </>
          </Timeline>

          <Timeline
            duration="Oct 2022 - Preset"
            title="Senior Engineer - Software Development"
            company="Schnell Digital Technologies"
            companyLink="https://schnelldigitech.com/"
            domain="PBM"
            desc='Worked on the PBM claim processing engine for high scale and high volume pharmacy requests from clients. Worked on integration with external switch providers for managing the entire lifecycle of claims and their processing.'
            key='3'
          >
            <>
              <Contributions>
                <li>Senior Golang developer working on multiple REST API based services for product/external switch integration and on concurrent processing engine in micro-service architecture based on socket programming</li>
                <li>Built unit test for each functionalities in all services for better code coverage and initial testing for devs</li>
                <li>Built internal Golang modules/packages on azure git to be shared between multiple services</li>
                <li>Azure pipelines and release management</li>
                <li>Product dockerization and its deployment implemented with team members</li>
                <li>Postgres PL/pgSQL based stored procedures built for efficient and modularized queries for processing claims / statistics</li>
                <li>Microsoft Azure cloud skills developed with the help of team members for managing cloud infra</li>
              </Contributions>
            </>
          </Timeline>
        </div>
        <div className="flex flex-row justify-center mt-5 animate-bounce cursor-pointer" onClick={() => parallax.current.scrollTo(2)}>
          <HiChevronDoubleDown size={32} />
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
        speed={0.3}
        className="bg-gradient-to-bl from-transparent bg-sky-500 dark:bg-sky-900 bg-opacity-20 dark:bg-opacity-20 h-screen flex flex-col justify-center px-2"
      />
      <ParallaxLayer
        offset={2}
        speed={1}
        className="h-screen flex flex-col justify-center px-2"
      >
        <p className={`text-2xl md:text-4xl font-bold text-center text-slate-700 dark:text-sky-300 mb-5 hover:scale-125 cursor-none mt-24 drop-shadow-xl ${transition}`}>
          Projects
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6">
          <Project owner="dev-asterix" name='and-the-time-is' />
          <Project owner='ric-v' name='glog' />
          <Project owner='ric-v' name='divulge-keyvalue-db-ui' />
        </div>
        <a href="https://docs.github.com/en/rest" target={'_blank'} rel='noreferrer' className={`text-xs text-slate-500 hover:text-amber-100 ${transition}`}>*Projects data are pulled live from github api, click to know more</a>
        <div className='text-center mt-10 animate-bounce text-slate-700 dark:text-sky-300' >
          <Link to={"/projects"}>
            {'click to see more projects'}
          </Link>
        </div>
        <div className="flex flex-row justify-center mt-5 animate-bounce cursor-pointer" onClick={() => parallax.current.scrollTo(3.15)}>
          <HiChevronDoubleDown size={32} />
        </div>
      </ParallaxLayer>
    </>
  )
}

const Skills = (parallax: React.MutableRefObject<IParallax>) => {
  const projects = useContext(ghContext);
  let skills = projects.data.reduce((acc: string[], curr: GithubRepoType) => {
    acc.push(...curr.topics);
    return acc;
  }, []);
  skills = [...new Set(skills)];

  console.log(skills)
  return (
    <>
      <ParallaxLayer
        offset={3.2}
        speed={0.3}
        className="bg-gradient-to-bl from-transparent bg-orange-600 dark:bg-zinc-900 bg-opacity-10 dark:bg-opacity-20 h-screen flex flex-col justify-center px-2"
      />
      <ParallaxLayer
        offset={3}
        speed={1}
        className="h-screen flex flex-col justify-end px-2"
      >
        <p className={`text-2xl md:text-4xl font-bold text-center text-slate-700 dark:text-sky-300 mb-5 hover:scale-125 mt-24 cursor-none drop-shadow-xl ${transition}`}>
          Skills
        </p>
        <div className="grid grid-cols-3 md:grid-cols-9 gap-1 gap-y-4 md:gap-6">
          {skills.map((skill, i) => <ProgrammingLanguages key={i} size={24} topic={skill} showLabel={true} />)}
        </div>
        <div className="flex flex-row justify-center mt-5 animate-bounce cursor-pointer" onClick={() => parallax.current.scrollTo(4.2)}>
          <HiChevronDoubleDown size={32} />
        </div>
      </ParallaxLayer>
    </>
  )
}

const Contact = (parallax: React.MutableRefObject<IParallax>) => {
  return (
    <>
      <ParallaxLayer
        offset={4}
        speed={0.3}
        className="bg-gradient-to-bl from-transparent bg-orange-900 dark:bg-zinc-900 bg-opacity-20 dark:bg-opacity-50 h-screen flex flex-col justify-center px-2"
        onClick={() => parallax.current.scrollTo(0)}
      />
      <ParallaxLayer
        offset={4.05}
        speed={0.5}
        className="h-screen flex flex-col justify-end px-2"
        onClick={() => parallax.current.scrollTo(0)}
      >
        <p className={`text-2xl md:text-4xl font-bold text-center text-slate-700 dark:text-sky-300 mb-5 hover:scale-125 mt-24 cursor-none drop-shadow-xl ${transition}`}>
          Contact
        </p>
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
        <div className="flex flex-row justify-center mt-5 animate-bounce cursor-pointer" onClick={() => parallax.current.scrollTo(0)}>
          <HiChevronDoubleDown size={32} />
        </div>
      </ParallaxLayer>
    </>
  )
}
