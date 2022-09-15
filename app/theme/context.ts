import { createContext } from "react";

export const ThemeContext = createContext({
  theme: 'dark' as 'dark' | 'light',
  toggleTheme: () => { },
});
