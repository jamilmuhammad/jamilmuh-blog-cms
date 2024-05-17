import { postLogoutService } from '@/services/auth/logout'
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
  try {

    const response = await postLogoutService()
    
    if (response?.data.error) {
      NextResponse.json(response?.data?.message)
      return
    }

    return NextResponse.json({ status: true, data: response.data }, { status: response.status })

  } catch (err) {    
    return NextResponse.json({ status: false, err }, { status: 400 })
  }

}
