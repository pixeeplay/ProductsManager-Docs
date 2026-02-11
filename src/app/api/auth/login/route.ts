import { NextRequest, NextResponse } from 'next/server'

const PASSWORD = 'PixeePlay-2026!'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { password } = body

  if (password !== PASSWORD) {
    return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 })
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set('docs-auth-token', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  })

  return response
}
