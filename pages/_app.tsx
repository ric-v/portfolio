import 'styles/globals.css';
import type { AppProps } from 'next/app'
import ThemeProvider from '@/store/theme';
import GithubProvider from '@/store/github_api';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <GithubProvider>
        <Component {...pageProps} />
      </GithubProvider>
    </ThemeProvider>
  )
}
