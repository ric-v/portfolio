import { animated } from "react-spring"
import Navbar from "../Navbar"
import { transition, useFadeIn } from "~/theme/animate"
import Footer from "../Footer"

type Props = {
  children: React.ReactNode
}

const AppLayout = ({ children }: Props) => {
  return (
    <div
      className={`min-h-screen min-w-screen flex flex-col justify-between
        ${transition} bg-gradient-to-bl from-indigo-50 to-indigo-300 
        dark:bg-gradient-to-bl dark:from-slate-700 dark:bg-slate-900 star-field`
      }
    >
      <div className='layer' /><div className='layer' /><div className='layer' />
      <Navbar />

      <animated.div className={` dark:text-slate-300 ${transition}`} style={useFadeIn()}>
        {children}
      </animated.div>

      <Footer />
    </div>
  )
}

export default AppLayout;
