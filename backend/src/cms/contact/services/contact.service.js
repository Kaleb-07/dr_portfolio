const prisma = require('../../../prisma')
const BaseService = require('../../shared/services/base.service')

class ContactService extends BaseService {
  constructor() {
    super('contact_settings')
  }

  async getContactSettings() {
    return await this.model.findFirst()
  }

  async updateContactSettings(data) {
    const existing = await this.model.findFirst()

    if (!existing) {
      return await this.model.create({
        data: {
          heading: data.heading || null,
          email: data.email || null,
          phone: data.phone || null,
          location: data.location || null,
          image_url: data.image_url || null,
          image_caption: data.image_caption || null,
        },
      })
    }

    return await this.model.update({
      where: { id: existing.id },
      data: {
        heading: data.heading !== undefined ? data.heading : existing.heading,
        email: data.email !== undefined ? data.email : existing.email,
        phone: data.phone !== undefined ? data.phone : existing.phone,
        location: data.location !== undefined ? data.location : existing.location,
        image_url: data.image_url !== undefined ? data.image_url : existing.image_url,
        image_caption:
          data.image_caption !== undefined ? data.image_caption : existing.image_caption,
      },
    })
  }

  async getContactMessages(options = {}) {
    const { page = 1, limit = 10 } = options
    const skip = (page - 1) * limit

    const [messages, total] = await Promise.all([
      prisma.contact_messages.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      prisma.contact_messages.count(),
    ])

    return {
      data: messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async getContactMessageById(id) {
    return await prisma.contact_messages.findUnique({
      where: { id: parseInt(id) },
    })
  }

  async updateContactMessage(id, data) {
    return await prisma.contact_messages.update({
      where: { id: parseInt(id) },
      data: {
        is_read: data.is_read !== undefined ? data.is_read : undefined,
        name: data.name !== undefined ? data.name : undefined,
        email: data.email !== undefined ? data.email : undefined,
        organization: data.organization !== undefined ? data.organization : undefined,
        phone: data.phone !== undefined ? data.phone : undefined,
        inquiry_type: data.inquiry_type !== undefined ? data.inquiry_type : undefined,
        subject: data.subject !== undefined ? data.subject : undefined,
        message: data.message !== undefined ? data.message : undefined,
      },
    })
  }

  async deleteContactMessage(id) {
    return await prisma.contact_messages.delete({
      where: { id: parseInt(id) },
    })
  }
}

module.exports = new ContactService()
