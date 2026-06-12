const db = require('../database/db')

const SELECT_BASE = `
  SELECT
    e.id,
    e.descricao,
    e.status,
    e.prioridade,
    e.data_pedido,
    e.data_entrega,
    e.custo,
    e.loja_id,
    l.nome AS loja_nome,
    l.usuario_id AS lojista_id,
    e.regiao_id,
    r.nome AS regiao_nome,
    r.custo_base AS regiao_custo_base
  FROM entregas e
  JOIN lojas l ON e.loja_id = l.id
  JOIN regioes r ON e.regiao_id = r.id
`

const listar = async ({ lojistaId } = {}) => {
  if (lojistaId) {
    const [rows] = await db.query(
      `${SELECT_BASE} WHERE l.usuario_id = ? ORDER BY e.data_pedido DESC`,
      [lojistaId]
    )
    return rows
  }
  const [rows] = await db.query(`${SELECT_BASE} ORDER BY e.data_pedido DESC`)
  return rows
}

const buscarPorId = async (id) => {
  const [rows] = await db.query(`${SELECT_BASE} WHERE e.id = ?`, [id])
  return rows[0] || null
}

const criar = async ({ descricao, loja_id, regiao_id, prioridade = 'media', custo, status = 'criado' }) => {
  const [result] = await db.query(
    `INSERT INTO entregas (descricao, loja_id, regiao_id, prioridade, custo, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [descricao, loja_id, regiao_id, prioridade, custo, status]
  )
  return buscarPorId(result.insertId)
}

const atualizar = async (id, campos) => {
  const permitidos = ['descricao', 'status', 'prioridade', 'custo', 'loja_id', 'regiao_id']
  const updates = []
  const valores = []

  for (const campo of permitidos) {
    if (campos[campo] !== undefined) {
      updates.push(`${campo} = ?`)
      valores.push(campos[campo])
    }
  }

  // Se mudou para 'entregue' e não foi passado data_entrega, registra agora
  if (campos.status === 'entregue') {
    updates.push('data_entrega = CURRENT_TIMESTAMP')
  }

  if (updates.length === 0) return buscarPorId(id)

  valores.push(id)
  await db.query(`UPDATE entregas SET ${updates.join(', ')} WHERE id = ?`, valores)
  return buscarPorId(id)
}

const excluir = async (id) => {
  await db.query('DELETE FROM entregas WHERE id = ?', [id])
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir }
