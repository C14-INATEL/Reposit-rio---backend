const db = require('../database/db')

const listar = async () => {
  const [rows] = await db.query(
    `SELECT l.id, l.nome, l.endereco, l.telefone, u.nome AS lojista, l.usuario_id
     FROM lojas l
     LEFT JOIN usuarios u ON l.usuario_id = u.id`
  )
  return rows
}

const criar = async ({ nome, endereco, telefone, usuario_id }) => {
  const [result] = await db.query(
    `INSERT INTO lojas (nome, endereco, telefone, usuario_id) VALUES (?, ?, ?, ?)`,
    [nome, endereco || null, telefone || null, usuario_id]
  )
  return { id: result.insertId, nome, endereco, telefone, usuario_id }
}

const atualizar = async (id, { nome, endereco, telefone, usuario_id }) => {
  await db.query(
    'UPDATE lojas SET nome=?, endereco=?, telefone=?, usuario_id=? WHERE id=?',
    [nome, endereco || null, telefone || null, usuario_id, id]
  )
}

const excluir = async (id) => {
  await db.query('DELETE FROM lojas WHERE id = ?', [id])
}

module.exports = { listar, criar, atualizar, excluir }
