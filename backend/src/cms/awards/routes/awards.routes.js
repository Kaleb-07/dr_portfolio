const express = require('express')
const router = express.Router()
const { verifyToken } = require('../../../middleware/auth.middleware')
const awardsController = require('../controllers/awards.controller')
const { updateAwardsSchema } = require('../validations/awards.validation')
const { validateRequest } = require('../../shared/middleware/validation.middleware')

router.get('/', awardsController.getAwards)

router.put('/', verifyToken, validateRequest(updateAwardsSchema), awardsController.updateAwards)

module.exports = router
