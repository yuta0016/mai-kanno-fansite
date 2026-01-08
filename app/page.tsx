import { client, Work, Event, MicroCMSListResponse } from '@/lib/microcms';
import Link from 'next/link';

export const revalidate = 60;

async function getLatestWorks(): Promise<Work[]> {
  try {
    const data = await client.get<MicroCMSListResponse<Work>>({
      endpoint: 'works',
      queries: {
        orders: '-releaseYear,-displayOrder',
        limit: 5,
      },
    });
    return data.contents;
  } catch (error) {
    console.error('Error fetching latest works:', error);
    return [];
  }
}

async function getUpcomingItems(): Promise<Event[]> {
  try {
    // 日本時間（JST）で現在日時を取得
    const now = new Date();
    const jstNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
    // 今日の日付の0時0分0秒を取得（当日終了まで表示するため）
    const today = new Date(jstNow.getFullYear(), jstNow.getMonth(), jstNow.getDate());
    
    const eventsData = await client.get<MicroCMSListResponse<Event>>({
      endpoint: 'events',
      queries: {
        orders: 'eventDate',
        limit: 100,
      },
    });
    
    const events = eventsData.contents || [];
    
    const upcomingEvents = events.filter((event: Event) => {
      // microCMSの日付を日本時間として解釈
      const eventDate = new Date(event.eventDate);
      const jstEventDate = new Date(eventDate.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
      
      // イベント日（時刻を除く）
      const eventDay = new Date(jstEventDate.getFullYear(), jstEventDate.getMonth(), jstEventDate.getDate());
      
      // 今日以降のイベントを表示
      const isTodayOrFuture = eventDay >= today;
      const isUpcoming = event.status.includes('開催予定') || event.status.includes('予定') || event.status.includes('配信中');
      
      return isTodayOrFuture && isUpcoming;
    }).sort((a: Event, b: Event) => {
      const dateA = new Date(a.eventDate);
      const dateB = new Date(b.eventDate);
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }
      const timeA = a.startTime || '99:99';
      const timeB = b.startTime || '99:99';
      return timeA.localeCompare(timeB);
    }).slice(0, 3);
    
    return upcomingEvents;
  } catch (error) {
    console.error('Error fetching upcoming items:', error);
    return [];
  }
}

