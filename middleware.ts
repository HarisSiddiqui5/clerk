import { NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default function middleware(req: NextRequest) {
  const { userId } = getAuth(req);
  const publicRoutes = ["/", "/register" ,"/profile"];
  const url = req.nextUrl.pathname;

  if (publicRoutes.includes(url)) {
    return NextResponse.next();
  }

  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match public routes like home and register
    '/(?!sign-in|sign-up|register).*', // Skip authentication check for sign-in, sign-up, register

    // Always run for API routes
    '/(api|trpc)(.*)',

    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};
