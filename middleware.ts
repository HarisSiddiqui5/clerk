import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware({
  publicRoutes: ['/' , 'register']
});

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
