export const ironOptions = {
  cookieName: 'authsession',
  password: process.env.NEXT_PUBLIC_AUTH,
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production'
  }
}
