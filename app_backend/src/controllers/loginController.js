const authService = require('../services/authService')

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body
    if (!email || !senha) {
      return res.status(401).json({ mensagem: 'Usuário ou senha inválidos' })
    }
    const usuario = await authService.autenticar(email, senha)
    if (!usuario) {
      return res.status(401).json({ mensagem: 'Usuário ou senha inválidos' })
    }
    res.json({
      mensagem: 'Login realizado com sucesso',
      tipo: usuario.tipo,
      nome: usuario.nome,
    })
  } catch (err) {
    console.error('Erro ao realizar login:', err)
    res.status(500).json({ mensagem: 'Erro interno do servidor' })
  }
}
