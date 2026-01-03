import { client, Work, Event, Schedule, MicroCMSListResponse } from '@/lib/microcms';
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

async function getUpcomingEvent(): Promise<Event | null> {
  try {
    const now = new Date();
    
    const data = await client.get<MicroCMSListResponse<Event>>({
      endpoint: 'events',
      queries: {
        orders: 'eventDate',
        limit: 100,
      },
    });
    
    // 現在日時より未来で、ステータスが「開催予定」のイベントのみ抽出
    const upcomingEvents = data.contents.filter(event => {
      const eventDate = new Date(event.eventDate);
      const isFuture = eventDate >= now;
      const isUpcoming = event.status.includes('開催予定');
      return isFuture && isUpcoming;
    });
    
    if (upcomingEvents.length === 0) {
      return null;
    }
    
    // 日付順、同じ日付の場合は開演時間順でソート
    upcomingEvents.sort((a, b) => {
      const dateA = new Date(a.eventDate);
      const dateB = new Date(b.eventDate);
      
      // 日付が異なる場合は日付順
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }
      
      // 同じ日付の場合は開演時間でソート
      const timeA = a.startTime || '99:99'; // 時間がない場合は最後に
      const timeB = b.startTime || '99:99';
      return timeA.localeCompare(timeB);
    });
    
    // 最も近い未来のイベントを返す
    return upcomingEvents[0];
  } catch (error) {
    console.error('Error fetching upcoming event:', error);
    return null;
  }
}

async function getUpcomingSchedules(): Promise<Schedule[]> {
  try {
    const now = new Date();
    
    const data = await client.get<MicroCMSListResponse<Schedule>>({
      endpoint: 'schedules',
      queries: {
        orders: 'scheduledDate',
        limit: 100,
      },
    });
    
    // 現在日時より未来で、ステータスが「予定」または「配信中」のスケジュールのみ抽出
    const upcomingSchedules = data.contents.filter(schedule => {
      const scheduledDate = new Date(schedule.scheduledDate);
      const isFuture = scheduledDate >= now;
      const isUpcoming = schedule.status.includes('予定') || schedule.status.includes('配信中');
      return isFuture && isUpcoming;
    });
    
    // 日付順でソートして最大3件返す
    return upcomingSchedules.slice(0, 3);
  } catch (error) {
    console.error('Error fetching upcoming schedules:', error);
    return [];
  }
}

export default async function HomePage() {
  const latestWorks = await getLatestWorks();
  const upcomingEvent = await getUpcomingEvent();
  const upcomingSchedules = await getUpcomingSchedules();

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
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            菅野真衣 ファンサイト
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Mai Kanno Fan Site
          </p>
          <p className="text-sm text-gray-500">
            非公式ファンサイトです
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

          {/* 直近のイベント情報 */}
          {upcomingEvent && (
            <section className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg shadow-lg p-8 text-white">
              <div className="flex items-center gap-2 mb-4">
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
                  直近のイベント
                </h2>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="mb-3">
                  <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm font-medium mb-2">
                    {upcomingEvent.eventType}
                  </span>
                  <h3 className="text-2xl font-bold mb-2">
                    {upcomingEvent.eventName}
                  </h3>
                </div>
                <div className="space-y-2 text-white/90">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 flex-shrink-0"
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
                    <p className="font-medium">{formatDate(upcomingEvent.eventDate)}</p>
                  </div>
                  {(upcomingEvent.openTime || upcomingEvent.startTime) && (
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p>
                        {upcomingEvent.openTime && `開場 ${upcomingEvent.openTime}`}
                        {upcomingEvent.openTime && upcomingEvent.startTime && ' / '}
                        {upcomingEvent.startTime && `開演 ${upcomingEvent.startTime}`}
                      </p>
                    </div>
                  )}
                  {upcomingEvent.venueName && (
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <p>{upcomingEvent.venueName}</p>
                    </div>
                  )}
                </div>
                <div className="mt-6">
                  <Link
                    href={`/events#${upcomingEvent.id}`}
                    className="inline-block bg-white text-pink-600 hover:bg-pink-50 font-semibold px-6 py-2 rounded-full transition-colors"
                  >
                    イベント詳細を見る →
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* 直近のスケジュール */}
          {upcomingSchedules.length > 0 && (
            <section className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <svg
                    className="w-6 h-6 text-pink-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  直近のスケジュール
                </h2>
                <Link
                  href="/schedules"
                  className="text-pink-600 hover:text-pink-700 font-medium text-sm flex items-center gap-1"
                >
                  すべて見る
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
              <div className="space-y-4">
                {upcomingSchedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-pink-300 hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {schedule.scheduleType}
                          </span>
                          {schedule.status.map((status) => (
                            <span
                              key={status}
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                status === '予定'
                                  ? 'bg-green-100 text-green-800'
                                  : status === '配信中'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {status}
                            </span>
                          ))}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {schedule.title}
                        </h3>
                        <div className="text-sm text-gray-600 mb-1">
                          📅 {formatDateTime(schedule.scheduledDate)}
                        </div>
                        {schedule.platform && (
                          <div className="text-sm text-gray-600">
                            🎙️ {schedule.platform}
                          </div>
                        )}
                        {schedule.performer && (
                          <div className="text-sm text-gray-600">
                            👥 {schedule.performer}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {schedule.officialUrl && (
                          <Link
                            href={schedule.officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-pink-600 hover:text-pink-700 font-medium text-sm"
                          >
                            詳細
                            <svg
                              className="w-4 h-4 ml-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </Link>
                        )}
                        {schedule.broadcastPageUrl && (
                          <Link
                            href={schedule.broadcastPageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
                          >
                            配信
                            <svg
                              className="w-4 h-4 ml-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
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
                {latestWorks.map((work) => (
                  <div
                    key={work.id}
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

