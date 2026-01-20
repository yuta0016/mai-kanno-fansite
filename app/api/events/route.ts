import { NextResponse } from 'next/server';
import { client } from '@/lib/microcms';
import type { Event, MicroCMSListResponse } from '@/lib/microcms';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // 60秒ごとに再検証

export async function GET() {
  try {
    const allEvents: Event[] = [];
    let offset = 0;
    const limit = 100;

    // 全件取得（ページネーション）
    while (true) {
      const response = await client.get<MicroCMSListResponse<Event>>({
        endpoint: 'events',
        queries: {
          limit,
          offset,
          // キャッシュバスティング用タイムスタンプ
          _: Date.now().toString(),
        },
      });

      allEvents.push(...response.contents);

      if (response.contents.length < limit) {
        break;
      }

      offset += limit;
    }

    const response = NextResponse.json({ events: allEvents });
    // キャッシュ制御: 60秒間キャッシュし、その後は再検証
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
    return response;
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
