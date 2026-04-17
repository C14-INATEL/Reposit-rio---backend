const express = require('express')
const router = express.Router()
const db = require('../database/db')
const usuariosService = require('../services/usuariosService')

router.get('/usuarios', async (req, res) => {
  try {
    const { tipo } = req.query
    const query = tipo
      ? 'SELECT id, nome, email, tipo FROM usuarios WHERE tipo = ?'
      : 'SELECT id, nome, email, tipo FROM usuarios'
    const params = tipo ? [tipo] : []
    const [rows] = await db.query(query, params)
    res.json(rows)
  } catch (err) {
    console.error('Erro ao listar usuários:', err)
    res.status(500).json({ mensagem: 'Erro ao buscar usuários' })
  }
})

router.post('/cadastro', async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body
    if (!nome || !email || !senha || !tipo) {
      return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' })
    }
    const usuario = await usuariosService.criar({ nome, email, senha, tipo })
    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso', usuario })
  } catch (err) {
    if (err.message === 'EMAIL_JA_CADASTRADO') {
      return res.status(409).json({ mensagem: 'Este e-mail já está em uso.' })
    }
    console.error('Erro ao cadastrar usuário:', err)
    res.status(500).json({ mensagem: 'Erro ao cadastrar usuário' })
  }
})

router.put('/usuarios/:id', async (req, res) => {
  try {
    const { nome, email, tipo } = req.body
    if (!nome || !email || !tipo) {
      return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' })
    }
    await usuariosService.atualizar(req.params.id, { nome, email, tipo })
    res.json({ mensagem: 'Usuário atualizado com sucesso' })
  } catch (err) {
    if (err.message === 'EMAIL_JA_CADASTRADO') {
      return res.status(409).json({ mensagem: 'Este e-mail já está em uso.' })
    }
    console.error('Erro ao atualizar usuário:', err)
    res.status(500).json({ mensagem: 'Erro ao atualizar usuário' })
  }
})

router.delete('/usuarios/:id', async (req, res) => {
  try {
    await usuariosService.excluir(req.params.id)
    res.json({ mensagem: 'Usuário excluído com sucesso' })
  } catch (err) {
    console.error('Erro ao excluir usuário:', err)
    res.status(500).json({ mensagem: 'Não foi possível excluir o usuário' })
  }
})

module.exports = router
