import { getOneBlogService } from '@/services/blog/getone.blog';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const response = await getOneBlogService(id);

    if (response?.data.error) {
      return NextResponse.json(response?.data?.message);
    }

    return NextResponse.json({ status: true, data: response.data.data }, { status: response.status });

  } catch (err) {
    return NextResponse.json({ status: false, err }, { status: 400 });
  }
}
