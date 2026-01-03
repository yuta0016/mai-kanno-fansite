'use client';

import { Work } from '@/lib/microcms';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function WorksPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('すべて');
  const [selectedYear, setSelectedYear] = useState<string>('すべて');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWorks() {
      try {
        const response = await fetch('/api/works');
        const data = await response.json();
        
        // 重複を除去（IDでユニーク化、最新のものを残す）
        const workMap = new Map<string, Work>();
        data.works.forEach((work: Work) => {
          const existing = workMap.get(work.id);
          // 既存のものがないか、または新しい方を採用
          if (!existing || new Date(work.updatedAt) > new Date(existing.updatedAt)) {
            workMap.set(work.id, work);
          }
        });
        
        const uniqueWorks = Array.from(workMap.values());
        
        setWorks(uniqueWorks);
      } catch (error) {
        console.error('Error fetching works:', error);
      } finally {
        setLoading(false);
      }
    }

    loadWorks();
  }, []);

  // 作品種別の順序を定義
  const workTypeOrder = [
    'アニメ',
    'ゲーム',
    '吹き替え',
    'CM・ナレーション',
    'CDドラマ',
    'ラジオ',
    '舞台',
    '映画',
    'ドラマ',
    'ボイスコミック',
    'その他',
  ];

  // 年代のリストを動的に生成（降順）
  const availableYears = Array.from(
    new Set(works.map(work => work.releaseYear).filter(year => year != null))
  ).sort((a, b) => b - a);

  // フィルタリング後の作品
  const filteredWorks = works.filter(work => {
    // カテゴリーフィルター
    const categoryMatch = selectedCategory === 'すべて' || work.workType.includes(selectedCategory);
    
    // 年代フィルター
    const yearMatch = selectedYear === 'すべて' || (work.releaseYear && work.releaseYear.toString() === selectedYear);
    
    // 検索フィルター（作品名、役名で検索）
    const searchMatch = searchQuery === '' || 
      work.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      work.roleName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return categoryMatch && yearMatch && searchMatch;
  });

  // 作品種別ごとにグループ化
  const groupedWorks = filteredWorks.reduce((acc, work) => {
    // workTypeは配列なので、最初の要素を使用
    const type = work.workType[0];
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(work);
    return acc;
  }, {} as Record<string, Work[]>);

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
            出演作品一覧
          </h1>
          <p className="text-gray-600">
            菅野真衣さんの出演作品をご紹介します
          </p>
        </header>

        {/* 検索バー */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="作品名や役名で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* カテゴリーフィルター */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">カテゴリー</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('すべて')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'すべて'
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              すべて
            </button>
            {workTypeOrder.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedCategory(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === type
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* 年代フィルター */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">年代</h3>
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
            {availableYears.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year.toString())}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedYear === year.toString()
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {year}年
              </button>
            ))}
          </div>
        </div>

        {/* 選択中のカテゴリーと件数表示 */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCategory}
              </h2>
              <p className="text-sm text-gray-600">
                {filteredWorks.length}作品
              </p>
            </div>
          </div>
        </div>

        {/* 作品一覧 */}
        {filteredWorks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">まだ作品が登録されていません</p>
          </div>
        ) : selectedCategory === 'すべて' ? (
          // 「すべて」の場合はカテゴリーごとにグループ化して表示
          <div className="space-y-12">
            {workTypeOrder.map((workType) => {
              const worksInType = groupedWorks[workType];
              if (!worksInType || worksInType.length === 0) return null;

              return (
                <section key={workType} className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-pink-400 pb-2">
                    {workType}
                  </h2>
                  <div className="space-y-4">
                    {worksInType.map((work, index) => (
                      <div
                        key={`${work.id}-${index}`}
                        className="border-l-4 border-pink-200 pl-4 py-2 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex flex-wrap items-baseline gap-3">
                          <span className="text-sm font-medium text-gray-500 min-w-[60px]">
                            {work.releaseYear}年
                          </span>
                          <h3 className="text-lg font-semibold text-gray-900 flex-1">
                            {work.title}
                          </h3>
                          <span className="text-sm text-pink-600 font-medium">
                            {work.roleName}
                          </span>
                        </div>
                        {work.description && (
                          <div
                            className="mt-2 text-sm text-gray-600 pl-[72px]"
                            dangerouslySetInnerHTML={{ __html: work.description }}
                          />
                        )}
                        {work.officialUrl && (
                          <div className="mt-2 pl-[72px]">
                            <a
                              href={work.officialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              公式サイト →
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          // 特定カテゴリーの場合はそのカテゴリーのみ表示
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-pink-400 pb-2">
              {selectedCategory}
            </h2>
            <div className="space-y-4">
              {filteredWorks.map((work, index) => (
                <div
                  key={`${work.id}-${index}`}
                  className="border-l-4 border-pink-200 pl-4 py-2 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className="text-sm font-medium text-gray-500 min-w-[60px]">
                      {work.releaseYear}年
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 flex-1">
                      {work.title}
                    </h3>
                    <span className="text-sm text-pink-600 font-medium">
                      {work.roleName}
                    </span>
                  </div>
                  {work.description && (
                    <div
                      className="mt-2 text-sm text-gray-600 pl-[72px]"
                      dangerouslySetInnerHTML={{ __html: work.description }}
                    />
                  )}
                  {work.officialUrl && (
                    <div className="mt-2 pl-[72px]">
                      <a
                        href={work.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        公式サイト →
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
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
