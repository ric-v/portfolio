import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';

export default function Error404() {
  const router = useRouter();

  useEffect(() => {
    void router.push('/');
  }, [router]);

  return (
    <Layout navbarTitle=''>
      <div className='flex flex-col justify-center px-2'>
        <h1 className='text-2xl text-center'>404 - Page Not Found</h1>
      </div>
    </Layout>
  );
}