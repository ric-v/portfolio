import { useEffect, useState } from "react";
import { ThemeContext } from "~/theme/context";
import App from "~/components/App";
import { transition } from "~/theme/animate";

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
      <main className={`${colorMode} `}>
        <div className={` bg-indigo-100 dark:bg-zinc-900 ${transition} `}>
          <App toggleTheme={toggleTheme} colorMode={colorMode} />
        </div>
      </main>
    </ThemeContext.Provider>
  );
}
