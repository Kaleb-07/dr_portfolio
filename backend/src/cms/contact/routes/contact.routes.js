const express = require('express')
const router = express.Router()
const { verifyToken } = require('../../../middleware/auth.middleware')
const contactController = require('../controllers/contact.controller')
const {
  updateContactSettingsSchema,
  updateContactMessageSchema,
} = require('../validations/contact.validation')
const { validateRequest } = require('../../shared/middleware/validation.middleware')

// Public routes
router.get('/settings', contactController.getContactSettings)
router.post('/messages', contactController.getContactMessages)

// Admin routes
router.put(
  '/settings',
  verifyToken,
  validateRequest(updateContactSettingsSchema),
  contactController.updateContactSettings,
)
router.get('/messages/:id', verifyToken, contactController.getContactMessage)
router.put(
  '/messages/:id',
  verifyToken,
  validateRequest(updateContactMessageSchema),
  contactController.updateContactMessage,
)
router.delete('/messages/:id', verifyToken, contactController.deleteContactMessage)

module.exports = router
