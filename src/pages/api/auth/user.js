import { withSessionRoute } from '../../../lib/auth/withSession'

export default withSessionRoute(async (req, res) => {
  const user = req.session.user

  if (user) {
    delete user.routes
    res.send(user)
  } else {
    res.send({})
  }
})
