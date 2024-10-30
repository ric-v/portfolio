import { ThemeCtx } from '@/store/theme';
import React, { useContext } from 'react'
import Navbar from './Navbar';

type Props = {
  navbarTitle: string;
  children: React.ReactNode;
}

const Layout = ({ navbarTitle, children }: Props) => {
  const theme = useContext(ThemeCtx)

  return (
    <div className={`${theme.theme} `}>
      <main className='h-screen bg-gradient-to-bl from-amber-100 bg-indigo-500 dark:bg-gradient-to-bl dark:from-slate-700 dark:bg-slate-900
        transition-colors ease-in duration-2000 overflow-scroll overflow-x-hidden scrollbar-hide
        flex flex-col justify-center items-center p-4 md:p-8'>
        <Navbar title={navbarTitle} theme={theme.theme} toggleTheme={theme.toggleTheme} />
        {children}
      </main>
    </div>
  )
}

export default Layout;
