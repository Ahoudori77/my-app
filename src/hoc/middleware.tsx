import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const jwt = request.cookies.get('jwtToken'); // JWTをクッキーから取得

  const protectedPaths = ['/dashboard']; // 保護するパスをリストアップ
  const path = request.nextUrl.pathname;

  if (protectedPaths.includes(path) && !jwt) {
    // ログインしていない場合、ログインページにリダイレクト
    const url = request.nextUrl.clone();
    url.pathname = '/login'; // ログインページのパス
    return NextResponse.redirect(url);
  }

  // 他のリクエストはそのまま許可
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/other-protected-path'], // ミドルウェアを適用するパス
};
