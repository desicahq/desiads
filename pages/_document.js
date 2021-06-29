import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body className="loading">
          <Main />
          <script async defer data-website-id="798fa9ef-e71f-4a9e-8dcd-c7a417ce19c9" src="https://analytics.desica.uk/umami.js"></script>
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
