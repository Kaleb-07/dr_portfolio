const express = require('express')
const router = express.Router()
const { verifyToken } = require('../../../middleware/auth.middleware')
const mediaController = require('../controllers/media.controller')
const { updateMediaSchema } = require('../validations/media.validation')
const { validateRequest } = require('../../shared/middleware/validation.middleware')

router.get('/', mediaController.getMedia)

router.put('/', verifyToken, validateRequest(updateMediaSchema), mediaController.updateMedia)

module.exports = router
