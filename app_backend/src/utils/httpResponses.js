const responderErro = (res, status, mensagem) => {
  return res.status(status).json({ mensagem })
}

const responderErroInterno = (res, contexto, mensagemPublica, erro) => {
  console.error(contexto, erro)
  return responderErro(res, 500, mensagemPublica)
}

module.exports = {
  responderErro,
  responderErroInterno,
}
