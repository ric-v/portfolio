import { useEffect, useState } from "react";
import { ThemeContext } from "~/theme/context";
import Navbar from "~/components/Navbar";

export const transition = ` transition-all ease-in-out duration-1000 `;

export default function Index() {
  const [colorMode, setColorMode] = useState<'dark' | 'light'>('light');
  const toggleTheme = () => {
    setColorMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
    localStorage.setItem("theme", colorMode === "light" ? "dark" : "light");
  };

  // Check if the user has a preference for dark mode, if so, set the theme to dark
  useEffect(() => {
    const localTheme = localStorage.getItem("theme");
    localTheme && setColorMode(localTheme as 'dark' | 'light');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: colorMode, toggleTheme: toggleTheme }}>
      <main className={`${colorMode}`}>
        <div className="min-h-screen min-w-screen p-4 
          bg-gradient-to-br from-slate-50 to-slate-100
          dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900"
        >
          <Navbar toggleTheme={toggleTheme} colorMode={colorMode} />
          <div className="flex flex-row">
          </div>
        </div>
      </main>
    </ThemeContext.Provider>
  );
}
