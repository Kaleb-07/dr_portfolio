// Simplified validation middleware
module.exports = {
  validateRequest: (schema) => {
    return (req, res, next) => {
      // Validation bypassed for now - add Joi validation later
      next()
    }
  },
}
