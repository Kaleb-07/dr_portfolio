const prisma = require('../../../prisma')

class HeroService {
  async getHero() {
    const hero = await prisma.hero_section.findFirst()
    return hero
  }

  async updateHero(data) {
    const hero = await prisma.hero_section.findFirst()

    if (!hero) {
      return await prisma.hero_section.create({
        data: {
          name: data.name || null,
          title: data.title || null,
          subtitle: data.subtitle || null,
          description: data.description || null,
          cta_1_label: data.cta_1_label || null,
          cta_1_path: data.cta_1_path || null,
          cta_2_label: data.cta_2_label || null,
          cta_2_path: data.cta_2_path || null,
          backgroundImage: data.backgroundImage || data.background_image || null,
        },
      })
    }

    return await prisma.hero_section.update({
      where: { id: hero.id },
      data: {
        name: data.name !== undefined ? data.name : hero.name,
        title: data.title !== undefined ? data.title : hero.title,
        subtitle: data.subtitle !== undefined ? data.subtitle : hero.subtitle,
        description: data.description !== undefined ? data.description : hero.description,
        cta_1_label: data.cta_1_label !== undefined ? data.cta_1_label : hero.cta_1_label,
        cta_1_path: data.cta_1_path !== undefined ? data.cta_1_path : hero.cta_1_path,
        cta_2_label: data.cta_2_label !== undefined ? data.cta_2_label : hero.cta_2_label,
        cta_2_path: data.cta_2_path !== undefined ? data.cta_2_path : hero.cta_2_path,
        backgroundImage:
          data.backgroundImage !== undefined
            ? data.backgroundImage
            : data.background_image !== undefined
              ? data.background_image
              : hero.backgroundImage,
      },
    })
  }
}

module.exports = new HeroService()
