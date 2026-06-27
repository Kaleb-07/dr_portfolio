const express = require('express')
const router = express.Router()
const { verifyToken } = require('../../../middleware/auth.middleware')
const heroController = require('../controllers/hero.controller')

router.get('/', heroController.getHero)

// Simplified - no validation for now
router.put('/', verifyToken, heroController.updateHero)

module.exports = router
