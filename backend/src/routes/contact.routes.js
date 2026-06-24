const express = require('express')
const router = express.Router()
const pool = require('../db/db')

/* ---------------- SETTINGS ---------------- */
router.get('/settings', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM contact_settings LIMIT 1')
  res.json(rows[0] || {})
})

router.put('/settings', async (req, res) => {
  const data = req.body

  await pool.query(
    `
    UPDATE contact_settings SET
    heading=?,
    email=?,
    phone=?,
    location=?,
    image_url=?,
    image_caption=?
    WHERE id=1
  `,
    [data.heading, data.email, data.phone, data.location, data.image_url, data.image_caption],
  )

  res.json({ success: true })
})

/* ---------------- INQUIRY TYPES ---------------- */
router.get('/inquiry-types', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM inquiry_types ORDER BY sort_order ASC')
  res.json(rows)
})

router.post('/inquiry-types', async (req, res) => {
  const { label, value } = req.body
  await pool.query('INSERT INTO inquiry_types (label, value) VALUES (?, ?)', [label, value])
  res.json({ success: true })
})

router.put('/inquiry-types/:id', async (req, res) => {
  const { id } = req.params
  const { label, value } = req.body

  await pool.query('UPDATE inquiry_types SET label=?, value=? WHERE id=?', [label, value, id])

  res.json({ success: true })
})

router.delete('/inquiry-types/:id', async (req, res) => {
  const { id } = req.params
  await pool.query('DELETE FROM inquiry_types WHERE id=?', [id])
  res.json({ success: true })
})

module.exports = router
