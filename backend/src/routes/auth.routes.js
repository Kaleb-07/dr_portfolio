const express = require('express')
const router = express.Router()
const prisma = require('../prisma')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { verifyToken } = require('../middleware/auth.middleware')
const SECRET = 'mysecretkey'

router.post('/login', async (req, res) => {
  try {
    console.log('BODY:', req.body)

    const { email, password } = req.body

    const admin = await prisma.admin.findFirst({
      where: { email },
    })

    if (!admin || !admin.password) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password)

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign({ id: admin.id, email: admin.email }, SECRET, { expiresIn: '1d' })

    res.json({ token, message: 'Login successful' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/profile', verifyToken, async (req, res) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true },
    })

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' })
    }

    res.json(admin)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { name, email, password } = req.body

    const data = {}
    if (email) data.email = email
    if (name !== undefined) data.name = name

    if (password) {
      data.password = await bcrypt.hash(password, 10)
    }

    const updated = await prisma.admin.update({
      where: { id: req.user.id },
      data,
      select: { id: true, email: true, name: true },
    })

    res.json({ message: 'Profile updated', admin: updated })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
