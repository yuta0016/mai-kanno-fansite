'use client';

import { MyMailArchive } from '@/lib/microcms';
import { useEffect, useState, useMemo } from 'react';
import Breadcrumb from '@/components/Breadcrumb';

declare global {
  interface Window {
    twttr?: {
      widgets?: {
        load: () => void;
      };
    };
  }
}

const CORNERS = [
  'ふつうのおおたより',
  'まいふぇいばりっと',
  'あなたのまいにち☆',
  'この菅野真衣はノンフィクションであり…',
  '言質Yes or No',
] as const;

const BROADCAST_TYPES = ['ラジオ', '生放送', 'おまけ動画'] as const;

export const dynamic = 'force-dynamic';

export default function MaimildArchivePage() {
  const [archives, setArchives] = useState<MyMailArchive[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('すべて');
  const [selectedCorners, setSelectedCorners] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>('すべて');
  const [loading, setLoading] = useState(true);
  const [expandedXPosts, setExpandedXPosts] = useState<Set<string>>(new Set());

  // データ取得
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/maimild-archive');
        const data = await res.json();
        
        if (!res.ok) {
          console.error('API Error:', data.error);
        }
        
        setArchives(data.archives || []);
      } catch (error) {
        console.error('Failed to fetch archives:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Twitterウィジェットの再初期化
  useEffect(() => {
    if (!loading && typeof window !== 'undefined' && window.twttr?.widgets?.load) {
      window.twttr.widgets.load();
    }
  }, [loading]);

  // 利用可能な年度を取得
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    archives.forEach(archive => {
      const year = new Date(archive.broadcastDate).getFullYear().toString();
      years.add(year);
    });
    return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a));
  }, [archives]);

  // フィルタリングされたデータ
  const filteredArchives = useMemo(() => {
    const filtered = archives.filter(archive => {
      const archiveYear = new Date(archive.broadcastDate).getFullYear().toString();
      
      // 年度フィルター
      if (selectedYear !== 'すべて' && archiveYear !== selectedYear) {
        return false;
      }
      
      // コーナーフィルター
      if (selectedCorners.length > 0) {
        const hasMatchingCorner = archive.corners.some(corner =>
          selectedCorners.includes(corner)
        );
        if (!hasMatchingCorner) return false;
      }
      
      // 放送種別フィルター（配列から最初の要素を取得して比較）
      if (selectedType !== 'すべて') {
        const archiveType = Array.isArray(archive.broadcastType)
          ? archive.broadcastType[0]
          : archive.broadcastType;
        if (archiveType !== selectedType) {
          return false;
        }
      }
      
      return true;
    });
    
    return filtered;
  }, [archives, selectedYear, selectedCorners, selectedType]);

  // コーナーフィルターの切り替え
  const toggleCorner = (corner: string) => {
    setSelectedCorners(prev =>
      prev.includes(corner)
        ? prev.filter(c => c !== corner)
        : [...prev, corner]
    );
  };

  // X投稿の埋め込みコンポーネント
  const TwitterEmbed = ({ url }: { url: string }) => {
    useEffect(() => {
      // Twitterウィジェットを再初期化
      if (window.twttr?.widgets?.load) {
        window.twttr.widgets.load();
      }
    }, [url]);

    const xUrl = url.includes('x.com') ? url : url.replace('twitter.com', 'x.com');
    
    return (
      <blockquote className="twitter-tweet">
        <a href={xUrl}></a>
      </blockquote>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
        <Breadcrumb
          items={[
            { label: 'ホーム', href: '/' },
            { label: 'マイペースマイワールドアーカイブ', href: '/my-mail-archive' },
          ]}
        />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-gray-600">読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <Breadcrumb
        items={[
          { label: 'ホーム', href: '/' },
          { label: 'マイマイルドアーカイブ', href: '/maimild-archive' },
        ]}
      />

      <div className="container mx-auto px-4 py-12">
        {/* ページタイトル */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            マイマイルド アーカイブ
          </h1>
          <p className="text-gray-600">
            菅野真衣のマイペースマイワールド♡の各回の放送内容を簡単に紹介しています
          </p>
        </div>

        {/* フィルターセクション */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 放送年フィルター */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">放送年</h3>
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
                {availableYears.map(year => (
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

            {/* 放送種別フィルター */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">放送種別</h3>
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
                {BROADCAST_TYPES.map(type => (
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

            {/* コーナーフィルター */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">コーナー</h3>
              <div className="flex flex-wrap gap-2">
                {selectedCorners.length > 0 ? (
                  <>
                    <button
                      onClick={() => setSelectedCorners([])}
                      className="px-4 py-2 rounded-full text-sm font-medium transition-colors bg-pink-500 text-white"
                    >
                      {selectedCorners.length}個選択中
                    </button>
                    <button
                      onClick={() => setSelectedCorners([])}
                      className="px-4 py-2 rounded-full text-sm font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      解除
                    </button>
                  </>
                ) : (
                  <button
                    className="px-4 py-2 rounded-full text-sm font-medium transition-colors bg-pink-500 text-white"
                  >
                    選択なし
                  </button>
                )}
              </div>
              {selectedCorners.length === 0 && (
                <div className="mt-2 text-xs text-gray-600">
                  複数選択可（チェックボックスで選択）
                </div>
              )}
            </div>
          </div>

          {/* コーナー選択チェックボックス */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="space-y-2">
              {CORNERS.map(corner => (
                <label key={corner} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedCorners.includes(corner)}
                    onChange={() => toggleCorner(corner)}
                    className="w-4 h-4 text-pink-500 rounded focus:ring-pink-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{corner}</span>
                </label>
              ))}
            </div>
          </div>

          {/* フィルター結果数 */}
          <div className="mt-4 text-sm text-gray-600">
            結果: {filteredArchives.length}件 / 全{archives.length}件
          </div>
        </div>

        {/* アーカイブリスト */}
        {filteredArchives.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">
              選択されたフィルター条件に該当するアーカイブはありません
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredArchives.map(archive => (
              <div key={archive.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                {/* ヘッダー部分 */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 pb-4 border-b border-gray-200">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {new Date(archive.broadcastDate).toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        weekday: 'short',
                      })}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-block px-3 py-1 bg-pink-100 text-pink-800 text-sm rounded-full">
                        {archive.broadcastType}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 放送内容 */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">放送内容</h4>
                  <div 
                    className="prose prose-sm text-gray-700 max-w-none"
                    dangerouslySetInnerHTML={{ __html: archive.content }}
                  />
                </div>

                {/* やったコーナー */}
                {archive.corners.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">やったコーナー</h4>
                    <div className="flex flex-wrap gap-2">
                      {archive.corners.map(corner => (
                        <span 
                          key={corner}
                          className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {corner}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 放送URL */}
                {(archive.broadcastUrlYouTube || archive.broadcastUrlNiconico) && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">放送URL</h4>
                    <div className="space-y-2">
                      {archive.broadcastUrlYouTube && (
                        <div className="flex items-center gap-2">
                          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                            YouTube
                          </span>
                          <a 
                            href={archive.broadcastUrlYouTube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline break-all text-sm flex-1"
                          >
                            {archive.broadcastUrlYouTube}
                          </a>
                        </div>
                      )}
                      {archive.broadcastUrlNiconico && (
                        <div className="flex items-center gap-2">
                          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                            ニコニコ動画
                          </span>
                          <a 
                            href={archive.broadcastUrlNiconico}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline break-all text-sm flex-1"
                          >
                            {archive.broadcastUrlNiconico}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 関連X投稿 */}
                {(archive.xUrls1 || archive.xUrls2 || archive.xUrls3) && (
                  <div className="mb-4">
                    <button
                      onClick={() => {
                        setExpandedXPosts(prev => {
                          const newSet = new Set(prev);
                          if (newSet.has(archive.id)) {
                            newSet.delete(archive.id);
                          } else {
                            newSet.add(archive.id);
                          }
                          return newSet;
                        });
                      }}
                      className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors cursor-pointer mb-3"
                    >
                      <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-gray-600 transition-transform ${expandedXPosts.has(archive.id) ? 'rotate-45' : ''}`}>
                        +
                      </span>
                      関連X投稿
                    </button>
                    {expandedXPosts.has(archive.id) && (
                      <div className="space-y-6">
                        {[archive.xUrls1, archive.xUrls2, archive.xUrls3].map((url, index) => (
                          url && (
                            <div key={index} className="flex justify-center">
                              <TwitterEmbed url={url} />
                            </div>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Twitter Widget スクリプト */}
      <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>
    </div>
  );
}
