import { postLoginService } from '@/services/auth/login'
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json()
  try {

    const response = await postLoginService(body)

    if (response?.data.error) {
      NextResponse.json(response?.data?.message)
      return
    }

    return NextResponse.json({ status: true, data: response.data }, { status: response.status })

  } catch (err) {
    return NextResponse.json({ status: false, err }, { status: 400 })
  }

}
