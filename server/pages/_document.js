import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
       <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
