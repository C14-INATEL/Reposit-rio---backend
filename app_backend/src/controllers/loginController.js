const db = require('../database/db')
const authService = require('../services/authService')

exports.login = async (req, res) => {
  const { email, senha } = req.body

  // VALIDAÇÃO
  if (!email || !senha || typeof senha !== 'string') {
    return res.status(400).json({
      mensagem: 'Email e senha são obrigatórios',
    })
  }

  try {
    // Autenticar por email (banco de dados)
    const user = await authService.autenticar(email, senha)
    if (user) {
      return res.json({
        mensagem: 'Login realizado com sucesso',
        tipo: user.tipo,
        usuario: user,
      })
    }

    return res.status(401).json({
      mensagem: 'Email ou senha inválidos',
    })
  } catch (err) {
    console.error('Erro ao realizar login:', err)
    res.status(500).json({ mensagem: 'Erro ao realizar login' })
  }
}