import { withSessionRoute } from '../../../lib/auth/withSession'

export default withSessionRoute(handler)

async function handler (req, res, session) {
  req.session.destroy()
  res.send({ ok: true })
}
