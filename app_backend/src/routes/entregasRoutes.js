const express = require('express')
const router = express.Router()
const entregasController = require('../controllers/entregasController')

router.get('/entregas', entregasController.listar)
router.get('/entregas/:id', entregasController.buscarPorId)
router.post('/entregas', entregasController.criar)
router.put('/entregas/:id', entregasController.atualizar)
router.patch('/entregas/:id', entregasController.atualizar)
router.delete('/entregas/:id', entregasController.excluir)

module.exports = router
