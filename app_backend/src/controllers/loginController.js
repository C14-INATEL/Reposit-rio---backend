exports.login = (req, res) => {

  const { usuario, senha } = req.body;

  // VALIDAÇÃO NOVA
  if (
    !usuario ||
    !senha ||
    typeof usuario !== "string" ||
    typeof senha !== "string"
  ) {
    return res.status(400).json({
      mensagem: "Usuário e senha são obrigatórios"
    });
  }

  if (usuario === "admin" && senha === "1234") {
    return res.json({
      mensagem: "Login realizado com sucesso",
      tipo: "admin"
    });
  }

  if (usuario === "cliente" && senha === "1234") {
    return res.json({
      mensagem: "Login realizado com sucesso",
      tipo: "cliente"
    });
  }

  if (usuario === "lojista" && senha === "1234") {
    return res.json({
      mensagem: "Login realizado com sucesso",
      tipo: "lojista"
    });
  }

  if (usuario === "operador" && senha === "1234") {
    return res.json({
      mensagem: "Login realizado com sucesso",
      tipo: "operador"
    });
  }

  return res.status(401).json({
    mensagem: "Usuário ou senha inválidos"
  });

};