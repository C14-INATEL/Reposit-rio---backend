const express = require('express')
const router = express.Router()
const usuariosController = require('../controllers/usuariosController')

router.get('/usuarios', usuariosController.listar)
router.post('/cadastro', usuariosController.criar)
router.put('/usuarios/:id', usuariosController.atualizar)
router.delete('/usuarios/:id', usuariosController.excluir)

module.exports = router
