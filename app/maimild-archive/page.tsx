'use client';

import { MyMailArchive } from '@/lib/microcms';
import { useEffect, useState, useMemo, ReactNode } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import { ErrorBoundary } from './ErrorBoundary';

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
  'ふつうのおたより',
  'まいふぇいばりっと',
  'あなたのまいにち☆',
  'この菅野真衣はノンフィクションであり…',
  '言質Yes or No',
] as const;

const BROADCAST_TYPES = ['ラジオ', '生放送', 'おまけ動画'] as const;
const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50] as const;

export const dynamic = 'force-dynamic';

export default function MaimildArchivePage() {
  const [archives, setArchives] = useState<MyMailArchive[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('すべて');
  const [selectedCorners, setSelectedCorners] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>('すべて');
  const [loading, setLoading] = useState(true);
  const [expandedXPosts, setExpandedXPosts] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [itemsPerPage, setItemsPerPage] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const searchTerms = useMemo(
    () => normalizedSearchQuery.split(/\s+/).filter(Boolean),
    [normalizedSearchQuery]
  );

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

  // X投稿の展開/折りたたみ時にTwitterウィジェットを再初期化
  useEffect(() => {
    if (expandedXPosts.size > 0 && typeof window !== 'undefined' && window.twttr?.widgets?.load) {
      // タイミングの問題を避けるため、次のフレームで実行
      const timer = setTimeout(() => {
        window.twttr?.widgets?.load();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [expandedXPosts]);

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
      const archiveTypes = Array.isArray(archive.broadcastType)
        ? archive.broadcastType
        : [archive.broadcastType];
      
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
      
      if (selectedType !== 'すべて') {
        if (!archiveTypes.includes(selectedType as (typeof BROADCAST_TYPES)[number])) {
          return false;
        }
      }
      
      // 検索クエリによるフィルタリング
      if (searchTerms.length > 0) {
        const searchFields = [
          new Date(archive.broadcastDate).toLocaleDateString('ja-JP').toLowerCase(),
          archive.content,
          archive.corners.join(' '),
          archiveTypes.join(' '),
        ];
        const normalizedFields = searchFields.map(field => field?.toLowerCase() ?? '');
        const searchMatch = searchTerms.every(term =>
          normalizedFields.some(field => field.includes(term))
        );
        if (!searchMatch) return false;
      }
      
      return true;
    });
    
    return filtered;
  }, [archives, selectedYear, selectedCorners, selectedType, searchTerms]);

  // コーナーフィルターの切り替え
  const toggleCorner = (corner: string) => {
    setSelectedCorners(prev =>
      prev.includes(corner)
        ? prev.filter(c => c !== corner)
        : [...prev, corner]
    );
    setCurrentPage(1);
  };

  const toggleXPost = (archiveId: string) => {
    setExpandedXPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(archiveId)) {
        newSet.delete(archiveId);
      } else {
        newSet.add(archiveId);
      }
      return newSet;
    });
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedYear('すべて');
    setSelectedCorners([]);
    setSelectedType('すべて');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedYear !== 'すべて' ||
    selectedCorners.length > 0 ||
    selectedType !== 'すべて' ||
    normalizedSearchQuery.length > 0;

  // ページネーション計算
  const totalPages = Math.ceil(filteredArchives.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredArchives.length);
  const paginatedArchives = filteredArchives.slice(startIndex, endIndex);
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = new Set<number>([1, totalPages]);
    for (
      let page = Math.max(2, currentPage - 1);
      page <= Math.min(totalPages - 1, currentPage + 1);
      page++
    ) {
      pages.add(page);
    }

    const sortedPages = Array.from(pages).sort((a, b) => a - b);
    const result: Array<number | string> = [];

    sortedPages.forEach((page, index) => {
      const previousPage = sortedPages[index - 1];
      if (previousPage && page - previousPage > 1) {
        result.push(`ellipsis-${previousPage}-${page}`);
      }
      result.push(page);
    });

    return result;
  }, [currentPage, totalPages]);

  const highlightRegex = useMemo(() => {
    if (searchTerms.length === 0) {
      return null;
    }

    const escapedTerms = searchTerms
      .map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .sort((a, b) => b.length - a.length);

    return new RegExp(`(${escapedTerms.join('|')})`, 'gi');
  }, [searchTerms]);

  const highlightText = (text: string): ReactNode => {
    if (!highlightRegex || text === '') {
      return text;
    }

    const parts = text.split(highlightRegex);
    return parts.map((part, index) =>
      searchTerms.some(term => part.toLowerCase() === term.toLowerCase()) ? (
        <mark key={`${part}-${index}`} className="bg-pink-100 text-pink-900 rounded px-0.5">
          {part}
        </mark>
      ) : (
        <span key={`${part}-${index}`}>{part}</span>
      )
    );
  };

  const highlightHtml = (html: string): string => {
    if (!highlightRegex || html === '') {
      return html;
    }

    return html
      .split(/(<[^>]+>)/g)
      .map(segment => {
        if (segment.startsWith('<') && segment.endsWith('>')) {
          return segment;
        }

        return segment.replace(
          highlightRegex,
          '<mark class="bg-pink-100 text-pink-900 rounded px-0.5">$1</mark>'
        );
      })
      .join('');
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
            { label: 'マイマイルドアーカイブ', href: '/maimild-archive' },
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

        {/* 検索ボックスと表示件数選択 */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
          {/* 検索ボックス */}
          <div className="mb-4">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">キーワード検索</label>
            <div className="relative">
              <input
                type="text"
                placeholder="日付、内容、コーナー名などで検索..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2.5 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
              />
              {searchQuery !== '' && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  クリア
                </button>
              )}
            </div>
          </div>

          {/* 表示件数選択 */}
          <div className="flex items-center gap-2">
            <label htmlFor="itemsPerPage" className="text-sm text-gray-600">
              表示件数:
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
            >
              {ITEMS_PER_PAGE_OPTIONS.map(count => (
                <option key={count} value={count}>
                  {count}件
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* フィルターセクション */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 放送年フィルター */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">放送年</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setSelectedYear('すべて');
                    setCurrentPage(1);
                  }}
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
                    onClick={() => {
                      setSelectedYear(year);
                      setCurrentPage(1);
                    }}
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
                  onClick={() => {
                    setSelectedType('すべて');
                    setCurrentPage(1);
                  }}
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
                    onClick={() => {
                      setSelectedType(type);
                      setCurrentPage(1);
                    }}
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
                      onClick={() => {
                        setSelectedCorners([]);
                        setCurrentPage(1);
                      }}
                      className="px-4 py-2 rounded-full text-sm font-medium transition-colors bg-pink-500 text-white"
                    >
                      {selectedCorners.length}個選択中
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCorners([]);
                        setCurrentPage(1);
                      }}
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
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600">
            <p>
              結果: {filteredArchives.length}件 / 全{archives.length}件
              {normalizedSearchQuery !== '' && (
                <span className="ml-2 font-medium text-gray-700">（「{highlightText(searchQuery.trim())}」を含む）</span>
              )}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="px-3 py-1.5 text-xs font-semibold rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                条件をすべて解除
              </button>
            )}
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
          <>
            <p className="mb-4 text-sm text-gray-600">
              {startIndex + 1}〜{endIndex}件を表示中（{filteredArchives.length}件中）
            </p>
            <div className="space-y-6">
              {paginatedArchives.map(archive => {
                const archiveTypes = Array.isArray(archive.broadcastType)
                  ? archive.broadcastType
                  : [archive.broadcastType];
                const xPostUrls = [archive.xUrls1, archive.xUrls2, archive.xUrls3].filter(
                  (url): url is string => Boolean(url)
                );
                const isXPostsExpanded = expandedXPosts.has(archive.id);

                return (
                <div
                  key={archive.id}
                  className="bg-white rounded-xl border border-gray-100 shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  {/* ヘッダー部分 */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 pb-4 border-b border-gray-200">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {highlightText(new Date(archive.broadcastDate).toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          weekday: 'short',
                        }))}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {archiveTypes.map(type => (
                          <span
                            key={`${archive.id}-${type}`}
                            className="inline-block px-3 py-1 bg-pink-100 text-pink-800 text-sm rounded-full"
                          >
                            {highlightText(type)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                {/* 放送内容 */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">放送内容</h4>
                  <div 
                    className="prose prose-sm text-gray-700 max-w-none"
                    dangerouslySetInnerHTML={{ __html: highlightHtml(archive.content) }}
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
                          {highlightText(corner)}
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
                            {highlightText(archive.broadcastUrlYouTube)}
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
                            {highlightText(archive.broadcastUrlNiconico)}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 関連X投稿 */}
                {xPostUrls.length > 0 && (
                  <ErrorBoundary>
                    <div className="mb-1">
                      <button
                        type="button"
                        onClick={() => toggleXPost(archive.id)}
                        aria-expanded={isXPostsExpanded}
                        aria-controls={`x-posts-${archive.id}`}
                        className="group flex w-full min-h-11 items-center gap-3 rounded-lg border border-gray-200 px-3 py-2 text-left transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      >
                        <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-700">
                          {isXPostsExpanded ? '−' : '+'}
                        </span>
                        <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">
                          関連X投稿{isXPostsExpanded ? 'を閉じる' : 'を表示'}
                        </span>
                        <span className="ml-auto text-xs text-gray-500">{xPostUrls.length}件</span>
                        <svg
                          viewBox="0 0 24 24"
                          className={`h-4 w-4 text-gray-500 transition-transform ${isXPostsExpanded ? 'rotate-180' : ''}`}
                          aria-hidden="true"
                        >
                          <path
                            d="M6 9l6 6 6-6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      {isXPostsExpanded && (
                        <div id={`x-posts-${archive.id}`} className="mt-4 space-y-6">
                          {xPostUrls.map((url, index) => (
                            <div key={index} className="flex justify-center">
                              <TwitterEmbed url={url} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </ErrorBoundary>
                )}
                </div>
              );
            })}
            </div>

            {/* ページネーション */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                >
                  前へ
                </button>
                <div className="flex gap-1">
                  {pageNumbers.map(pageNum => (
                    typeof pageNum === 'string' ? (
                      <span key={pageNum} className="px-2 py-2 text-gray-400">
                        …
                      </span>
                    ) : (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`min-w-10 px-3 py-2 rounded-lg ${
                          currentPage === pageNum
                            ? 'bg-pink-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                >
                  次へ
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Twitter Widget スクリプト */}
      <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>
    </div>
  );
}
