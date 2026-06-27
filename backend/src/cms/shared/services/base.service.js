const prisma = require('../../../prisma')

class BaseService {
  constructor(modelName) {
    this.modelName = modelName
    this.model = prisma[modelName]
  }

  async findAll(options = {}) {
    const { page = 1, limit = 10, search, sortBy, sortOrder = 'desc' } = options
    const skip = (page - 1) * limit

    const where = search ? this.buildSearchFilter(search) : {}

    const [data, total] = await Promise.all([
      this.model.findMany({
        where,
        skip,
        take: limit,
        orderBy: sortBy ? { [sortBy]: sortOrder } : { id: sortOrder },
      }),
      this.model.count({ where }),
    ])

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async findById(id) {
    return await this.model.findUnique({
      where: { id: parseInt(id) },
    })
  }

  async findBySlug(slug) {
    return await this.model.findUnique({
      where: { slug },
    })
  }

  async create(data) {
    return await this.model.create({
      data,
    })
  }

  async update(id, data) {
    return await this.model.update({
      where: { id: parseInt(id) },
      data,
    })
  }

  async delete(id) {
    return await this.model.delete({
      where: { id: parseInt(id) },
    })
  }

  buildSearchFilter(search) {
    return {
      OR: Object.keys(this.model.fields).map((field) => ({
        [field]: {
          contains: search,
          mode: 'insensitive',
        },
      })),
    }
  }
}

module.exports = BaseService
