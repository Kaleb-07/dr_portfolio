const Joi = require('joi')

const updateHeroSchema = Joi.object({
  name: Joi.string().max(255).optional(),
  title: Joi.string().max(255).optional(),
  subtitle: Joi.string().max(255).optional(),
  description: Joi.string().optional(),
  cta_1_label: Joi.string().max(255).optional(),
  cta_1_path: Joi.string().max(255).optional(),
  cta_2_label: Joi.string().max(255).optional(),
  cta_2_path: Joi.string().max(255).optional(),
  backgroundImage: Joi.string().max(500).optional(),
  background_image: Joi.string().max(500).optional(),
})

module.exports = {
  updateHeroSchema,
}
