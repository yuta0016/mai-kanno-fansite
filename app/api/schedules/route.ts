import { NextResponse } from 'next/server';
import { client, Schedule, MicroCMSListResponse } from '@/lib/microcms';

export async function GET() {
  try {
    let allSchedules: Schedule[] = [];
    let offset = 0;
    const limit = 100;

    // ページネーションで全データを取得
    while (true) {
      const data = await client.get<MicroCMSListResponse<Schedule>>({
        endpoint: 'schedules',
        queries: {
          orders: '-scheduledDate',
          limit,
          offset,
        },
      });

      allSchedules = [...allSchedules, ...data.contents];

      if (data.contents.length < limit) {
        break;
      }
      offset += limit;
    }

    return NextResponse.json(allSchedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json([]);
  }
}
