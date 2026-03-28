'use client';

import { Song } from '@/lib/microcms';
import { useEffect, useState } from 'react';
import Breadcrumb from '@/components/Breadcrumb';

const ALPHA_GROUPS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const KANA_GROUPS = ['あ', 'か', 'さ', 'た', 'な', 'は', 'ま', 'や', 'ら', 'わ'] as const;

/** 楽曲タイトル（読み仮名優先）の先頭1文字から表示グループを返す */
function getSongGroup(song: Song): string {
  const text = song.titleKana || song.title;
  if (!text) return '#';
  const firstChar = text.charAt(0);

  if (/[0-9!-/:-@[-`{-~]/.test(firstChar)) return '#';
  if (/[A-Za-z]/.test(firstChar)) return firstChar.toUpperCase();

  const code = firstChar.charCodeAt(0);
  // カタカナ→ひらがな変換
  const hCode = code >= 0x30a1 && code <= 0x30f6 ? code - 0x60 : code;

  if (hCode >= 0x3041 && hCode <= 0x304a) return 'あ'; // あ行
  if (hCode >= 0x304b && hCode <= 0x3054) return 'か'; // か行
  if (hCode >= 0x3055 && hCode <= 0x305e) return 'さ'; // さ行
  if (hCode >= 0x305f && hCode <= 0x3069) return 'た'; // た行
  if (hCode >= 0x306a && hCode <= 0x306e) return 'な'; // な行
  if (hCode >= 0x306f && hCode <= 0x307d) return 'は'; // は行
  if (hCode >= 0x307e && hCode <= 0x3082) return 'ま'; // ま行
  if (hCode >= 0x3083 && hCode <= 0x3088) return 'や'; // や行
  if (hCode >= 0x3089 && hCode <= 0x308d) return 'ら'; // ら行
  if (hCode >= 0x308e && hCode <= 0x3093) return 'わ'; // わ行

  return '#';
}

function compareSongs(a: Song, b: Song): number {
  const aText = a.titleKana || a.title;
  const bText = b.titleKana || b.title;
  return aText.localeCompare(bText, 'ja', { sensitivity: 'base' });
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Tokyo',
  });
}

const STREAMING_SERVICES: {
  key: keyof Pick<Song, 'appleMusicUrl' | 'spotifyUrl' | 'youtubeMusicUrl' | 'amazonMusicUrl'>;
  label: string;
  bgClass: string;
  icon: string;
}[] = [
  { key: 'appleMusicUrl', label: 'Apple Music', bgClass: 'bg-gradient-to-r from-pink-500 to-red-500', icon: '🎵' },
  { key: 'spotifyUrl', label: 'Spotify', bgClass: 'bg-green-500', icon: '🎧' },
  { key: 'youtubeMusicUrl', label: 'YouTube Music', bgClass: 'bg-red-600', icon: '▶' },
  { key: 'amazonMusicUrl', label: 'Amazon Music', bgClass: 'bg-sky-500', icon: '♪' },
];

// 個々の楽曲カード（展開/折りたたみ）
function SongCard({ song }: { song: Song }) {
  const [expanded, setExpanded] = useState(false);

  const tableRows: { label: string; value?: string }[] = [
    { label: '作詞', value: song.lyricist },
    { label: '作曲', value: song.composer },
    { label: '編曲', value: song.arranger },
    { label: '歌', value: song.vocalist },
    { label: '収録作品', value: song.album },
    { label: '使用作品', value: song.usedInWork },
    { label: '使用パート', value: song.usedAs },
    { label: 'リリース日', value: song.releaseDate ? formatDate(song.releaseDate) : undefined },
  ].filter(r => r.value);

  const hasStreaming = STREAMING_SERVICES.some(s => song[s.key]);
  const hasDetails = tableRows.length > 0 || hasStreaming || song.lyricsUrl;

  return (
    <div id={song.id} className="rounded-lg overflow-hidden shadow-sm border border-gray-100">
      {/* ヘッダー行（楽曲タイトル） */}
      <button
        onClick={() => hasDetails && setExpanded(v => !v)}
        className={`w-full text-left px-5 py-4 bg-pink-600 text-white flex items-center justify-between gap-3 transition-colors ${
          hasDetails ? 'hover:bg-pink-700 cursor-pointer' : 'cursor-default'
        }`}
        aria-expanded={expanded}
      >
        <div>
          <span className="font-bold text-base sm:text-lg leading-snug">{song.title}</span>
          {(song.vocalist || song.usedInWork) && (
            <p className="text-pink-200 text-xs mt-0.5">
              {[song.vocalist, song.usedInWork].filter(Boolean).join(' / ')}
            </p>
          )}
        </div>
        {hasDetails && (
          <span className="text-pink-200 flex-shrink-0 text-sm">
            {expanded ? '▲' : '▼'}
          </span>
        )}
      </button>

      {/* 展開時の詳細テーブル（添付画像スタイル） */}
      {expanded && (
        <table className="w-full text-sm border-collapse">
          <tbody>
            {tableRows.map((row, i) => (
              <tr key={row.label} className={i % 2 === 0 ? 'bg-white' : 'bg-pink-50'}>
                <th className="w-28 sm:w-36 px-4 py-2.5 text-left font-semibold text-gray-600 bg-slate-50 border-r border-gray-100 whitespace-nowrap">
                  {row.label}
                </th>
                <td className="px-4 py-2.5 text-gray-800">{row.value}</td>
              </tr>
            ))}

            {/* 配信サブスクリンク */}
            {hasStreaming && (
              <tr className={tableRows.length % 2 === 0 ? 'bg-white' : 'bg-pink-50'}>
                <th className="w-28 sm:w-36 px-4 py-2.5 text-left font-semibold text-gray-600 bg-slate-50 border-r border-gray-100 align-top whitespace-nowrap">
                  曲を聴く
                </th>
                <td className="px-4 py-2.5">
                  <div className="flex flex-wrap gap-2">
                    {STREAMING_SERVICES.map(svc => {
                      const url = song[svc.key];
                      if (!url) return null;
                      return (
                        <a
                          key={svc.key}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-white text-xs font-medium ${svc.bgClass} hover:opacity-90 transition-opacity`}
                        >
                          <span>{svc.icon}</span>
                          <span>{svc.label}</span>
                        </a>
                      );
                    })}
                  </div>
                </td>
              </tr>
            )}

            {/* 歌詞サイトリンク */}
            {song.lyricsUrl && (
              <tr className={(tableRows.length + (hasStreaming ? 1 : 0)) % 2 === 0 ? 'bg-white' : 'bg-pink-50'}>
                <th className="w-28 sm:w-36 px-4 py-2.5 text-left font-semibold text-gray-600 bg-slate-50 border-r border-gray-100 whitespace-nowrap">
                  歌詞
                </th>
                <td className="px-4 py-2.5">
                  <a
                    href={song.lyricsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:text-pink-800 underline text-sm"
                  >
                    歌詞を見る ↗
                  </a>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default function SongsPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGroup, setActiveGroup] = useState<string>('すべて');

  useEffect(() => {
    async function loadSongs() {
      try {
        const response = await fetch('/api/songs');
        const data = await response.json();
        setSongs(data.songs || []);
      } catch (error) {
        console.error('Error fetching songs:', error);
      } finally {
        setLoading(false);
      }
    }
    loadSongs();
  }, []);

  // 検索フィルター
  const filtered = songs
    .filter(song => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        song.title.toLowerCase().includes(q) ||
        (song.titleKana || '').toLowerCase().includes(q) ||
        (song.vocalist || '').toLowerCase().includes(q) ||
        (song.album || '').toLowerCase().includes(q) ||
        (song.usedInWork || '').toLowerCase().includes(q) ||
        (song.lyricist || '').toLowerCase().includes(q) ||
        (song.composer || '').toLowerCase().includes(q)
      );
    })
    .filter(song => {
      if (activeGroup === 'すべて') return true;
      return getSongGroup(song) === activeGroup;
    })
    .sort(compareSongs);

  // ナビゲーション用：実際に楽曲が存在するグループのみ列挙
  const existingGroups = new Set(songs.map(getSongGroup));
  const navGroups: string[] = [];
  if (existingGroups.has('#')) navGroups.push('#');
  ALPHA_GROUPS.forEach(g => { if (existingGroups.has(g)) navGroups.push(g); });
  KANA_GROUPS.forEach(g => { if (existingGroups.has(g)) navGroups.push(g); });

  // 表示用グループ分け
  const groupedSongs = filtered.reduce<Map<string, Song[]>>((acc, song) => {
    const g = getSongGroup(song);
    if (!acc.has(g)) acc.set(g, []);
    acc.get(g)!.push(song);
    return acc;
  }, new Map());

  const displayOrder: string[] = [];
  if (groupedSongs.has('#')) displayOrder.push('#');
  ALPHA_GROUPS.forEach(g => { if (groupedSongs.has(g)) displayOrder.push(g); });
  KANA_GROUPS.forEach(g => { if (groupedSongs.has(g)) displayOrder.push(g); });
  // 上記に含まれないグループ（念のため）
  groupedSongs.forEach((_, k) => {
    if (!displayOrder.includes(k)) displayOrder.push(k);
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <Breadcrumb items={[{ label: '参加楽曲データベース', href: '/songs' }]} />

        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            参加楽曲データベース
          </h1>
          <p className="text-gray-500 text-sm">
            Song Database
            {!loading && songs.length > 0 && (
              <span className="ml-2 text-pink-500 font-medium">{songs.length}曲収録</span>
            )}
          </p>
        </header>

        {/* 検索バー */}
        <div className="mb-6">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="search"
              placeholder="楽曲名・アーティスト・収録作品・作詞作曲で検索..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setActiveGroup('すべて');
              }}
              className="w-full border border-gray-300 rounded-full pl-10 pr-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
            />
          </div>
        </div>

        {/* インデックスナビゲーション（参考: ivesound.jp/music/ スタイル） */}
        {!searchQuery && navGroups.length > 0 && (
          <div className="mb-8 bg-white rounded-lg shadow-sm p-4">
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setActiveGroup('すべて')}
                className={`px-3 py-1 rounded text-sm font-bold transition-colors ${
                  activeGroup === 'すべて'
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-pink-100 hover:text-pink-700'
                }`}
              >
                すべて
              </button>
              {/* アルファベットグループ（存在するもの） */}
              {navGroups.filter(g => /^[A-Z#]$/.test(g)).length > 0 && (
                <span className="text-gray-200 self-center mx-1">|</span>
              )}
              {navGroups
                .filter(g => /^[A-Z#]$/.test(g))
                .map(g => (
                  <button
                    key={g}
                    onClick={() => setActiveGroup(g)}
                    className={`px-2.5 py-1 rounded text-sm font-bold transition-colors ${
                      activeGroup === g
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-pink-100 hover:text-pink-700'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              {/* 五十音グループ（存在するもの） */}
              {navGroups.filter(g => KANA_GROUPS.includes(g as typeof KANA_GROUPS[number])).length > 0 && (
                <span className="text-gray-200 self-center mx-1">|</span>
              )}
              {navGroups
                .filter(g => KANA_GROUPS.includes(g as typeof KANA_GROUPS[number]))
                .map(g => (
                  <button
                    key={g}
                    onClick={() => setActiveGroup(g)}
                    className={`px-2.5 py-1 rounded text-sm font-bold transition-colors ${
                      activeGroup === g
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-pink-100 hover:text-pink-700'
                    }`}
                  >
                    {g}
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* ローディング */}
        {loading && (
          <div className="text-center py-20 text-gray-400">
            <div className="text-4xl mb-4 animate-pulse">🎵</div>
            <p>読み込み中...</p>
          </div>
        )}

        {/* 曲なし */}
        {!loading && songs.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-4">🎵</p>
            <p className="text-lg">楽曲データが登録されていません</p>
            <p className="text-sm mt-2">microCMSで楽曲を登録してください</p>
          </div>
        )}

        {/* 検索結果なし */}
        {!loading && songs.length > 0 && filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-lg">「{searchQuery}」に一致する楽曲が見つかりませんでした</p>
          </div>
        )}

        {/* 楽曲リスト */}
        {!loading && filtered.length > 0 && (
          <>
            <div className="space-y-10">
              {displayOrder.map(group => {
                const groupSongs = groupedSongs.get(group);
                if (!groupSongs || groupSongs.length === 0) return null;

                return (
                  <section key={group} id={`section-${group}`}>
                    {/* グループヘッダー（A, B, ..., あ, か, ... スタイル） */}
                    <h2 className="text-2xl font-bold text-pink-600 border-b-2 border-pink-200 pb-2 mb-3">
                      {group}
                    </h2>
                    <div className="space-y-2">
                      {groupSongs.map(song => (
                        <SongCard key={song.id} song={song} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>

            {/* 件数表示 */}
            {searchQuery && (
              <p className="mt-8 text-center text-sm text-gray-400">
                {filtered.length}件の楽曲が見つかりました
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
