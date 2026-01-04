import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'お問い合わせ',
  description: 'サイトに関するご質問、改善案、不具合報告、ご要望などはこちらからお問い合わせください。',
  openGraph: {
    title: 'お問い合わせ | 菅野真衣非公式ファンサイト',
    description: 'サイトに関するご質問、改善案、不具合報告、ご要望などはこちらからお問い合わせください。',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
