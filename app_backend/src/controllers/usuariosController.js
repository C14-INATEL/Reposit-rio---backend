const usuariosService = require('../services/usuariosService')
const { responderErro, responderErroInterno } = require('../utils/httpResponses')
const { possuiCampos } = require('../utils/validations')

// Textos de resposta centralizados para manter o contrato estavel.
const MENSAGENS = {
  cadastroObrigatorio: 'Todos os campos são obrigatórios',
  atualizacaoObrigatoria: 'Nome, email e tipo são obrigatórios',
  emailDuplicado: 'Este e-mail já está em uso.',
}

// Preparacao dos dados recebidos antes de delegar ao service.
const filtroListagem = (query) => (query.tipo ? { tipo: query.tipo } : {})

const dadosCadastro = ({ nome, email, senha, tipo }) => ({ nome, email, senha, tipo })

const dadosAtualizacao = ({ nome, email, senha, tipo }) => ({ nome, email, senha, tipo })

const validarCadastro = (body) => possuiCampos(body, ['nome', 'email', 'senha', 'tipo'])

const validarAtualizacao = (body) => possuiCampos(body, ['nome', 'email', 'tipo'])

// Erro de e-mail duplicado e uma regra conhecida do service.
const responderEmailDuplicado = (res, err) => {
  if (err.message !== 'EMAIL_JA_CADASTRADO') return false

  responderErro(res, 409, MENSAGENS.emailDuplicado)
  return true
}

// Handlers HTTP: validam entrada e deixam acesso ao banco no service.
const listar = async (req, res) => {
  try {
    const usuarios = await usuariosService.listar(filtroListagem(req.query))
    return res.json(usuarios)
  } catch (err) {
    return responderErroInterno(res, 'Erro ao listar usuários:', 'Erro ao buscar usuários', err)
  }
}

const criar = async (req, res) => {
  if (!validarCadastro(req.body)) {
    return responderErro(res, 400, MENSAGENS.cadastroObrigatorio)
  }

  try {
    const usuario = await usuariosService.criar(dadosCadastro(req.body))
    return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso', usuario })
  } catch (err) {
    if (responderEmailDuplicado(res, err)) return undefined

    return responderErroInterno(res, 'Erro ao cadastrar usuário:', 'Erro ao cadastrar usuário', err)
  }
}

const atualizar = async (req, res) => {
  if (!validarAtualizacao(req.body)) {
    return responderErro(res, 400, MENSAGENS.atualizacaoObrigatoria)
  }

  try {
    const usuario = await usuariosService.atualizar(req.params.id, dadosAtualizacao(req.body))
    return res.json({ mensagem: 'Usuário atualizado com sucesso', usuario })
  } catch (err) {
    if (responderEmailDuplicado(res, err)) return undefined

    return responderErroInterno(res, 'Erro ao atualizar usuário:', 'Erro ao atualizar usuário', err)
  }
}

const excluir = async (req, res) => {
  try {
    await usuariosService.excluir(req.params.id)
    return res.json({ mensagem: 'Usuário excluído com sucesso' })
  } catch (err) {
    return responderErroInterno(res, 'Erro ao excluir usuário:', 'Não foi possível excluir o usuário', err)
  }
}

module.exports = {
  listar,
  criar,
  atualizar,
  excluir,
}
