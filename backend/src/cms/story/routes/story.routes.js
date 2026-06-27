const express = require('express')
const router = express.Router()
const { verifyToken } = require('../../../middleware/auth.middleware')
const storyController = require('../controllers/story.controller')
const { updateStorySchema } = require('../validations/story.validation')
const { validateRequest } = require('../../shared/middleware/validation.middleware')

router.get('/', storyController.getStory)

router.put('/', verifyToken, validateRequest(updateStorySchema), storyController.updateStory)

module.exports = router
