// app/layout.js
import Head from 'next/head';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        {/* Add any other meta tags or links here */}
      </Head>
      <body>{children}</body>
    </html>
  );
}