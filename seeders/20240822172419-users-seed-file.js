'use strict'

const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        name: 'admin',
        email: 'root@example.com',
        password: await bcrypt.hash('12345678', 10),
        is_admin: true,
        image: `https://loremflickr.com/320/240/human/?random=${Math.random() * 100}`,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'user1',
        email: 'user1@example.com',
        password: await bcrypt.hash('12345678', 10),
        is_admin: false,
        image: `https://loremflickr.com/320/240/human/?random=${Math.random() * 100}`,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'user2',
        email: 'user2@example.com',
        password: await bcrypt.hash('12345678', 10),
        is_admin: false,
        image: `https://loremflickr.com/320/240/human/?random=${Math.random() * 100}`,
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null)
  }
}
