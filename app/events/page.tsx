'use client';

import { Event } from '@/lib/microcms';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';

type UnifiedItem = {
  id: string;
  title: string;
  type: string | string[]; // 配列または文字列に対応
  date: string;
  endDate?: string;
  status: string[];
  venue?: string;
  platform?: string;
  performer?: string;
  openTime?: string;
  startTime?: string;
  description?: string;
  officialUrl?: string;
  broadcastPageUrl?: string;
  priceInfo?: string;
  participationMethod?: string;
};

export default function EventsPage() {
  const [items, setItems] = useState<UnifiedItem[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('すべて');
  const [selectedType, setSelectedType] = useState<string>('すべて');
  const [selectedYear, setSelectedYear] = useState<string>('すべて');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const eventsRes = await fetch('/api/events');
        const eventsData = await eventsRes.json();
        
        const eventItems: UnifiedItem[] = (eventsData.events || []).map((event: Event) => ({
          id: event.id,
          title: event.eventName,
          type: event.eventType,
          date: event.eventDate,
          endDate: event.endDate,
          status: event.status,
          venue: event.venueName,
          platform: event.platform,
          performer: event.performers,
          openTime: event.openTime,
          startTime: event.startTime,
          description: event.description,
          officialUrl: event.officialUrl,
          broadcastPageUrl: event.broadcastPageUrl,
          priceInfo: event.priceInfo,
          participationMethod: event.participationMethod,
        }));
        
        const allItems = eventItems.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        
        setItems(allItems);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash) {
        const id = window.location.hash.substring(1);
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('ring-4', 'ring-pink-300');
            setTimeout(() => {
              element.classList.remove('ring-4', 'ring-pink-300');
            }, 2000);
          }
        }, 100);
      } else {
        window.scrollTo(0, 0);
      }
    }
  }, [items]);

  // 重複を除去（イベントとスケジュールで同じ名前の種別がある場合に対応）
  const allTypes = useMemo(() => {
    const types = items.map(item => {
      // typeが配列の場合は最初の要素を取得、文字列の場合はそのまま使用
      return Array.isArray(item.type) ? item.type[0] : item.type;
    }).filter(Boolean);
    console.log('Raw types:', types);
    console.log('Raw types count:', types.length);
    const uniqueTypes = Array.from(new Set(types));
    console.log('Unique types:', uniqueTypes);
    console.log('Unique types count:', uniqueTypes.length);
    return uniqueTypes.sort(); // ソートして順序を固定
  }, [items]);
  
  const allStatuses = useMemo(() => {
    return Array.from(new Set(items.flatMap(item => item.status)));
  }, [items]);

  const allYears = useMemo(() => {
    const years = items.map(item => {
      const date = new Date(item.date);
      return date.getFullYear().toString();
    });
    return Array.from(new Set(years)).sort((a, b) => Number(b) - Number(a)); // 降順ソート
  }, [items]);

  const filteredItems = items.filter(item => {
    const statusMatch = selectedStatus === 'すべて' || item.status.includes(selectedStatus);
    const itemType = Array.isArray(item.type) ? item.type[0] : item.type;
    const typeMatch = selectedType === 'すべて' || itemType === selectedType;
    const itemYear = new Date(item.date).getFullYear().toString();
    const yearMatch = selectedYear === 'すべて' || itemYear === selectedYear;
    return statusMatch && typeMatch && yearMatch;
  });

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

  const getStatusColor = (status: string) => {
    if (['開催予定', '予定'].includes(status)) {
      return 'bg-green-100 text-green-800';
    }
    if (status === '発売中') {
      return 'bg-blue-100 text-blue-800';
    }
    if (status === '配信中') {
      return 'bg-yellow-100 text-yellow-800';
    }
    if (status === '中止') {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-gray-100 text-gray-800';
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
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            イベント・スケジュール
          </h1>
          <p className="text-gray-600">
            出演イベント、ラジオ、生配信などのスケジュール情報
          </p>
        </header>

        <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
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
                {allStatuses.map((status) => (
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

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">種別</h3>
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
                {allTypes.map((type, index) => (
                  <button
                    key={`${type}-${index}`}
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

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">年</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedYear('すべて')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedYear === 'すべて'
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  すべて
                </button>
                {allYears.map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedYear === year
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {year}年
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            {filteredItems.length}件
          </div>
        </div>

        <div className="space-y-6">
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <p className="text-gray-500">該当する情報がありません</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                id={item.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-6"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <h2 className="text-xl font-bold text-gray-900">
                        {item.title}
                      </h2>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {Array.isArray(item.type) ? item.type[0] : item.type}
                      </span>
                    </div>

                    <div className="mb-3">
                      <div className="text-gray-700 font-medium">
                        📅 {formatDate(item.date)}
                      </div>
                      {item.endDate && (
                        <div className="text-gray-600 text-sm mt-1">
                          終了: {formatDate(item.endDate)}
                        </div>
                      )}
                      {item.openTime && (
                        <div className="text-gray-600 text-sm mt-1">
                          開場 {item.openTime} {item.startTime && `/ 開演 ${item.startTime}`}
                        </div>
                      )}
                    </div>

                    {item.venue && (
                      <div className="mb-3 text-gray-700">
                        <span className="font-medium">会場:</span> {item.venue}
                      </div>
                    )}

                    {item.platform && (
                      <div className="mb-3 text-gray-700">
                        <span className="font-medium">配信:</span> {item.platform}
                      </div>
                    )}

                    {item.performer && (
                      <div className="mb-3 text-gray-700">
                        <span className="font-medium">出演:</span> {item.performer}
                      </div>
                    )}

                    {item.priceInfo && (
                      <div className="mb-3 text-gray-700">
                        <span className="font-medium">料金:</span> {item.priceInfo}
                      </div>
                    )}

                    {item.participationMethod && (
                      <div className="mb-3 text-gray-700">
                        <span className="font-medium">参加方法:</span> {item.participationMethod}
                      </div>
                    )}

                    {item.description && (
                      <div 
                        className="text-gray-600 mb-3 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: item.description }}
                      />
                    )}

                    <div className="mt-4 flex flex-wrap gap-3">
                      {item.officialUrl && (
                        <Link
                          href={item.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-pink-600 hover:text-pink-700 font-medium"
                        >
                          <span>公式サイト</span>
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
                      {item.broadcastPageUrl && (
                        <Link
                          href={item.broadcastPageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                        >
                          <span>配信ページ</span>
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

                  <div className="flex flex-wrap gap-2 md:flex-col md:items-end">
                    {item.status.map((status) => (
                      <span
                        key={status}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}
                      >
                        {status}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
