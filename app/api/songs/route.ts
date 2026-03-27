import { NextResponse } from 'next/server';
import { client, Song } from '@/lib/microcms';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export async function GET() {
  try {
    let allSongs: Song[] = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    while (hasMore) {
      const response = await client.get({
        endpoint: 'songs',
        queries: {
          limit,
          offset,
          orders: 'titleKana,title',
        },
      });

      allSongs = [...allSongs, ...response.contents];

      if (response.contents.length < limit) {
        hasMore = false;
      } else {
        offset += limit;
      }
    }

    // IDの重複を除去
    const uniqueSongs = Array.from(
      new Map(allSongs.map(song => [song.id, song])).values()
    );

    const res = NextResponse.json({ songs: uniqueSongs });
    res.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
    return res;
  } catch (error) {
    console.error('Failed to fetch songs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch songs' },
      { status: 500 }
    );
  }
}
