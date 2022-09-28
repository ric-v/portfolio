import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import styles from "./tailwind.css"
import appStyle from "./styles/app.css"
import { useState, useEffect } from "react";
import { ThemeContext } from "./theme/context";
import { ghContext } from "./github-api/auth";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "asterix.dev portfolio",
  viewport: "width=device-width,initial-scale=1",
});

export function links() {
  return [{ rel: "stylesheet", href: styles }, { rel: "stylesheet", href: appStyle }];
}
const IGNORE_PROJECTS = ['ric-v', 'ric-v.github.io', 'codility-trials', 'exercism-workouts']

export default function App() {
  const [colorMode, setColorMode] = useState<'dark' | 'light'>('dark');
  const toggleTheme = () => {
    setColorMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
    localStorage.setItem("theme", colorMode === "light" ? "dark" : "light");
  };
  const [projects, setProjects] = useState<GithubRepoType[]>([])
  const setData = (data: GithubRepoType[]) => {
    setProjects(data)
    localStorage.setItem('gh-data', JSON.stringify(data));
  }

  // Check if the user has a preference for dark mode, if so, set the theme to dark
  useEffect(() => {
    const localTheme = localStorage.getItem("theme");
    localTheme && setColorMode(localTheme as 'dark' | 'light');

    let astrxProjects: GithubRepoType[] = []
    fetch(`https://api.github.com/users/dev-asterix/repos`)
      .then(response => response.json())
      .then(data => {
        astrxProjects = data as GithubRepoType[]
        fetch(`https://api.github.com/users/ric-v/repos`)
          .then(response => response.json())
          .then(data => {

            // filter out ignored projects
            const filteredProjects = (data as GithubRepoType[]).filter((project: { name: string; }) => !IGNORE_PROJECTS.includes(project.name))
            setProjects(astrxProjects.concat(filteredProjects))
          })
      })
  }, []);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <style>
          @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,900;1,500;1,600;1,900&family=Pacifico&family=Raleway:ital,wght@0,300;0,400;0,600;0,900;1,300;1,400;1,600;1,900&display=swap');
        </style>
      </head>
      <body>
        <ThemeContext.Provider value={{ theme: colorMode, toggleTheme: toggleTheme }}>
          <ghContext.Provider value={{ data: projects, setData: setData }}>
            <main className={`${colorMode}`} >
              <Outlet />
              <ScrollRestoration />
              <LiveReload />
              <Scripts />
            </main>
          </ghContext.Provider>
        </ThemeContext.Provider>
      </body>
    </html>
  );
}
