'use strict'

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const categories = await queryInterface.sequelize.query(
      'SELECT id FROM Categories',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Restaurants',
      Array.from({ length: 50 }).map(() => ({
        name: faker.name.findName(),
        tel: faker.phone.phoneNumber(),
        opening_hours: '08:00',
        address: faker.address.streetAddress(),
        description: faker.lorem.text(),
        image: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`,
        created_at: new Date(),
        updated_at: new Date(),
        category_id: categories[Math.floor(Math.random() * categories.length)].id
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Restaurants', null)
  }
}
