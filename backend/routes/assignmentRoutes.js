import { Router } from 'express'
import * as assignmentsController from '../controller/assignmentsController.js'

const router = Router()

router.post('/', assignmentController.addAssignment)
router.get('/', assignmentController.getAssignedAssignments)
router.get('/missed', assignmentController.getMissedAssignments)
router.get('/done', assignmentController.getDoneAssignments)
router.get('/courses', assignmentController.getCourses)
router.put('/', assignmentController.updateAssignment)

export default router
