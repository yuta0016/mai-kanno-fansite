import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'プロフィール',
  description: '菅野真衣さんのプロフィール。生年月日、身長、血液型、趣味、特技などの基本情報を掲載しています。',
  alternates: {
    canonical: 'https://mai-kanno-fansite.net/profile',
  },
  openGraph: {
    title: 'プロフィール | 菅野真衣非公式ファンサイト',
    description: '菅野真衣さんのプロフィール。生年月日、身長、血液型、趣味、特技などの基本情報を掲載しています。',
    url: 'https://mai-kanno-fansite.net/profile',
  },
  twitter: {
    title: 'プロフィール | 菅野真衣非公式ファンサイト',
    description: '菅野真衣さんのプロフィール。生年月日、身長、血液型、趣味、特技などの基本情報を掲載しています。',
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
