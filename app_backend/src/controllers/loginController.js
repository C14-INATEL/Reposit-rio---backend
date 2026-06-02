const db = require('../database/db')
const authService = require('../services/authService')

exports.login = async (req, res) => {
  const { usuario, senha, email } = req.body

  // VALIDAÇÃO
  if ((!usuario && !email) || !senha || typeof senha !== 'string') {
    return res.status(400).json({
      mensagem: 'Usuário/Email e senha são obrigatórios',
    })
  }

  try {
    // Tenta autenticar por email (banco de dados)
    if (email) {
      const user = await authService.autenticar(email, senha)
      if (user) {
        return res.json({
          mensagem: 'Login realizado com sucesso',
          tipo: user.tipo,
          usuario: user,
        })
      }
    }

    // Fallback para mock users (para desenvolvimento)
    const MOCK_USERS = {
      admin: { senha: '1234', tipo: 'admin' },
      operador: { senha: '1234', tipo: 'operador' },
      lojista: { senha: '1234', tipo: 'lojista' },
      cliente: { senha: '1234', tipo: 'cliente' },
    }

    if (usuario && MOCK_USERS[usuario] && MOCK_USERS[usuario].senha === senha) {
      return res.json({
        mensagem: 'Login realizado com sucesso',
        tipo: MOCK_USERS[usuario].tipo,
      })
    }

    return res.status(401).json({
      mensagem: 'Usuário ou senha inválidos',
    })
  } catch (err) {
    console.error('Erro ao realizar login:', err)
    res.status(500).json({ mensagem: 'Erro ao realizar login' })
  }
}