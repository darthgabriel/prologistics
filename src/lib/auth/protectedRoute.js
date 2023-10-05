import { withSessionSsr } from '@/lib/auth/withSession'

const protectedRoute = () => withSessionSsr(
  async ({ req, res, resolvedUrl }) => {
    const user = req.session.user
    if (!user) return noPass()
    const pass = user.routes.find(e => resolvedUrl.includes(e))
    if (!pass) return noPass(user)
    return {
      props: { user }
    }
  }
)

const noPass = (user = null) => {
  return {
    redirect: {
      destination: user ? '/auth/profile' : '/auth/login',
      notFound: true,
      permanent: false
    }
  }
}

export default protectedRoute
