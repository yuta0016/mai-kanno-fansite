import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ニュース',
  description: '菅野真衣さんに関するニュース・お知らせを掲載しています。',
  alternates: {
    canonical: 'https://mai-kanno-fansite.net/news',
  },
  openGraph: {
    title: 'ニュース | 菅野真衣非公式ファンサイト',
    description: '菅野真衣さんに関するニュース・お知らせを掲載しています。',
    url: 'https://mai-kanno-fansite.net/news',
    images: [
      {
        url: '/ogp.png',
        width: 1200,
        height: 630,
        alt: '菅野真衣非公式ファンサイト',
      },
    ],
  },
  twitter: {
    title: 'ニュース | 菅野真衣非公式ファンサイト',
    description: '菅野真衣さんに関するニュース・お知らせを掲載しています。',
    images: ['/ogp.png'],
  },
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
