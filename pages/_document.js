import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Find your perfect dog breed with Canine Compass" />
        <meta name="keywords" content="dog breeds, canine, pets, family dogs" />
        <meta name="author" content="Canine Compass" />
        <meta property="og:title" content="Canine Compass" />
        <meta property="og:description" content="Find your perfect dog breed" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://caninecompass.site" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
