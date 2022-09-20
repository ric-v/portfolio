import { animated } from "react-spring"
import Navbar from "../Navbar"
import { transition, useFadeIn } from "~/theme/animate"
import Footer from "../Footer"
import FloatingActionBar from "../FloatingActionBar"

type Props = {
  children: React.ReactNode
}

const AppLayout = ({ children }: Props) => {
  return (
    <>
      <div
        className={`h-screen w-screen flex flex-col justify-between
        ${transition} bg-gradient-to-bl from-amber-50 bg-indigo-300 dark:bg-gradient-to-bl dark:from-slate-700 dark:bg-slate-900 star-field`
        }
      >
        <div className='layer' /><div className='layer' /><div className='layer' />
        <Navbar />

        <animated.div className={`dark:text-slate-300 flex flex-col justify-center items-center h-screen ${transition}`} style={useFadeIn()}>
          {children}
        </animated.div>

        <FloatingActionBar />
        <Footer />
      </div>
    </>
  )
}

export default AppLayout;
