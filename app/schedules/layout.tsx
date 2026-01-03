import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'スケジュール',
  description: '菅野真衣さんのラジオ出演、生配信などのスケジュール情報を掲載しています。',
  openGraph: {
    title: 'スケジュール | 菅野真衣非公式ファンサイト',
    description: '菅野真衣さんのラジオ出演、生配信などのスケジュール情報を掲載しています。',
    url: 'https://mai-kanno-fansite.net/schedules',
  },
  twitter: {
    title: 'スケジュール | 菅野真衣非公式ファンサイト',
    description: '菅野真衣さんのラジオ出演、生配信などのスケジュール情報を掲載しています。',
  },
};

export default function SchedulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
