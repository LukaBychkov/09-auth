// proxy.ts

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parseSetCookie } from 'cookie';
import { checkSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  // Путь, на который пользователь пытается перейти
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route));

  if (!accessToken) {
    if (refreshToken) {
      // Если accessToken отсутствует, но есть refreshToken нужно проверить сессию даже для публичного маршрута,
      // ведь сессия может оставаться активной, и тогда следует запретить доступ к публичному маршруту.
      const data = await checkSession();
      const setCookie = data.headers['set-cookie'];

      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
        for (const cookieStr of cookieArray) {
          const parsed = parseSetCookie(cookieStr);

          if (parsed.value) {
            cookieStore.set(parsed.name, parsed.value, parsed);
          }
        }

        // Если сессия все еще активна:
        // для публичного маршрута выполняем редирект на главную.
        // важно передаем новые cookie дальше, чтобы обновить их в браузере
        if (isPublicRoute) {
          return NextResponse.redirect(new URL('/', request.url), {
            headers: {
              Cookie: cookieStore.toString(),
            },
          });
        }
        // для частного маршрута разрешаем доступ
        if (isPrivateRoute) {
          return NextResponse.next({
            headers: {
              Cookie: cookieStore.toString(),
            },
          });
        }
      }
    }
    // Если refreshToken или сессии нет:
    // публичный маршрут разрешаем доступ
    if (isPublicRoute) {
      return NextResponse.next();
    }

    // закрытый маршрут  редирект на страницу входа
    if (isPrivateRoute) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  // Если accessToken существует:
  // публичный маршрут выполняем редирект на главную
  if (isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  // частный маршрут разрешаем доступ
  if (isPrivateRoute) {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
