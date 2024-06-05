import { getAllBlogService } from '@/services/blog/getall.blog';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { search } = new URL(req.url);

  try {
    const response = await getAllBlogService(search);

    if (response?.data.error) {
      return NextResponse.json(response?.data?.message);
    }

    return NextResponse.json({ status: true, data: response.data.data }, { status: response.status });

  } catch (err) {
    return NextResponse.json({ status: false, err }, { status: 400 });
  }
}
