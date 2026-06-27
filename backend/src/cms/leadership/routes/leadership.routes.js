const express = require('express')
const router = express.Router()
const { verifyToken } = require('../../../middleware/auth.middleware')
const leadershipController = require('../controllers/leadership.controller')
const { updateLeadershipSchema } = require('../validations/leadership.validation')
const { validateRequest } = require('../../shared/middleware/validation.middleware')

router.get('/', leadershipController.getLeadership)

router.put(
  '/',
  verifyToken,
  validateRequest(updateLeadershipSchema),
  leadershipController.updateLeadership,
)

module.exports = router
