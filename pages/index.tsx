import { GithubCtx } from '@/store/github_api';
import IntroCard from '@/components/IntroCard';
import Layout from '@/components/Layout';
import Head from 'next/head'
import { useContext } from 'react';

export default function Home() {
  const user = useContext(GithubCtx)

  return (
    <>
      <Head>
        <title>Richie Varghese</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <div className='h-screen flex flex-col justify-center px-2'>
          <IntroCard user={user.user} />
        </div>
      </Layout>
    </>
  )
}
