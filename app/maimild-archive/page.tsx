'use client';

import { MyMailArchive } from '@/lib/microcms';
import { useEffect, useState, useMemo } from 'react';
import Breadcrumb from '@/components/Breadcrumb';

const CORNERS = [
  'ふつうのおおたより',
  'まいふぇいばりっと',
  'あなたのまいにち☆',
  'この菅野真衣はノンフィクションであり…',
] as const;

const BROADCAST_TYPES = ['ラジオ', '生放送', 'おまけ動画'] as const;

export default function MaimildArchivePage() {
  const [archives, setArchives] = useState<MyMailArchive[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('すべて');
  const [selectedCorners, setSelectedCorners] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>('すべて');
  const [loading, setLoading] = useState(true);

  // データ取得
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/maimild-archive');
        const data = await res.json();
        setArchives(data.archives || []);
      } catch (error) {
        console.error('Failed to fetch archives:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

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
    return archives.filter(archive => {
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
      
      // 放送種別フィルター
      if (selectedType !== 'すべて' && archive.broadcastType !== selectedType) {
        return false;
      }
      
      return true;
    });
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
    const xUrl = url.includes('x.com') ? url : url.replace('twitter.com', 'x.com');
    
    return (
      <div className="flex justify-center my-4">
        <blockquote className="twitter-tweet">
          <a href={xUrl}></a>
        </blockquote>
      </div>
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
            菅野真衣の番組の放送内容をアーカイブしています
          </p>
        </div>

        {/* フィルターセクション */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">フィルター</h2>
          
          {/* 放送年フィルター */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              放送年
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedYear('すべて')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  selectedYear === 'すべて'
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                すべて
              </button>
              {availableYears.map(year => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    selectedYear === year
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {year}年
                </button>
              ))}
            </div>
          </div>

          {/* コーナーフィルター */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              コーナー（複数選択可）
            </label>
            <div className="space-y-2">
              {CORNERS.map(corner => (
                <label key={corner} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedCorners.includes(corner)}
                    onChange={() => toggleCorner(corner)}
                    className="w-4 h-4 text-pink-500 rounded focus:ring-pink-500"
                  />
                  <span className="ml-2 text-gray-700">{corner}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 放送種別フィルター */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              放送種別
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedType('すべて')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  selectedType === 'すべて'
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                すべて
              </button>
              {BROADCAST_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    selectedType === type
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* フィルター結果数 */}
          <div className="text-sm text-gray-600">
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

                {/* 関連X投稿 */}
                {archive.xUrls && archive.xUrls.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">関連X投稿</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {archive.xUrls.map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <a 
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline break-all text-sm"
                          >
                            {item.url}
                          </a>
                        </div>
                      ))}
                    </div>
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
