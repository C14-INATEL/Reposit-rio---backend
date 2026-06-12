const entregasService = require('../services/entregasService')

const PRIORIDADES_VALIDAS = ['baixa', 'media', 'alta', 'urgente']
const STATUS_VALIDOS = ['criado', 'andamento', 'enviado', 'entregue', 'cancelado']

exports.listar = async (req, res) => {
  try {
    const { lojista_id } = req.query
    const filtro = lojista_id ? { lojistaId: Number(lojista_id) } : {}
    const entregas = await entregasService.listar(filtro)
    res.json(entregas)
  } catch (err) {
    console.error('Erro ao listar entregas:', err)
    res.status(500).json({ mensagem: 'Erro ao buscar entregas' })
  }
}

exports.buscarPorId = async (req, res) => {
  try {
    const entrega = await entregasService.buscarPorId(req.params.id)
    if (!entrega) {
      return res.status(404).json({ mensagem: 'Entrega não encontrada' })
    }
    res.json(entrega)
  } catch (err) {
    console.error('Erro ao buscar entrega:', err)
    res.status(500).json({ mensagem: 'Erro ao buscar entrega' })
  }
}

exports.criar = async (req, res) => {
  try {
    const { descricao, loja_id, regiao_id, prioridade, custo } = req.body

    if (!descricao || !loja_id || !regiao_id) {
      return res.status(400).json({ mensagem: 'descricao, loja_id e regiao_id são obrigatórios' })
    }
    if (prioridade && !PRIORIDADES_VALIDAS.includes(prioridade)) {
      return res.status(400).json({ mensagem: `prioridade inválida (use: ${PRIORIDADES_VALIDAS.join(', ')})` })
    }

    const nova = await entregasService.criar({
      descricao,
      loja_id: Number(loja_id),
      regiao_id: Number(regiao_id),
      prioridade,
      custo: custo != null ? Number(custo) : null,
    })
    res.status(201).json(nova)
  } catch (err) {
    console.error('Erro ao criar entrega:', err)
    res.status(500).json({ mensagem: 'Erro ao criar entrega' })
  }
}

exports.atualizar = async (req, res) => {
  try {
    const campos = req.body || {}

    if (campos.status && !STATUS_VALIDOS.includes(campos.status)) {
      return res.status(400).json({ mensagem: `status inválido (use: ${STATUS_VALIDOS.join(', ')})` })
    }
    if (campos.prioridade && !PRIORIDADES_VALIDAS.includes(campos.prioridade)) {
      return res.status(400).json({ mensagem: `prioridade inválida (use: ${PRIORIDADES_VALIDAS.join(', ')})` })
    }

    const atualizada = await entregasService.atualizar(req.params.id, campos)
    if (!atualizada) {
      return res.status(404).json({ mensagem: 'Entrega não encontrada' })
    }
    res.json(atualizada)
  } catch (err) {
    console.error('Erro ao atualizar entrega:', err)
    res.status(500).json({ mensagem: 'Erro ao atualizar entrega' })
  }
}

exports.excluir = async (req, res) => {
  try {
    await entregasService.excluir(req.params.id)
    res.json({ mensagem: 'Entrega excluída com sucesso' })
  } catch (err) {
    console.error('Erro ao excluir entrega:', err)
    res.status(500).json({ mensagem: 'Erro ao excluir entrega' })
  }
}
