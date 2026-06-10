const db = require('../database/db')
const authService = require('../services/authService')

exports.login = async (req, res) => {
  const { usuario, senha, email } = req.body

  if ((!usuario && !email) || !senha || typeof senha !== 'string') {
    return res.status(400).json({
      mensagem: 'Usuário/Email e senha são obrigatórios',
    })
  }

  try {
    // Login por email — busca no banco
    const emailBusca = email || (usuario && usuario.includes('@') ? usuario : null)

    if (emailBusca) {
      const user = await authService.autenticar(emailBusca, senha)
      if (user) {
        return res.json({
          mensagem: 'Login realizado com sucesso',
          tipo: user.tipo,
          usuario: user,
        })
      }
    }

    // Login por nome de usuário — busca no banco pelo campo nome
    if (usuario && !usuario.includes('@')) {
      const [rows] = await db.query(
        'SELECT id, nome, email, tipo FROM usuarios WHERE nome = ? AND senha = ?',
        [usuario, senha]
      )
      if (rows[0]) {
        return res.json({
          mensagem: 'Login realizado com sucesso',
          tipo: rows[0].tipo,
          usuario: rows[0],
        })
      }
    }

    return res.status(401).json({
      mensagem: 'Usuário ou senha inválidos',
    })
  } catch (err) {
    console.error('Erro ao realizar login:', err)
    res.status(500).json({ mensagem: 'Erro ao realizar login' })
  }
}