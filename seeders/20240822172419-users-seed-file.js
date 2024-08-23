'use strict'

const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        email: 'root@example.com',
        password: await bcrypt.hash('123', 10),
        is_admin: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        email: 'user1@example.com',
        password: await bcrypt.hash('123', 10),
        is_admin: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        email: 'user2@example.com',
        password: await bcrypt.hash('123', 10),
        is_admin: false,
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null)
  }
}
