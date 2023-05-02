import CoursevilleUtils from '../utils/coursevilleUtils.js'
import { authorization_url } from '../controller/coursevilleController.js'

export default async (req, res, next) => {
  const user = await CoursevilleUtils.getProfileInformation(req)
  if (user !== null) {
    req.user = user
    next()
    return
  }

  //   res.status(401).send({ error: 'Unauthorized' })
  res.writeHead(302, { Location: authorization_url })
  res.end()
}
