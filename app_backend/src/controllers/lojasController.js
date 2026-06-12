const lojasService = require('../services/lojasService')

exports.listar = async (req, res) => {
  try {
    const { usuario_id } = req.query
    const filtro = usuario_id ? { usuarioId: Number(usuario_id) } : {}
    const lojas = await lojasService.listar(filtro)
    res.json(lojas)
  } catch (err) {
    console.error('Erro ao listar lojas:', err)
    res.status(500).json({ mensagem: 'Erro ao listar lojas' })
  }
}

exports.criar = async (req, res) => {
  try {
    const { nome, endereco, telefone, usuario_id } = req.body

    if (!nome || !usuario_id || typeof nome !== 'string' || typeof usuario_id !== 'number') {
      return res.status(400).json({ mensagem: 'Nome e usuário são obrigatórios' })
    }

    const novaLoja = await lojasService.criar({ nome, endereco, telefone, usuario_id })
    res.status(201).json({ mensagem: 'Loja criada com sucesso', loja: novaLoja })
  } catch (err) {
    console.error('Erro ao criar loja:', err)
    res.status(500).json({ mensagem: 'Erro ao criar loja' })
  }
}

exports.atualizar = async (req, res) => {
  try {
    if (isNaN(Number(req.params.id))) {
      return res.status(400).json({ mensagem: 'ID inválido' })
    }

    const { nome, endereco, telefone, usuario_id } = req.body

    if (!nome || !usuario_id || typeof nome !== 'string' || typeof usuario_id !== 'number') {
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
    if (isNaN(Number(req.params.id))) {
      return res.status(400).json({ mensagem: 'ID inválido' })
    }

    await lojasService.excluir(req.params.id)
    res.json({ mensagem: 'Loja excluída com sucesso' })
  } catch (err) {
    console.error('Erro ao excluir loja:', err)
    res.status(500).json({ mensagem: 'Erro ao excluir loja' })
  }
}