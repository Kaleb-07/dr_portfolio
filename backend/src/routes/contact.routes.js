const express = require('express')
const router = express.Router()
const prisma = require('../prisma')

/* ─── Contact Settings ──────────────────────────────────── */
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
    await prisma.contact_settings.upsert({
      where: { id: 1 },
      update: {
        heading: data.heading,
        email: data.email,
        phone: data.phone,
        location: data.location,
        image_url: data.image_url,
        image_caption: data.image_caption,
      },
      create: {
        id: 1,
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

/* ─── Inquiry Types ─────────────────────────────────────── */
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

/* ─── Contact Messages ──────────────────────────────────── */

// GET all messages – map is_read to read for frontend compatibility
router.get('/messages', async (req, res) => {
  try {
    const messages = await prisma.contact_messages.findMany({
      orderBy: { created_at: 'desc' },
    })

    const mapped = messages.map((m) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      phone: m.phone,
      organization: m.organization,
      subject: m.subject,
      message: m.message,
      inquiry_type: m.inquiry_type,
      created_at: m.created_at,
      read: m.is_read || false, // map DB field to frontend field
    }))

    res.json(mapped)
  } catch (error) {
    console.error('Failed to load messages:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET unread count – returns number of unread messages
router.get('/messages/unread-count', async (req, res) => {
  try {
    const count = await prisma.contact_messages.count({
      where: { is_read: false },
    })
    res.json({ count })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST new message from public contact form
router.post('/messages', async (req, res) => {
  try {
    const { name, email, organization, phone, subject, message, inquiryType } = req.body

    const newMessage = await prisma.contact_messages.create({
      data: {
        name,
        email,
        organization,
        phone: phone || null,
        inquiry_type: inquiryType,
        subject,
        message,
      },
    })

    res.status(201).json({ id: newMessage.id, success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// PATCH – mark a message as read
router.patch('/messages/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { read } = req.body // frontend sends { read: true }

    await prisma.contact_messages.update({
      where: { id: Number(id) },
      data: { is_read: read }, // map frontend `read` to DB `is_read`
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Failed to mark message read:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE a message
router.delete('/messages/:id', async (req, res) => {
  try {
    const { id } = req.params
    await prisma.contact_messages.delete({
      where: { id: Number(id) },
    })
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
