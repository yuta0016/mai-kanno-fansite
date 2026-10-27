import { NextResponse } from 'next/server';
import { client } from '@/lib/microcms';
import { MyMailArchive } from '@/lib/microcms';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // 60秒ごとに再検証

export async function GET() {
  try {
    let allArchives: MyMailArchive[] = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    while (hasMore) {
      const response = await client.get({
        endpoint: 'my_mail_archive',
        queries: {
          limit,
          offset,
          orders: '-broadcastDate',
        },
      });

      allArchives = [...allArchives, ...response.contents];
      
      if (response.contents.length < limit) {
        hasMore = false;
      } else {
        offset += limit;
      }
    }

    // IDの重複を除去
    const uniqueArchives = Array.from(
      new Map(allArchives.map(archive => [archive.id, archive])).values()
    );

    const response = NextResponse.json({ archives: uniqueArchives });
    // キャッシュ制御: 60秒間キャッシュし、その後は再検証
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
    return response;
  } catch (error) {
    console.error('Failed to fetch my mail archive:', error);
    return NextResponse.json(
      { error: 'Failed to fetch my mail archive' },
      { status: 500 }
    );
  }
}
