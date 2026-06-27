const Joi = require('joi')

const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().optional(),
  sortBy: Joi.string().optional(),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
})

const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
})

const slugParamSchema = Joi.object({
  slug: Joi.string().required(),
})

module.exports = {
  paginationSchema,
  idParamSchema,
  slugParamSchema,
}
