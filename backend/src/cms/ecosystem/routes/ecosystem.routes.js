const express = require('express')
const router = express.Router()
const { verifyToken } = require('../../../middleware/auth.middleware')
const ecosystemController = require('../controllers/ecosystem.controller')
const { updateEcosystemSchema } = require('../validations/ecosystem.validation')
const { validateRequest } = require('../../shared/middleware/validation.middleware')

router.get('/', ecosystemController.getEcosystem)

router.put(
  '/',
  verifyToken,
  validateRequest(updateEcosystemSchema),
  ecosystemController.updateEcosystem,
)

module.exports = router
