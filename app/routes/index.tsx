import { useEffect, useState } from "react";
import { ThemeContext } from "~/theme/context";
import App from "~/components/App";
import { transition, useFadeIn } from "~/theme/animate";
import bgStars from '~/styles/assets/stars.png'
import { animated } from "react-spring";

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
      <main className={`${colorMode} `} >
        <animated.div
          className={`${transition} bg-gradient-to-bl from-indigo-50 to-indigo-300 dark:from-slate-700 dark:to-slate-900 star-field`}
          style={{
            ...useFadeIn(),
            // background: `url(${bgStars})`,
            // backgroundColor: colorMode === 'light' ? linearGradient(to right, red, green) : '#1f2937',
            // backgroundPosition: 'center',
            // backgroundRepeat: 'repeat',
            // backgroundSize: 'cover',
          }}
        >
          <div className='layer'></div>
          <div className='layer'></div>
          <div className='layer'></div>
          {/* <div className='layer'></div> */}
          <App toggleTheme={toggleTheme} colorMode={colorMode} />
        </animated.div>
      </main>
    </ThemeContext.Provider>
  );
}
