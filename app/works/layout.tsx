import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '出演作品一覧',
  description: '菅野真衣さんの出演作品一覧。アニメ、ゲーム、吹き替え、舞台など多岐にわたる作品をご紹介しています。',
  alternates: {
    canonical: 'https://mai-kanno-fansite.net/works',
  },
  openGraph: {
    title: '出演作品一覧 | 菅野真衣非公式ファンサイト',
    description: '菅野真衣さんの出演作品一覧。アニメ、ゲーム、吹き替え、舞台など多岐にわたる作品をご紹介しています。',
    url: 'https://mai-kanno-fansite.net/works',
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
    title: '出演作品一覧 | 菅野真衣非公式ファンサイト',
    description: '菅野真衣さんの出演作品一覧。アニメ、ゲーム、吹き替え、舞台など多岐にわたる作品をご紹介しています。',
    images: ['/ogp.png'],
  },
};

export default function WorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
