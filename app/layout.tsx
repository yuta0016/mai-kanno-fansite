import type { Metadata } from "next";
import { Zen_Maru_Gothic } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";

const GA_MEASUREMENT_ID = 'G-YETQ1M5PT4';

const zenMaruGothic = Zen_Maru_Gothic({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-zen-maru-gothic",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://mai-kanno-fansite.net'),
  title: {
    default: '菅野真衣非公式ファンサイト | 出演作品・イベント情報',
    template: '%s | 菅野真衣非公式ファンサイト',
  },
  description: '声優 菅野真衣さんの非公式ファンサイト。出演作品、イベント情報、プロフィールなどを掲載しています。',
  keywords: ['菅野真衣', '声優', 'ファンサイト', 'アニメ', 'ゲーム', 'イベント', '出演作品'],
  authors: [{ name: '菅野真衣非公式ファンサイト' }],
  creator: '菅野真衣非公式ファンサイト',
  publisher: '菅野真衣非公式ファンサイト',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://mai-kanno-fansite.net',
    title: '菅野真衣非公式ファンサイト | 出演作品・イベント情報',
    description: '声優 菅野真衣さんの非公式ファンサイト。出演作品、イベント情報、プロフィールなどを掲載しています。',
    siteName: '菅野真衣非公式ファンサイト',
  },
  twitter: {
    card: 'summary',
    title: '菅野真衣非公式ファンサイト | 出演作品・イベント情報',
    description: '声優 菅野真衣さんの非公式ファンサイト。出演作品、イベント情報、プロフィールなどを掲載しています。',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Google Search Console の認証コードをここに追加（後で設定）
    // google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body
        className={`${zenMaruGothic.variable} antialiased`}
        style={{ fontFamily: "var(--font-zen-maru-gothic)" }}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
