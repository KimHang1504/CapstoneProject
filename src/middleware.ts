import { jwtDecode } from 'jwt-decode';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { JwtPayload } from './api/auth/type';
import { getUserFromToken } from './utils/jwt';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    // Lấy token từ cookie
    const token = request.cookies.get('accessToken')?.value;
    console.log("Middleware: ", token);
    // Nếu không có token => chuyển hướng về trang login
    if (!token) {
        return NextResponse.redirect(new URL('/auth', request.url));
    }

    try {
        // Giải mã token để lấy role 
        const role = getUserFromToken(token).role;
        if (pathname.startsWith('/admin') && role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/unauthorized', request.url));
        }

        if (pathname.startsWith('/venue') && role !== 'VENUEOWNER') {
            return NextResponse.redirect(new URL('/unauthorized', request.url));
        }
        
        return NextResponse.next();
    } catch (err) {
        console.log(err)
        return NextResponse.redirect(new URL('/auth', request.url));
    }

}
export const config = {
    matcher: [
        '/admin/:path*',
        '/venue/:path*',
    ],
};  