const lojasService = require('../services/lojasService')

exports.listar = async (req, res) => {
  try {
    const lojas = await lojasService.listar()
    res.json(lojas)
  } catch (err) {
    console.error('Erro ao listar lojas:', err)
    res.status(500).json({ mensagem: 'Erro ao buscar lojas' })
  }
}

exports.criar = async (req, res) => {
  try {
    const { nome, endereco, telefone, usuario_id } = req.body
    if (!nome || !usuario_id) {
      return res.status(400).json({ mensagem: 'Nome e usuário são obrigatórios' })
    }
    const loja = await lojasService.criar({ nome, endereco, telefone, usuario_id })
    res.status(201).json(loja)
  } catch (err) {
    console.error('Erro ao criar loja:', err)
    res.status(500).json({ mensagem: 'Erro ao cadastrar loja' })
  }
}

exports.atualizar = async (req, res) => {
  try {
    const { nome, endereco, telefone, usuario_id } = req.body
    if (!nome || !usuario_id) {
      return res.status(400).json({ mensagem: 'Nome e usuário são obrigatórios' })
    }
    await lojasService.atualizar(req.params.id, { nome, endereco, telefone, usuario_id })
    res.json({ mensagem: 'Loja atualizada com sucesso' })
  } catch (err) {
    console.error('Erro ao atualizar loja:', err)
    res.status(500).json({ mensagem: 'Erro ao atualizar loja' })
  }
}

exports.excluir = async (req, res) => {
  try {
    await lojasService.excluir(req.params.id)
    res.json({ mensagem: 'Loja excluída com sucesso' })
  } catch (err) {
    console.error('Erro ao excluir loja:', err)
    res.status(500).json({ mensagem: 'Não foi possível excluir a loja' })
  }
}
