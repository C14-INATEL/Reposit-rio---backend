const idNumericoValido = (id) => !Number.isNaN(Number(id))

const possuiCampos = (objeto, campos) => {
  return campos.every((campo) => Boolean(objeto?.[campo]))
}

const campoStringValido = (valor) => typeof valor === 'string' && valor.trim().length > 0

module.exports = {
  idNumericoValido,
  possuiCampos,
  campoStringValido,
}