export default async function HomePage() {
  const latestWorks = await getLatestWorks();
  const upcomingEvents = await getUpcomingItems();

  // 日付をフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
      timeZone: 'Asia/Tokyo',
    });
  };

  // 日時をフォーマット
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Tokyo',
    });
  };

  // 構造化データ（JSON-LD）
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '菅野真衣非公式ファンサイト',
    url: 'https://mai-kanno-fansite.net',
    description: '声優・俳優 菅野真衣さんの非公式ファンサイト。出演作品、イベント情報、プロフィールなどを掲載しています。',
    inLanguage: 'ja-JP',
    about: {
      '@type': 'Person',
      name: '菅野真衣',
      jobTitle: ['声優', '俳優'],
      sameAs: [
        'https://twitter.com/may_0324',
        'https://www.instagram.com/mai_kanno_/',
      ],
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'ホーム',
        item: 'https://mai-kanno-fansite.net',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* 構造化データの埋め込み */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* ヘッダー */}
        <header className="text-center mb-16 py-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            菅野真衣 ファンサイト
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-2">
            Mai Kanno Fan Site
          </p>
          <p className="text-sm text-gray-500">
            非公式ファンサイトです<br/>
            菅野真衣さん及び所属事務所とは一切関係ありません
          </p>
        </header>

        {/* メインコンテンツ */}
        <div className="space-y-12">
          {/* プロフィール概要 */}
          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center border-b-4 border-pink-400 pb-3">
              Profile
            </h2>
            <div className="text-center space-y-4">
              <div className="text-lg">
                <p className="font-bold text-2xl text-gray-900 mb-2">
                  菅野 真衣
                </p>
                <p className="text-gray-600">かんの まい / Mai Kanno</p>
              </div>
              <div className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
                <p>声優として活動中</p>
              </div>
              <div className="pt-4">
                <Link
                  href="/profile"
                  className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-3 rounded-full transition-colors shadow-md"
                >
                  プロフィール詳細 →
                </Link>
              </div>
            </div>
          </section>

          {/* 直近のイベント・スケジュール */}
          {upcomingEvents.length > 0 && (
            <section className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg shadow-lg p-8 text-white">
              <div className="flex items-center gap-2 mb-6">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <h2 className="text-2xl font-bold">
                  直近のイベント・スケジュール
                </h2>
              </div>
              
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                    <div className="mb-3">
                      <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm font-medium mb-2">
                        {event.eventType}
                      </span>
                      <h3 className="text-xl font-bold mb-2">
                        {event.eventName}
                      </h3>
                    </div>
                    <div className="space-y-2 text-white/90 text-sm">
                      <div>📅 {formatDate(event.eventDate)}</div>
                      {(event.openTime || event.startTime) && (
                        <div>
                          🕒 {event.openTime && `開場 ${event.openTime}`}
                          {event.openTime && event.startTime && ' / '}
                          {event.startTime && `開演 ${event.startTime}`}
                        </div>
                      )}
                      {event.venueName && <div>📍 {event.venueName}</div>}
                      {event.platform && <div>🎙️ {event.platform}</div>}
                      {event.performers && <div>👥 {event.performers}</div>}
                    </div>
                    <div className="mt-4 flex gap-3">
                      <Link
                        href={`/events#${event.id}`}
                        className="inline-block bg-white text-pink-600 hover:bg-pink-50 font-semibold px-6 py-2 rounded-full transition-colors text-sm"
                      >
                        詳細を見る →
                      </Link>
                      {event.broadcastPageUrl && (
                        <Link
                          href={event.broadcastPageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-2 rounded-full transition-colors text-sm"
                        >
                          配信
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <Link
                  href="/events"
                  className="inline-block bg-white text-pink-600 hover:bg-pink-50 font-semibold px-8 py-3 rounded-full transition-colors"
                >
                  すべてのイベント・スケジュールを見る →
                </Link>
              </div>
            </section>
          )}

          {/* 最新出演作品 */}
          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center border-b-4 border-pink-400 pb-3">
              Latest Works
            </h2>
            {latestWorks.length > 0 ? (
              <div className="space-y-4">
                {latestWorks.map((work, index) => (
                  <div
                    key={`${work.id}-${index}`}
                    className="border-l-4 border-pink-300 pl-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-baseline gap-2 sm:gap-3">
                      <span className="text-sm font-medium text-gray-500 sm:min-w-[60px]">
                        {work.releaseYear}年
                      </span>
                      <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">
                        {work.workType}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900 sm:flex-1 break-words">
                        {work.title}
                      </h3>
                      <span className="text-sm text-pink-600 font-medium">
                        {work.roleName}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                作品情報は準備中です
              </p>
            )}
            <div className="text-center mt-6">
              <Link
                href="/works"
                className="inline-block bg-white hover:bg-gray-50 text-pink-600 font-semibold px-8 py-3 rounded-full border-2 border-pink-500 transition-colors"
              >
                出演作品一覧を見る →
              </Link>
            </div>
          </section>

          {/* ナビゲーション */}
          <section className="grid md:grid-cols-4 gap-6">
            <Link
              href="/profile"
              className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-4xl mb-3">👤</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                プロフィール
              </h3>
              <p className="text-sm text-gray-600">
                詳細なプロフィール情報
              </p>
            </Link>

            <Link
              href="/works"
              className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-4xl mb-3">🎬</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                出演作品
              </h3>
              <p className="text-sm text-gray-600">
                アニメ・ゲーム・吹き替えなど
              </p>
            </Link>

            <Link
              href="/events"
              className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-4xl mb-3">📅</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                イベント
              </h3>
              <p className="text-sm text-gray-600">
                出演イベント情報
              </p>
            </Link>

            <Link
              href="/news"
              className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-4xl mb-3">📢</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                更新履歴
              </h3>
              <p className="text-sm text-gray-600">
                サイトの更新情報
              </p>
            </Link>
          </section>
        </div>

        {/* フッター */}
        <footer className="mt-16 text-center text-gray-500 text-sm border-t border-gray-200 pt-8">
          <p className="mb-2">
            このサイトは菅野真衣さんの非公式ファンサイトです。
          </p>
          <p className="mb-4">
            所属事務所・公式サイトとは一切関係ありません。
          </p>
          <p className="text-xs text-gray-400">
            © 2026 Mai Kanno Fan Site. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}

