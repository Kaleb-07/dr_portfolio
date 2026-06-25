const express = require('express')
const router = express.Router()
const prisma = require('../prisma')
const jwt = require('jsonwebtoken')
const SECRET = 'mysecretkey'

router.post('/login', async (req, res) => {
  try {
    console.log('BODY:', req.body)

    const { email, password } = req.body

    const admin = await prisma.admin.findFirst({
      where: {
        email,
        password,
      },
    })

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign({ id: admin.id, email: admin.email }, SECRET, { expiresIn: '1d' })

    res.json({ token, message: 'Login successful' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
