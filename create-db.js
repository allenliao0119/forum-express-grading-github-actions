const { development: connectSetting } = require('./config/config.json')

const mysql = require('mysql2')

const connection = mysql.createConnection({
  host: connectSetting.host,
  user: connectSetting.username,
  password: connectSetting.password
})

// connect to MySQL server
connection.connect(err => {
  if (err) throw err
  console.log('Sucessfully connect to MySQL server!')

  // create database
  connection.query(`USE ${connectSetting.database}`, (err, result) => {
    if (err) {
      connection.query(`CREATE DATABASE IF NOT EXISTS ${connectSetting.database}`, (err, result) => {
        if (err) throw err
        console.log('Database is successfully created!')
        process.exit()
      })
    } else {
      console.log('Database has already existed.')
      process.exit()
    }
  })
})
