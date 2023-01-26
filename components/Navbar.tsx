import { RiMoonFoggyFill } from "react-icons/ri";
import { BsFillSunFill } from "react-icons/bs";
import Link from "next/link";

type Props = {
  title: string;
  theme: "dark" | "light";
  toggleTheme: () => void;
}

const Navbar = ({ title, theme, toggleTheme }: Props) => {
  return (
    <nav className="fixed top-0 left-0 w-full backdrop-blur-xl z-10 flex flex-row justify-between p-5">
      <Link href="/">
        <h1 className="font-pacifico text-2xl md:text-3xl col-span-2 dark:text-gray-200">
          {title}
        </h1>
      </Link>
      <button
        className={`p-2 mr-8 col-span-2 rounded-full shadow-xl mx-5 bg-amber-50 dark:bg-slate-800
              border border-amber-200 dark:border-slate-800
              ${theme === "light" ? "light-mode-shadow" : "dark-mode-shadow"}
              hover:px-10 hover:mr-0 hover:border hover:rounded-full hover:border-amber-300
              dark:hover:border-slate-600 transition-all ease-in-out duration-1500`}
        onClick={toggleTheme}
      >
        {theme === "light" ? (
          <BsFillSunFill size={32} className="text-amber-600" />
        ) : (
          <RiMoonFoggyFill size={32} className="text-slate-200" />
        )}
      </button>
    </nav>
  )
}

export default Navbar;
