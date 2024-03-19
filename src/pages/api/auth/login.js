import { withSessionRoute } from '../../../lib/auth/withSession'

export default withSessionRoute(handler)

async function handler (req, res) {
  const ROUTES = ['/']
  const ID = process.env.LOGINID || 1
  const USERNAME = process.env.LOGINUSER || 'admin'
  const PASSWORD = process.env.LOGINPASSWORD || 'ocg159753'

  if (req.method === 'POST') {
    const { username, password } = req.body

    const user = username === USERNAME && password === PASSWORD

    if (user) {
      req.session.user = {
        id: ID,
        username: USERNAME,
        fullname: 'Admin',
        routes: ['/auth/profile', ...ROUTES]
      }
      await req.session.save()
      return res.send(req.session.user)
    }
    return res.status(401).send('NO VALID')
  }
  return res.status(404).send('')
}
