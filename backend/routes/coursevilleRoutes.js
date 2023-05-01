import { Router } from 'express'
import * as coursevilleController from '../controller/coursevilleController.js'

const router = Router()

router.get('/auth_app', coursevilleController.authApp)
router.get('/access_token', coursevilleController.accessToken)
router.get('/me', coursevilleController.getProfileInformation)
router.get('/get_courses', coursevilleController.getCourses)
router.get(
  '/get_course_assignments',
  coursevilleController.getCourseAssignments
)
router.get('/logout', coursevilleController.logout)

export default router
