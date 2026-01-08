import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'スケジュール',
  description: '菅野真衣さんのラジオ出演、生配信などのスケジュール情報を掲載しています。',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SchedulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
