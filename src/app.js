require('module-alias/register')
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const process = require('process')
const util = require('util')
const config = require('config')
require('express-async-errors')

const init = async () => {
  console.log(util.inspect(config, { depth: null }))

  const isProduction = process.env.NODE_ENV === 'production'

  const app = express()

  if (config.get('api.allowCors')) {
    const cors = require('cors')
    app.use(cors())
  }

  app.use(morgan('common'))

  app.use(
    express.json({
      verify: function (req, res, buf) {
        if (req.originalUrl === '/api/stripe/webhook') {
          req.rawBody = buf.toString()
        }
      }
    })
  )

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  mongoose.set('debug', config.get('mongo.debug'))
  mongoose.set('useFindAndModify', false)
  mongoose.set('useCreateIndex', true)

  mongoose.connect(config.get('mongo.uri'), { useUnifiedTopology: true, useNewUrlParser: true }).catch((error) => {
    console.error(error)
    process.exit(1)
  })

  require('./models')

  app.use(require('./routes'))

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
  })

  /// error handlers
  if (!isProduction) {
    app.use(function (err, req, res, next) {
      console.log(err.stack)

      res.status(err.status || 500)

      res.json({
        errors: {
          message: err.message,
          error: err
        }
      })
    })
  } else {
    app.use(function (err, req, res, next) {
      res.status(err.status || 500)
      res.json({
        errors: {
          message: err.message,
          error: {}
        }
      })
    })
  }

  // finally, let's start our server...
  const server = app.listen(config.get('api.port') || 8080, function () {
    console.log('Listening on port ' + server.address().port)
  })
}

init()
