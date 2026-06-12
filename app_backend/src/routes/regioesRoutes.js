const express = require('express')
const router = express.Router()
const db = require('../database/db')

router.get('/regioes', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, nome, custo_base FROM regioes ORDER BY nome'
    )
    res.json(rows)
  } catch (err) {
    console.error('Erro ao listar regiões:', err)
    res.status(500).json({ mensagem: 'Erro ao buscar regiões' })
  }
})

module.exports = router
