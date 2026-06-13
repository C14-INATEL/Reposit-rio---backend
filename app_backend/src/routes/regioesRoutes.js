const express = require('express')
const router = express.Router()
const regioesController = require('../controllers/regioesController')

router.get('/regioes', regioesController.listar)

module.exports = router
