import dotenv from 'dotenv'
dotenv.config()
import https from 'https'
import url from 'url'
import querystring from 'querystring'
import fetch from 'node-fetch'

const redirect_uri = `http://${process.env.backendIPAddress}/courseville/access_token`
const authorization_url = `https://www.mycourseville.com/api/oauth/authorize?response_type=code&client_id=${process.env.client_id}&redirect_uri=${redirect_uri}`
const access_token_url = 'https://www.mycourseville.com/api/oauth/access_token'

export const authApp = (req, res) => {
  res.redirect(authorization_url)
}

export const accessToken = (req, res) => {
  const parsedUrl = url.parse(req.url)
  const parsedQuery = querystring.parse(parsedUrl.query)

  if (parsedQuery.error) {
    res.writeHead(400, { 'Content-Type': 'text/plain' })
    res.end(`Authorization error: ${parsedQuery.error_description}`)
    return
  }

  if (parsedQuery.code) {
    const postData = querystring.stringify({
      grant_type: 'authorization_code',
      code: parsedQuery.code,
      client_id: process.env.client_id,
      client_secret: process.env.client_secret,
      redirect_uri: redirect_uri
    })

    const tokenOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
      }
    }

    const tokenReq = https.request(access_token_url, tokenOptions, tokenRes => {
      let tokenData = ''
      tokenRes.on('data', chunk => {
        tokenData += chunk
      })
      tokenRes.on('end', () => {
        const token = JSON.parse(tokenData)
        req.session.token = token
        console.log('Logging in', req.session.token)
        if (token) {
          res.writeHead(302, {
            Location: `http://${process.env.frontendIPAddress}`
          })
          res.end()
        }
      })
    })
    tokenReq.on('error', err => {
      console.error(err)
    })
    tokenReq.write(postData)
    tokenReq.end()
  } else {
    res.writeHead(302, { Location: authorization_url })
    res.end()
  }
}

export const getProfileInformation = async (req, res) => {
  console.log('Fetching Profile')
  try {
    const profileOptions = {
      headers: {
        Authorization: `Bearer ${req.session.token.access_token}`
      }
    }
    const profileReq = https.request(
      'https://www.mycourseville.com/api/v1/public/get/user/info',
      profileOptions,
      profileRes => {
        let profileData = ''
        profileRes.on('data', chunk => {
          profileData += chunk
        })
        profileRes.on('end', () => {
          const profile = JSON.parse(profileData)
          res.send(profile)
          res.end()
        })
      }
    )
    profileReq.on('error', err => {
      console.error(err)
    })
    profileReq.end()
  } catch (error) {
    console.log(error)
    console.log('Please logout, then login again.')
  }
}

export const getCourses = async (req, res) => {
  console.log('Fetching Courses')
  try {
    const options = {
      headers: {
        Authorization: `Bearer ${req.session.token.access_token}`
      }
    }
    const data = await fetch(
      'https://www.mycourseville.com/api/v1/public/get/user/courses?detail=1',
      options
    )
    const raw = await data.json()
    const rawData = raw.data
    const courses = Object.keys(rawData).reduce(function (r, k) {
      return r.concat(rawData[k])
    }, [])

    res.send(courses)
  } catch (error) {
    console.log(error)
    console.log('Please logout, then login again.')
  }
}

export const getCourseAssignments = (req, _res) => {
  const cv_cid = req.params.cv_cid
  console.log(`Fetching Assignments from ${cv_cid}`)
  const assessmentReq = https.request(
    `https://www.mycourseville.com/api/v1/public/get/course/assignments?cv_cid=${cv_cid}&detail=1`,
    {
      headers: {
        Authorization: `Bearer ${req.session.token.access_token}`
      }
    },
    res => {
      let data = ''
      res.on('data', chunk => {
        data += chunk
      })
      res.on('end', () => {
        const profile = JSON.parse(data)
        _res.send(profile)
        _res.end()
      })
    }
  )
  assessmentReq.on('error', err => {
    console.error(err)
  })
  assessmentReq.end()
}

export const logout = (req, res) => {
  req.session.destroy()
  console.log('LOGOUT')
  res.redirect(`http://${process.env.frontendIPAddress}/index.html`)
  res.end()
}
