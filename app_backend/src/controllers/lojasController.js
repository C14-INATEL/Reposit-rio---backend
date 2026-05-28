exports.atualizar = async (req, res) => {
  try {

    if (isNaN(Number(req.params.id))) {
      return res.status(400).json({
        mensagem: 'ID inválido'
      })
    }

    const { nome, endereco, telefone, usuario_id } = req.body

    if (
      !nome ||
      !usuario_id ||
      typeof nome !== "string" ||
      typeof usuario_id !== "number"
    ) {
      return res.status(400).json({
        mensagem: 'Nome e usuário são obrigatórios'
      })
    }

    await lojasService.atualizar(
      req.params.id,
      { nome, endereco, telefone, usuario_id }
    )

    res.json({
      mensagem: 'Loja atualizada com sucesso'
    })

  } catch (err) {

    console.error('Erro ao atualizar loja:', err)

    res.status(500).json({
      mensagem: 'Erro ao atualizar loja'
    })
  }
}