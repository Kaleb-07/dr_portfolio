const asyncHandler = require('../../../utils/asyncHandler')
const contactService = require('../services/contact.service')

const getContactSettings = asyncHandler(async (req, res) => {
  const settings = await contactService.getContactSettings()
  res.json({ success: true, data: settings })
})

const updateContactSettings = asyncHandler(async (req, res) => {
  const settings = await contactService.updateContactSettings(req.body)
  res.json({ success: true, data: settings, message: 'Contact settings updated successfully' })
})

const getContactMessages = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query
  const result = await contactService.getContactMessages({ page, limit })
  res.json({ success: true, ...result })
})

const getContactMessage = asyncHandler(async (req, res) => {
  const message = await contactService.getContactMessageById(req.params.id)
  res.json({ success: true, data: message })
})

const updateContactMessage = asyncHandler(async (req, res) => {
  const message = await contactService.updateContactMessage(req.params.id, req.body)
  res.json({ success: true, data: message, message: 'Message updated successfully' })
})

const deleteContactMessage = asyncHandler(async (req, res) => {
  await contactService.deleteContactMessage(req.params.id)
  res.json({ success: true, message: 'Message deleted successfully' })
})

module.exports = {
  getContactSettings,
  updateContactSettings,
  getContactMessages,
  getContactMessage,
  updateContactMessage,
  deleteContactMessage,
}
