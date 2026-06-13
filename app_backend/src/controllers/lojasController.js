const lojasService = require('../services/lojasService')
const { responderErro, responderErroInterno } = require('../utils/httpResponses')
const { campoStringValido, idNumericoValido } = require('../utils/validations')

// Mensagens ficam agrupadas para manter contrato de API consistente.
const MENSAGENS = {
  idInvalido: 'ID inválido',
  dadosObrigatorios: 'Nome e usuário são obrigatórios',
  listarErro: 'Erro ao listar lojas',
  criarErro: 'Erro ao criar loja',
  atualizarErro: 'Erro ao atualizar loja',
  excluirErro: 'Erro ao excluir loja',
}

// Normalização de entrada antes de chamar o service.
const filtroListagem = (query) => {
  return query.usuario_id ? { usuarioId: Number(query.usuario_id) } : {}
}

const dadosLoja = (body) => {
  const { nome, endereco, telefone, usuario_id } = body || {}
  return { nome, endereco, telefone, usuario_id }
}

// Pequenos validadores deixam os handlers sem condicionais longos.
const lojaValida = ({ nome, usuario_id }) => {
  return campoStringValido(nome) && typeof usuario_id === 'number'
}

const responderIdInvalido = (res, id) => {
  if (idNumericoValido(id)) return false

  responderErro(res, 400, MENSAGENS.idInvalido)
  return true
}

const responderLojaInvalida = (res, loja) => {
  if (lojaValida(loja)) return false

  responderErro(res, 400, MENSAGENS.dadosObrigatorios)
  return true
}

// Handlers HTTP: validar, chamar service e responder.
const listar = async (req, res) => {
  try {
    const lojas = await lojasService.listar(filtroListagem(req.query))
    return res.json(lojas)
  } catch (err) {
    return responderErroInterno(res, 'Erro ao listar lojas:', MENSAGENS.listarErro, err)
  }
}

const criar = async (req, res) => {
  const loja = dadosLoja(req.body)

  if (responderLojaInvalida(res, loja)) return undefined

  try {
    const novaLoja = await lojasService.criar(loja)
    return res.status(201).json({ mensagem: 'Loja criada com sucesso', loja: novaLoja })
  } catch (err) {
    return responderErroInterno(res, 'Erro ao criar loja:', MENSAGENS.criarErro, err)
  }
}

const atualizar = async (req, res) => {
  const loja = dadosLoja(req.body)

  if (responderIdInvalido(res, req.params.id)) return undefined
  if (responderLojaInvalida(res, loja)) return undefined

  try {
    await lojasService.atualizar(req.params.id, loja)
    return res.json({ mensagem: 'Loja atualizada com sucesso' })
  } catch (err) {
    return responderErroInterno(res, 'Erro ao atualizar loja:', MENSAGENS.atualizarErro, err)
  }
}

const excluir = async (req, res) => {
  if (responderIdInvalido(res, req.params.id)) return undefined

  try {
    await lojasService.excluir(req.params.id)
    return res.json({ mensagem: 'Loja excluída com sucesso' })
  } catch (err) {
    return responderErroInterno(res, 'Erro ao excluir loja:', MENSAGENS.excluirErro, err)
  }
}

module.exports = {
  listar,
  criar,
  atualizar,
  excluir,
}
