import { NextResponse } from 'next/server';
import { client } from '@/lib/microcms';
import { Work } from '@/lib/microcms';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // 60秒ごとに再検証

export async function GET() {
  try {
    let allWorks: Work[] = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    while (hasMore) {
      const response = await client.get({
        endpoint: 'works',
        queries: {
          limit,
          offset,
          orders: '-releaseYear',
          // キャッシュバスティング用タイムスタンプ
          _: Date.now().toString(),
        },
      });

      allWorks = [...allWorks, ...response.contents];
      
      if (response.contents.length < limit) {
        hasMore = false;
      } else {
        offset += limit;
      }
    }

    // IDの重複を除去
    const uniqueWorks = Array.from(
      new Map(allWorks.map(work => [work.id, work])).values()
    );

    const response = NextResponse.json({ works: uniqueWorks });
    // キャッシュ制御: 60秒間キャッシュし、その後は再検証
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
    return response;
  } catch (error) {
    console.error('Failed to fetch works:', error);
    return NextResponse.json(
      { error: 'Failed to fetch works' },
      { status: 500 }
    );
  }
}
