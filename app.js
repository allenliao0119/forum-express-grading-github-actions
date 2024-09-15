if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const path = require('path')

const express = require('express')
const handlebars = require('express-handlebars')
const handlebarsHelper = require('./helpers/handlebars-helpers')
const flash = require('connect-flash')
const session = require('express-session')

const passport = require('passport')
const methodOverride = require('method-override')
const { getUser } = require('./helpers/auth-helpers')
const { pages, apis } = require('./routes')

const app = express()
const port = process.env.PORT || 3000

app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelper }))
app.set('view engine', 'hbs')

app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = getUser(req)
  next()
})

app.use('/api', apis)
app.use(pages)

app.listen(port, () => {
  console.info(`App is listening on port ${port}!`)
})

module.exports = app
