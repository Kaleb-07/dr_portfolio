const Joi = require('joi')

const updateContactSettingsSchema = Joi.object({
  heading: Joi.string().max(255).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().max(100).optional(),
  location: Joi.string().optional(),
  image_url: Joi.string().max(500).optional(),
  image_caption: Joi.string().max(255).optional(),
})

const updateContactMessageSchema = Joi.object({
  is_read: Joi.boolean().optional(),
  name: Joi.string().max(255).optional(),
  email: Joi.string().email().optional(),
  organization: Joi.string().max(255).optional(),
  phone: Joi.string().max(100).optional(),
  inquiry_type: Joi.string().max(255).optional(),
  subject: Joi.string().max(255).optional(),
  message: Joi.string().optional(),
})

module.exports = {
  updateContactSettingsSchema,
  updateContactMessageSchema,
}
