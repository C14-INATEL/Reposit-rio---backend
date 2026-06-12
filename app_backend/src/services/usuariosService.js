const db = require('../database/db')

const criar = async ({ nome, email, senha, tipo }) => {
  const [existente] = await db.query(
    'SELECT id FROM usuarios WHERE email = ?',
    [email]
  )
  if (existente.length > 0) {
    throw new Error('EMAIL_JA_CADASTRADO')
  }
  const [result] = await db.query(
    'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
    [nome, email, senha, tipo]
  )
  return { id: result.insertId, nome, email, tipo }
}

const atualizar = async (id, { nome, email, senha, tipo }) => {
  const [existente] = await db.query(
    'SELECT id FROM usuarios WHERE email = ? AND id != ?',
    [email, id]
  )
  if (existente.length > 0) throw new Error('EMAIL_JA_CADASTRADO')
  
  if (senha) {
    await db.query(
      'UPDATE usuarios SET nome=?, email=?, senha=?, tipo=? WHERE id=?',
      [nome, email, senha, tipo, id]
    )
  } else {
    await db.query(
      'UPDATE usuarios SET nome=?, email=?, tipo=? WHERE id=?',
      [nome, email, tipo, id]
    )
  }
  
  const [rows] = await db.query(
    'SELECT id, nome, email, senha, tipo FROM usuarios WHERE id = ?',
    [id]
  )
  return rows[0] || null
}

const excluir = async (id) => {
  await db.query('DELETE FROM usuarios WHERE id = ?', [id])
}

module.exports = { criar, atualizar, excluir }
