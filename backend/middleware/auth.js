import CoursevilleUtils from '../utils/coursevilleUtils.js'

export default async (req, res, next) => {
  const user = await CoursevilleUtils.getProfileInformation(req)
  console.log(user)
  if (user !== null) {
    req.user = user
    next()
    return
  }
  res.writeHead(302, { Location: authorization_url })
  res.end()
}
