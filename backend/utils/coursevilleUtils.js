import https from 'https'

class CoursevilleUtils {
  static async getProfileInformation (req) {
    const options = {
      headers: {
        Authorization: `Bearer ${req.session.token.access_token}`
      }
    }

    return new Promise((resolve, reject) => {
      const profileReq = https.request(
        'https://www.mycourseville.com/api/v1/public/users/me',
        options,
        profileRes => {
          let profileData = ''
          profileRes.on('data', chunk => {
            profileData += chunk
          })
          profileRes.on('end', () => {
            const profile = JSON.parse(profileData)
            resolve(profile)
          })
        }
      )
      profileReq.on('error', err => {
        reject(err)
      })
      profileReq.end()
    })
  }
}

export default CoursevilleUtils
