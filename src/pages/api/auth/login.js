import { withSessionRoute } from '../../../lib/auth/withSession'

const ROUTES = ['/']
const ID = '1'
const USERNAME = 'admin'
const PASSWORD = '123456'

export default withSessionRoute(handler)

async function handler (req, res) {
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
