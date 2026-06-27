const express = require('express')
const router = express.Router()
const { verifyToken } = require('../../../middleware/auth.middleware')
const educationController = require('../controllers/education.controller')
const { updateEducationSchema } = require('../validations/education.validation')
const { validateRequest } = require('../../shared/middleware/validation.middleware')

router.get('/', educationController.getEducation)

router.put(
  '/',
  verifyToken,
  validateRequest(updateEducationSchema),
  educationController.updateEducation,
)

module.exports = router
