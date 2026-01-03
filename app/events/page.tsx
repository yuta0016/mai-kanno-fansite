'use client';

import { Event } from '@/lib/microcms';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('すべて');
  const [selectedType, setSelectedType] = useState<string>('すべて');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        const response = await fetch('/api/events');
        const data = await response.json();
        
        // 日付の新しい順にソート
        const sortedEvents = data.events.sort((a: Event, b: Event) => {
          return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime();
        });
        
        setEvents(sortedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  // URLハッシュがあれば該当イベントにスクロール、なければページトップへ
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash) {
        const id = window.location.hash.substring(1); // "#"を除去
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // ハイライト効果を追加
            element.classList.add('ring-4', 'ring-pink-300');
            setTimeout(() => {
              element.classList.remove('ring-4', 'ring-pink-300');
            }, 2000);
          }
        }, 100);
      } else {
        // ハッシュがない場合はページトップへスクロール
        window.scrollTo(0, 0);
      }
    }
  }, [events]); // eventsが読み込まれた後に実行

  // イベント種別の順序を定義
  const eventTypeOrder = [
    'ライブ',
    'トークイベント',
    'リリースイベント',
    '公開生放送・収録',
    'ファンミーティング',
    'その他',
  ];

  const statusOrder = ['開催予定', '終了', '中止'];

  // フィルタリング後のイベント
  const filteredEvents = events.filter(event => {
    const statusMatch = selectedStatus === 'すべて' || event.status.includes(selectedStatus);
    const typeMatch = selectedType === 'すべて' || event.eventType === selectedType;
    return statusMatch && typeMatch;
  });

  // 日付をフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  };

  // ステータスの色を取得
  const getStatusColor = (status: string) => {
    switch (status) {
      case '開催予定':
        return 'bg-green-100 text-green-800';
      case '終了':
        return 'bg-gray-100 text-gray-800';
      case '中止':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* ヘッダー */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            出演イベント一覧
          </h1>
          <p className="text-gray-600">
            菅野真衣さんの出演イベント情報をご紹介します
          </p>
        </header>

        {/* ステータスフィルター */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">ステータス</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStatus('すべて')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedStatus === 'すべて'
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              すべて
            </button>
            {statusOrder.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedStatus === status
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* イベント種別フィルター */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">イベント種別</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedType('すべて')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedType === 'すべて'
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              すべて
            </button>
            {eventTypeOrder.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedType === type
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* 選択中のフィルターと件数表示 */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
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
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedStatus !== 'すべて' && selectedType !== 'すべて'
                  ? `${selectedStatus}・${selectedType}`
                  : selectedStatus !== 'すべて'
                  ? selectedStatus
                  : selectedType !== 'すべて'
                  ? selectedType
                  : 'すべてのイベント'}
              </h2>
              <p className="text-sm text-gray-600">
                {filteredEvents.length}件
              </p>
            </div>
          </div>
        </div>

        {/* イベント一覧 */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">該当するイベントがありません</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                id={event.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all scroll-mt-24"
              >
                {/* イベントヘッダー */}
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          event.status[0]
                        )}`}
                      >
                        {event.status[0]}
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                        {event.eventType}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {event.eventName}
                    </h3>
                  </div>
                </div>

                {/* イベント詳細 */}
                <div className="space-y-3">
                  {/* 日時 */}
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0"
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
                    <div>
                      <p className="text-gray-900 font-medium">
                        {formatDate(event.eventDate)}
                      </p>
                      {(event.openTime || event.startTime) && (
                        <p className="text-sm text-gray-600">
                          {event.openTime && `開場 ${event.openTime}`}
                          {event.openTime && event.startTime && ' / '}
                          {event.startTime && `開演 ${event.startTime}`}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 会場 */}
                  {event.venueName && (
                    <div className="flex items-start gap-2">
                      <svg
                        className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0"
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
                      <p className="text-gray-900">{event.venueName}</p>
                    </div>
                  )}

                  {/* 出演者 */}
                  {event.performers && (
                    <div className="flex items-start gap-2">
                      <svg
                        className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      <p className="text-gray-900">{event.performers}</p>
                    </div>
                  )}

                  {/* 料金情報 */}
                  {event.priceInfo && (
                    <div className="flex items-start gap-2">
                      <svg
                        className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-gray-900">{event.priceInfo}</p>
                    </div>
                  )}

                  {/* イベント内容 */}
                  {event.description && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div
                        className="text-gray-700 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: event.description }}
                      />
                    </div>
                  )}

                  {/* 参加方法 */}
                  {event.participationMethod && (
                    <div className="mt-4 bg-blue-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-blue-900 mb-1">
                        参加方法
                      </p>
                      <p className="text-sm text-blue-800">
                        {event.participationMethod}
                      </p>
                    </div>
                  )}

                  {/* 公式サイトリンク */}
                  {event.officialUrl && (
                    <div className="mt-4">
                      <a
                        href={event.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        <svg
                          className="w-5 h-5"
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
                        公式サイトで詳細を見る
                      </a>
                    </div>
                  )}
                </div>
              </div>
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
