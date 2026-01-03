import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'イベント情報',
  description: '菅野真衣さんのイベント情報一覧。トークイベント、ライブ、握手会など、開催予定・終了したイベント情報を掲載しています。',
  openGraph: {
    title: 'イベント情報 | 菅野真衣非公式ファンサイト',
    description: '菅野真衣さんのイベント情報一覧。トークイベント、ライブ、握手会など、開催予定・終了したイベント情報を掲載しています。',
    url: 'https://mai-kanno-fansite.net/events',
  },
  twitter: {
    title: 'イベント情報 | 菅野真衣非公式ファンサイト',
    description: '菅野真衣さんのイベント情報一覧。トークイベント、ライブ、握手会など、開催予定・終了したイベント情報を掲載しています。',
  },
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
