const entregasService = require('../services/entregasService')
const { responderErro, responderErroInterno } = require('../utils/httpResponses')

const PRIORIDADES_VALIDAS = ['baixa', 'media', 'alta', 'urgente']
const STATUS_VALIDOS = ['criado', 'andamento', 'enviado', 'entregue', 'cancelado']

// Mensagens centralizadas evitam divergência entre respostas parecidas.
const MENSAGENS = {
  entregaNaoEncontrada: 'Entrega não encontrada',
  criarObrigatorios: 'descricao, loja_id e regiao_id são obrigatórios',
  listarErro: 'Erro ao buscar entregas',
  buscarErro: 'Erro ao buscar entrega',
  criarErro: 'Erro ao criar entrega',
  atualizarErro: 'Erro ao atualizar entrega',
  excluirErro: 'Erro ao excluir entrega',
}

// Funções de preparação mantêm os handlers focados em fluxo HTTP.
const filtroListagem = (query) => {
  return query.lojista_id ? { lojistaId: Number(query.lojista_id) } : {}
}

const valorOpcionalNumerico = (valor) => {
  return valor != null ? Number(valor) : null
}

const dadosNovaEntrega = (body) => {
  const { descricao, loja_id, regiao_id, prioridade, custo } = body || {}

  return {
    descricao,
    loja_id: Number(loja_id),
    regiao_id: Number(regiao_id),
    prioridade,
    custo: valorOpcionalNumerico(custo),
  }
}

const possuiDadosMinimosCriacao = (body) => {
  return Boolean(body?.descricao && body?.loja_id && body?.regiao_id)
}

const valorPermitido = (valor, permitidos) => {
  return !valor || permitidos.includes(valor)
}

const mensagemValorInvalido = (campo, permitidos) => {
  return `${campo} inválida (use: ${permitidos.join(', ')})`
}

// Validações retornam a mensagem pronta para o controller responder.
const validarCriacao = (body) => {
  if (!possuiDadosMinimosCriacao(body)) {
    return MENSAGENS.criarObrigatorios
  }

  if (!valorPermitido(body.prioridade, PRIORIDADES_VALIDAS)) {
    return mensagemValorInvalido('prioridade', PRIORIDADES_VALIDAS)
  }

  return null
}

const validarAtualizacao = (campos) => {
  if (!valorPermitido(campos.status, STATUS_VALIDOS)) {
    return mensagemValorInvalido('status', STATUS_VALIDOS)
  }

  if (!valorPermitido(campos.prioridade, PRIORIDADES_VALIDAS)) {
    return mensagemValorInvalido('prioridade', PRIORIDADES_VALIDAS)
  }

  return null
}

// Handlers exportados: recebem HTTP, delegam regra ao service e respondem.
const listar = async (req, res) => {
  try {
    const entregas = await entregasService.listar(filtroListagem(req.query))
    return res.json(entregas)
  } catch (err) {
    return responderErroInterno(res, 'Erro ao listar entregas:', MENSAGENS.listarErro, err)
  }
}

const buscarPorId = async (req, res) => {
  try {
    const entrega = await entregasService.buscarPorId(req.params.id)

    if (!entrega) {
      return responderErro(res, 404, MENSAGENS.entregaNaoEncontrada)
    }

    return res.json(entrega)
  } catch (err) {
    return responderErroInterno(res, 'Erro ao buscar entrega:', MENSAGENS.buscarErro, err)
  }
}

const criar = async (req, res) => {
  const erroValidacao = validarCriacao(req.body)

  if (erroValidacao) {
    return responderErro(res, 400, erroValidacao)
  }

  try {
    const entrega = await entregasService.criar(dadosNovaEntrega(req.body))
    return res.status(201).json(entrega)
  } catch (err) {
    return responderErroInterno(res, 'Erro ao criar entrega:', MENSAGENS.criarErro, err)
  }
}

const atualizar = async (req, res) => {
  const campos = req.body || {}
  const erroValidacao = validarAtualizacao(campos)

  if (erroValidacao) {
    return responderErro(res, 400, erroValidacao)
  }

  try {
    const entrega = await entregasService.atualizar(req.params.id, campos)

    if (!entrega) {
      return responderErro(res, 404, MENSAGENS.entregaNaoEncontrada)
    }

    return res.json(entrega)
  } catch (err) {
    return responderErroInterno(res, 'Erro ao atualizar entrega:', MENSAGENS.atualizarErro, err)
  }
}

const excluir = async (req, res) => {
  try {
    await entregasService.excluir(req.params.id)
    return res.json({ mensagem: 'Entrega excluída com sucesso' })
  } catch (err) {
    return responderErroInterno(res, 'Erro ao excluir entrega:', MENSAGENS.excluirErro, err)
  }
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  excluir,
}
