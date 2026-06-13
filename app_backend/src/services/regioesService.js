const db = require('../database/db')

const listar = async () => {
  const [rows] = await db.query(
    'SELECT id, nome, custo_base FROM regioes ORDER BY nome'
  )

  return rows
}

module.exports = {
  listar,
}
