import { NextResponse } from 'next/server';
import { client } from '@/lib/microcms';
import { Work } from '@/lib/microcms';

export const dynamic = 'force-dynamic';

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
        },
      });

      allWorks = [...allWorks, ...response.contents];
      
      if (response.contents.length < limit) {
        hasMore = false;
      } else {
        offset += limit;
      }
    }

    return NextResponse.json({ works: allWorks });
  } catch (error) {
    console.error('Failed to fetch works:', error);
    return NextResponse.json(
      { error: 'Failed to fetch works' },
      { status: 500 }
    );
  }
}
