import { NextResponse } from 'next/server';
import { client } from '@/lib/microcms';
import { MyMailArchive } from '@/lib/microcms';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // 60秒ごとに再検証

export async function GET() {
  try {
    console.log('Fetching maimild_archive from microCMS...');
    
    let allArchives: MyMailArchive[] = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    while (hasMore) {
      const response = await client.get({
        endpoint: 'maimild_archive',
        queries: {
          limit,
          offset,
          orders: '-broadcastDate',
        },
      });

      console.log(`Fetched ${response.contents.length} archives (offset: ${offset})`);
      allArchives = [...allArchives, ...response.contents];
      
      if (response.contents.length < limit) {
        hasMore = false;
      } else {
        offset += limit;
      }
    }

    console.log(`Total archives fetched: ${allArchives.length}`);

    // IDの重複を除去
    const uniqueArchives = Array.from(
      new Map(allArchives.map(archive => [archive.id, archive])).values()
    );

    const response = NextResponse.json({ archives: uniqueArchives });
    // キャッシュ制御: 60秒間キャッシュし、その後は再検証
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
    return response;
  } catch (error) {
    console.error('Failed to fetch maimild archive:', error);
    return NextResponse.json(
      { error: `Failed to fetch maimild archive: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}

