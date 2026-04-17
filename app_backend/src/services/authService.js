const db = require('../database/db')

const autenticar = async (email, senha) => {
  const [rows] = await db.query(
    'SELECT id, nome, email, tipo FROM usuarios WHERE email = ? AND senha = ?',
    [email, senha]
  )
  return rows[0] || null
}

module.exports = { autenticar }
