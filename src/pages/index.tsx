import Head from 'next/head';
import { MainPage } from '@/components/MainPage/MainPage';

export default function Home() {
  return (
    <>
      <Head>
        <title>здесь title</title>

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/favicon.ico" />

        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

        <meta name="msapplication-TileColor" content="#9A8DFF" />
        <meta name="theme-color" content="#9A8DFF" />

        <meta property="og:title" content="здесь title" />
        <meta property="og:description" content="здесь description" />
        <meta property="og:image" content="/preview.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="" />

        <meta name="description" content="здесь description" />

        <meta itemProp="name" content="" />
        <meta itemProp="url" content="" />
        <meta itemProp="logo" content="/images/logo.png" />
        <meta itemType="http://schema.org/Organization" />
        <meta name="author" content="" />
        <link rel="canonical" href="" />
      </Head>

      <MainPage />
    </>
  );
}
