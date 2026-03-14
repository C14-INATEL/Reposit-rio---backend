exports.login = (req, res) => {

  const { usuario, senha } = req.body;

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
  return res.status(401).json({
    mensagem: "Usuário ou senha inválidos"
  });

};