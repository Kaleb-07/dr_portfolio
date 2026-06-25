const express = require('express')
const router = express.Router()
const prisma = require('../prisma')

router.get('/settings', async (req, res) => {
  try {
    const settings = await prisma.contact_settings.findFirst()
    res.json(settings || {})
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/settings', async (req, res) => {
  try {
    const data = req.body
    await prisma.contact_settings.update({
      where: { id: 1 },
      data: {
        heading: data.heading,
        email: data.email,
        phone: data.phone,
        location: data.location,
        image_url: data.image_url,
        image_caption: data.image_caption,
      },
    })
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/* ---------------- INQUIRY TYPES ---------------- */
router.get('/inquiry-types', async (req, res) => {
  try {
    const types = await prisma.inquiry_types.findMany({
      orderBy: { sort_order: 'asc' },
    })
    res.json(types)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/inquiry-types', async (req, res) => {
  try {
    const { label, value } = req.body
    await prisma.inquiry_types.create({
      data: { label, value },
    })
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/inquiry-types/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { label, value } = req.body
    await prisma.inquiry_types.update({
      where: { id: Number(id) },
      data: { label, value },
    })
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/inquiry-types/:id', async (req, res) => {
  try {
    const { id } = req.params
    await prisma.inquiry_types.delete({
      where: { id: Number(id) },
    })
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/* ---------------- MESSAGES ---------------- */
// POST – create a new contact message
router.post('/messages', async (req, res) => {
  try {
    const { name, email, organization, phone, subject, message, inquiryType } = req.body

    const newMessage = await prisma.contact_messages.create({
      data: {
        name,
        email,
        organization,
        phone: phone || null,
        inquiry_type: inquiryType, // frontend sends camelCase → backend uses snake_case
        subject,
        message,
      },
    })

    res.status(201).json({ id: newMessage.id, success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Optional: GET messages (for admin)
router.get('/messages', async (req, res) => {
  try {
    const messages = await prisma.contact_messages.findMany({
      orderBy: { created_at: 'desc' },
    })
    res.json(messages)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
