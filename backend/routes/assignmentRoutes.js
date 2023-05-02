import { Router } from 'express'
import * as assignmentsController from '../controller/assignmentsController.js'
import auth from '../middleware/auth.js'

const router = Router()

router.get('/', auth, assignmentsController.getReminders)
router.post('/', auth, assignmentsController.addReminder)
router.delete('/:reminder_id', auth, assignmentsController.deleteReminder)

export default router
