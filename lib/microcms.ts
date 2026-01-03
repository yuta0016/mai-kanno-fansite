import { createClient } from 'microcms-js-sdk';

if (!process.env.MICROCMS_SERVICE_DOMAIN) {
  throw new Error('MICROCMS_SERVICE_DOMAIN is required');
}

if (!process.env.MICROCMS_API_KEY) {
  throw new Error('MICROCMS_API_KEY is required');
}

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
});

// 作品の型定義
export interface Work {
  id: string;
  title: string;
  workType: ('アニメ' | 'ゲーム' | '吹き替え' | 'CM・ナレーション' | 'CDドラマ' | 'ラジオ' | '舞台' | '映画' | 'ドラマ' | 'ボイスコミック' | 'その他')[];
  releaseYear: number; // 公開年（例: 2024, 2025）
  roleName: string;
  description: string;
  officialUrl?: string;
  streamingUrls?: Array<{
    service: string;
    url: string;
  }>;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
}

// microCMSのレスポンス型
export interface MicroCMSListResponse<T> {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
}

// プロフィールの型定義
export interface Profile {
  id: string;
  name: string;
  nameKana: string;
  birthDate: string;
  birthplace: string;
  hobbies: string;
  biography: string;
  twitterUrl?: string;
  officialUrl?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
}

// 更新履歴の型定義
export interface News {
  id: string;
  title: string;
  content: string;
  category: 'お知らせ' | '作品情報' | 'イベント情報' | 'サイト更新';
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  revisedAt: string;
}

// イベントの型定義
export interface Event {
  id: string;
  eventName: string; // イベント名
  eventType: 'ライブ' | 'トークイベント' | 'リリースイベント' | '公開生放送・収録' | 'ファンミーティング' | 'その他'; // イベント種別
  eventDate: string; // 開催日
  openTime?: string; // 開場時間
  startTime?: string; // 開演時間
  venueName?: string; // 会場名
  performers?: string; // 出演者
  description?: string; // イベント内容
  participationMethod?: string; // 参加方法
  priceInfo?: string; // 料金情報
  officialUrl?: string; // 公式サイトURL
  status: ('開催予定' | '終了' | '中止')[]; // ステータス（配列）
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
}
