import { Head, Html, Main, NextScript } from 'next/document'

import { GoogleTagIFrame } from '@/features/documents/google-tagmanager/GoogleTagIFrame'

const Document = () => {
  return (
    <Html lang="en">
      <Head>
        <script
          src="https://code.jquery.com/jquery-3.7.1.min.js"
          integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo="
          crossOrigin="anonymous"
        />
        <script
          id="gtm-script"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-WBQ96M8');`,
          }}
        />

        <script
          src="https://www.googletagmanager.com/gtag/js?id=G-0QNCS4XK18"
          async
          id="gtm-id"
        />
        <script
          id="ga-script"
          async
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-0QNCS4XK18');
            `,
          }}
        />

        <link rel="icon" href="/favicon32.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/favicon16.png" sizes="16x16" type="image/png" />
      </Head>
      <body>
        <GoogleTagIFrame />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default Document
