import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUserFromToken } from './utils/jwt';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('accessToken')?.value;

    // Nếu vào "/" -> chuyển về auth
    if (pathname === '/') {
        return NextResponse.redirect(new URL('/auth', request.url));
    }

    // Nếu chưa login mà vào admin/venue/staff
    if (!token && (pathname.startsWith('/admin') || pathname.startsWith('/venue') || pathname.startsWith('/staff'))) {
        return NextResponse.redirect(new URL('/auth', request.url));
    }

    // Nếu đã login mà vào auth
    if (token && pathname.startsWith('/auth')) {
        try {
            const role = getUserFromToken(token).role;

            if (role === 'ADMIN') {
                return NextResponse.redirect(new URL('/admin', request.url));
            }

            if (role === 'VENUEOWNER') {
                return NextResponse.redirect(new URL('/venue', request.url));
            }

            if (role === 'STAFF') {
                const locationId = getUserFromToken(token).assignedVenueLocationId;

                return NextResponse.redirect(
                    new URL(`/staff/redeem?locationId=${locationId}`, request.url)
                );
            }
        } catch {
            return NextResponse.redirect(new URL('/auth', request.url));
        }
    }

    // Check role
    if (token) {
        try {
            const role = getUserFromToken(token).role;

            if (pathname.startsWith('/admin') && role !== 'ADMIN') {
                return NextResponse.redirect(new URL('/unauthorized', request.url));
            }

            if (pathname.startsWith('/venue') && role !== 'VENUEOWNER') {
                return NextResponse.redirect(new URL('/unauthorized', request.url));
            }

            if (pathname.startsWith('/staff') && role !== 'STAFF') {
                return NextResponse.redirect(new URL('/unauthorized', request.url));
            }
        } catch {
            return NextResponse.redirect(new URL('/auth', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/auth',
        '/admin/:path*',
        '/venue/:path*',
        '/staff/:path*',
    ],
};