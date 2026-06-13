const authService = require('../services/authService')
const { responderErro, responderErroInterno } = require('../utils/httpResponses')
const { campoStringValido } = require('../utils/validations')

// Mensagens reunidas reduzem duplicacao e facilitam ajustes da API.
const MENSAGENS = {
  camposObrigatorios: 'Email e senha são obrigatórios',
  credenciaisInvalidas: 'Usuário ou senha inválidos',
  sucesso: 'Login realizado com sucesso',
  erroInterno: 'Erro ao realizar login',
}

// Entrada do request e normalizada antes da regra de autenticacao.
const dadosLogin = (body) => {
  const { email, senha } = body || {}
  return { email, senha }
}

const loginValido = ({ email, senha }) => {
  return campoStringValido(email) && campoStringValido(senha)
}

const respostaLogin = (usuario) => ({
  mensagem: MENSAGENS.sucesso,
  tipo: usuario.tipo,
  usuario,
})

// Handler HTTP sem funcoes aninhadas: valida, autentica e responde.
const login = async (req, res) => {
  const credenciais = dadosLogin(req.body)

  if (!loginValido(credenciais)) {
    return responderErro(res, 400, MENSAGENS.camposObrigatorios)
  }

  try {
    const usuario = await authService.autenticar(credenciais.email, credenciais.senha)

    if (!usuario) {
      return responderErro(res, 401, MENSAGENS.credenciaisInvalidas)
    }

    return res.json(respostaLogin(usuario))
  } catch (err) {
    return responderErroInterno(res, 'Erro ao realizar login:', MENSAGENS.erroInterno, err)
  }
}

module.exports = {
  login,
}
