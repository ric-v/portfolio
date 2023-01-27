import { ThemeCtx } from '@/store/theme';
import React, { useContext, useEffect, useState } from 'react'
import Navbar from './Navbar';

type Props = {
  navbarTitle: string;
  children: React.ReactNode;
}

const Layout = ({ navbarTitle, children }: Props) => {
  const theme = useContext(ThemeCtx)

  return (
    <div className={`${theme.theme} `}>
      <main className='h-screen bg-gradient-to-bl from-amber-50 bg-indigo-300 dark:bg-gradient-to-bl dark:from-slate-700 dark:bg-slate-900
        transition-colors ease-in duration-2000 overflow-scroll overflow-x-hidden scrollbar-hide'
      >
        <Navbar title={navbarTitle} theme={theme.theme} toggleTheme={theme.toggleTheme} />
        {children}
      </main>
    </div>
  )
}

export default Layout;
