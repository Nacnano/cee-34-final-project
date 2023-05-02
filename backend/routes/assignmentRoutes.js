import { Router } from 'express'
import * as assignmentsController from '../controller/assignmentsController.js'

const router = Router()

router.get('/', assignmentsController.getReminders)
router.post('/', assignmentsController.addReminder)
router.delete('/:reminder_id', assignmentsController.deleteReminder)

export default router
