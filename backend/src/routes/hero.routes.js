const express = require('express')
const router = express.Router()
const db = require('../db/db')
const verifyToken = require('../middleware/auth.middleware')

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM hero_section LIMIT 1')

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Hero not found' })
    }

    res.json(rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// UPDATE HERO DATA
router.put('/', verifyToken, async (req, res) => {
  try {
    const {
      name,
      title,
      subtitle,
      description,
      cta_1_label,
      cta_1_path,
      cta_2_label,
      cta_2_path,
      backgroundImage,
    } = req.body

    await db.query(
      `UPDATE hero_section SET
        name = ?,
        title = ?,
        subtitle = ?,
        description = ?,
        cta_1_label = ?,
        cta_1_path = ?,
        cta_2_label = ?,
        cta_2_path = ?,
        backgroundImage = ?
      WHERE id = 1`,
      [
        name,
        title,
        subtitle,
        description,
        cta_1_label,
        cta_1_path,
        cta_2_label,
        cta_2_path,
        backgroundImage,
      ],
    )

    res.json({ message: 'Hero updated successfully 🚀' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
