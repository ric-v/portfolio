import { ThemeCtx } from '@/store/theme';
import React, { useContext, useEffect, useState } from 'react'
import Navbar from './Navbar';

type Props = {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  const theme = useContext(ThemeCtx)

  return (
    <div className={`${theme.theme}`}>
      <main className='h-screen w-screen 
        bg-gradient-to-bl from-amber-50 bg-indigo-300 dark:bg-gradient-to-bl dark:from-slate-700 dark:bg-slate-900
        transition-all ease-in duration-1000'
      >
        <Navbar theme={theme.theme} toggleTheme={theme.toggleTheme} />
        {children}
      </main>
    </div>
  )
}

export default Layout;
