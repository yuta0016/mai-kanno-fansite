import { client, News, MicroCMSListResponse } from '@/lib/microcms';
import Link from 'next/link';

export const revalidate = 60;

async function getNews(): Promise<News[]> {
  try {
    const data = await client.get<MicroCMSListResponse<News>>({
      endpoint: 'news',
      queries: {
        orders: '-publishedAt',
        limit: 50,
      },
    });
    return data.contents;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

// カテゴリーごとの色を定義
const categoryColors = {
  'お知らせ': 'bg-blue-100 text-blue-700',
  '作品情報': 'bg-pink-100 text-pink-700',
  'イベント情報': 'bg-green-100 text-green-700',
  'サイト更新': 'bg-gray-100 text-gray-700',
};

// 日付をフォーマット
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function NewsPage() {
  const newsList = await getNews();

  // 年月でグループ化
  const groupedNews = newsList.reduce((acc, news) => {
    const date = new Date(news.publishedAt);
    const yearMonth = `${date.getFullYear()}年${date.getMonth() + 1}月`;
    if (!acc[yearMonth]) {
      acc[yearMonth] = [];
    }
    acc[yearMonth].push(news);
    return acc;
  }, {} as Record<string, News[]>);

  const yearMonths = Object.keys(groupedNews).sort((a, b) => {
    // 降順にソート（新しい順）
    return b.localeCompare(a);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* ヘッダー */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            更新履歴
          </h1>
          <p className="text-gray-600">
            サイトの更新情報・お知らせ
          </p>
        </header>

        {/* 更新履歴一覧 */}
        {newsList.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 mb-4">まだ更新履歴がありません</p>
            <p className="text-sm text-gray-400">
              今後、サイトの更新情報やお知らせをこちらに掲載します
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {yearMonths.map((yearMonth) => (
              <section key={yearMonth} className="bg-white rounded-lg shadow-md overflow-hidden">
                <h2 className="bg-pink-500 text-white text-xl font-bold px-6 py-3">
                  {yearMonth}
                </h2>
                <div className="divide-y divide-gray-200">
                  {groupedNews[yearMonth].map((news) => (
                    <article key={news.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-wrap items-start gap-3 mb-3">
                        <time className="text-sm text-gray-500 font-medium min-w-[100px]">
                          {formatDate(news.publishedAt)}
                        </time>
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${
                            categoryColors[news.category]
                          }`}
                        >
                          {news.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {news.title}
                      </h3>
                      <div
                        className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: news.content }}
                      />
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* フッター */}
        <footer className="mt-12 text-center">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            ← トップページに戻る
          </Link>
        </footer>
      </div>
    </div>
  );
}
