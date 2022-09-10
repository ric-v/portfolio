import { useState } from "react";
import { ThemeContext } from "~/theme/context";
import { RiMoonFoggyFill } from "react-icons/ri";
import { HiOutlineSun } from "react-icons/hi";

export const transition = ` transition-all ease-in-out duration-1000 `;

export default function Index() {
  const [colorMode, setColorMode] = useState<'dark' | 'light'>("light");
  const toggleTheme = () => {
    setColorMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme: colorMode, toggleTheme: toggleTheme }}>
      <main className={`${colorMode}`}>
        <div className="min-h-full min-w-full p-4 
          bg-gradient-to-br from-slate-50 to-slate-100
          dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900"
        >
          <nav className="flex flex-row justify-between mb-10">
            <h1 className="text-4xl md:text-5xl col-span-2 dark:text-gray-200 font-sans">
              asterix.dev
            </h1>
            <button
              className={`p-2 mr-8 col-span-2 border rounded-full dark:border-gray-700 
              hover:bg-gray-300 dark:hover:bg-gray-900
              hover:px-10 hover:mr-0 hover:border hover:rounded-full hover:border-slate-600
              ${transition}`}
              onClick={toggleTheme}
            >
              {
                colorMode === "light" ? (
                  <RiMoonFoggyFill size={32} />
                ) : (
                  <HiOutlineSun size={32} className='text-white' />
                )
              }
            </button>
          </nav>
          <div className="flex flex-row">
          </div>
        </div>
      </main>
    </ThemeContext.Provider>
  );
}
