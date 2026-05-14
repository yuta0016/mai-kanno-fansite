import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '参加楽曲データベース',
  description: '菅野真衣さんが参加した楽曲のデータベース。作詞・作曲・編曲・収録作品・配信リンクなどの情報を掲載しています。',
  alternates: {
    canonical: 'https://mai-kanno-fansite.net/songs',
  },
  openGraph: {
    title: '参加楽曲データベース | 菅野真衣非公式ファンサイト',
    description: '菅野真衣さんが参加した楽曲のデータベース。作詞・作曲・編曲・収録作品・配信リンクなどの情報を掲載しています。',
    url: 'https://mai-kanno-fansite.net/songs',
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
    title: '参加楽曲データベース | 菅野真衣非公式ファンサイト',
    description: '菅野真衣さんが参加した楽曲のデータベース。作詞・作曲・編曲・収録作品・配信リンクなどの情報を掲載しています。',
    images: ['/ogp.png'],
  },
};

export default function SongsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
