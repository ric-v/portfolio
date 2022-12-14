import { RiMoonFoggyFill } from "react-icons/ri";
import { BsFillSunFill } from "react-icons/bs";
import { animated } from "react-spring";
import { transition, useFadeIn } from "~/theme/animate";
import { useContext } from "react";
import { ThemeContext } from "~/theme/context";
import { Link } from "@remix-run/react";

type Props = {
  // children: React.ReactNode,
};

const Navbar = (props: Props) => {
  const colorMode = useContext(ThemeContext);

  return (
    <>
      {/* set fixed nav bar on top */}
      <nav className="fixed top-0 left-0 w-full backdrop-blur-xl z-10">
        <animated.div
          style={useFadeIn()}
          className="flex flex-row justify-between p-5"
        >
          <Link to="/">
            <h1 className="text-2xl md:text-3xl col-span-2 dark:text-gray-200 font-sans">
              Portfolio - Richie
            </h1>
          </Link>
          <button
            className={`p-2 mr-8 col-span-2 rounded-full shadow-xl mx-5 bg-amber-50 dark:bg-slate-800
              border border-amber-200 dark:border-slate-800 ${
                colorMode.theme === "light"
                  ? "light-mode-shadow"
                  : "dark-mode-shadow"
              }
              hover:px-10 hover:mr-0 hover:border hover:rounded-full hover:border-amber-300  dark:hover:border-slate-600
              ${transition}`}
            onClick={colorMode.toggleTheme}
          >
            {colorMode.theme === "light" ? (
              <BsFillSunFill size={32} className="text-amber-600" />
            ) : (
              <RiMoonFoggyFill size={32} className="text-slate-200" />
            )}
          </button>
        </animated.div>
      </nav>
    </>
  );
};

export default Navbar;
