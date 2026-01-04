import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'イベント・スケジュール',
  description: '菅野真衣さんのイベント情報、ラジオ出演、生配信などのスケジュール情報を掲載しています。',
  openGraph: {
    title: 'イベント・スケジュール | 菅野真衣非公式ファンサイト',
    description: '菅野真衣さんのイベント情報、ラジオ出演、生配信などのスケジュール情報を掲載しています。',
    url: 'https://mai-kanno-fansite.net/events',
  },
  twitter: {
    title: 'イベント・スケジュール | 菅野真衣非公式ファンサイト',
    description: '菅野真衣さんのイベント情報、ラジオ出演、生配信などのスケジュール情報を掲載しています。',
  },
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
