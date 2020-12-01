const router = require('express').Router()

router.use('/api', require('./api'))

router.get('/is_running', (req, res, next) => {
  res.send({ response: 'ok' })
})

module.exports = router
