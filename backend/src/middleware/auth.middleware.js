const jwt = require('jsonwebtoken')

const SECRET = 'mysecretkey'

function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const parts = authHeader.split(' ')

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Invalid auth format' })
    }

    const token = parts[1]

    const decoded = jwt.verify(token, SECRET)

    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

module.exports = verifyToken
