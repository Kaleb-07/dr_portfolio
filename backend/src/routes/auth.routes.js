const express = require('express')
const router = express.Router()
const db = require('../db/db')
const jwt = require('jsonwebtoken')
const SECRET = 'mysecretkey'

router.post('/login', async (req, res) => {
  try {
    console.log('BODY:', req.body) // 👈 ADD THIS

    const { email, password } = req.body

    const [rows] = await db.query('SELECT * FROM admin WHERE email = ? AND password = ?', [
      email,
      password,
    ])

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const admin = rows[0]

    const token = jwt.sign({ id: admin.id, email: admin.email }, SECRET, { expiresIn: '1d' })

    res.json({ token, message: 'Login successful' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
