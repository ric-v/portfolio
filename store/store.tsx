import { createContext, useEffect, useState } from "react";

// Theme Context
export const ThemeContext = createContext({
  theme: "dark" as "dark" | "light",
  toggleTheme: () => { },
});

type Props = {
  children: React.ReactNode;
};

// Theme Provider Component to wrap the app with the context
const ThemeProvider = ({ children }: Props) => {
  const [theme, setTheme] = useState("light" as "dark" | "light");

  // get the theme from local storage
  useEffect(() => {
    const localTheme = localStorage.getItem("theme");
    if (localTheme) {
      setTheme(localTheme as "dark" | "light");
    }
  }, []);

  // toggle the theme and update the local storage
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

    // add the theme to local storage
    localStorage.setItem("theme", theme === "dark" ? "light" : "dark");
  };

  // return the theme and the toggle function
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
