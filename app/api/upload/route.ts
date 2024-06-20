import { uploadService } from '@/services/upload/upload.cloudinary';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const formData = await req.formData();

  try {
    const response = await uploadService(formData);
    
    if (response?.data.error) {
      return NextResponse.json({ status: response.status, message: response.statusMessage }, { status: response.statusCode });
    }

    return NextResponse.json({ status: true, data: response.data }, { status: response.status });

  } catch (err) {
    return NextResponse.json({ status: false, err }, { status: 400 });
  }
}
