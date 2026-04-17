const express = require('express')
const router = express.Router()
const lojasController = require('../controllers/lojasController')

router.get('/lojas', lojasController.listar)
router.post('/lojas', lojasController.criar)
router.put('/lojas/:id', lojasController.atualizar)
router.delete('/lojas/:id', lojasController.excluir)

module.exports = router
