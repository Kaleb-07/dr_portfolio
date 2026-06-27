const Joi = require('joi')

const updateMediaSchema = Joi.object({
  section_type: Joi.string().max(80).optional(),
  eyebrow: Joi.string().max(255).optional(),
  title: Joi.string().optional(),
  subtitle: Joi.string().max(255).optional(),
  description: Joi.string().optional(),
  image_url: Joi.string().max(500).optional(),
  image_alt: Joi.string().max(255).optional(),
  metadata: Joi.object().optional(),
  blocks: Joi.array()
    .items(
      Joi.object({
        block_type: Joi.string().max(80).optional(),
        eyebrow: Joi.string().max(255).optional(),
        title: Joi.string().optional(),
        body: Joi.string().optional(),
        image_url: Joi.string().max(500).optional(),
        image_alt: Joi.string().max(255).optional(),
        metadata: Joi.object().optional(),
        sort_order: Joi.number().integer().optional(),
      }),
    )
    .optional(),
})

module.exports = {
  updateMediaSchema,
}
