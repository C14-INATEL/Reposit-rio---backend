const regioesService = require('../services/regioesService')
const { responderErroInterno } = require('../utils/httpResponses')

const listar = async (req, res) => {
  try {
    const regioes = await regioesService.listar()
    return res.json(regioes)
  } catch (err) {
    return responderErroInterno(res, 'Erro ao listar regiões:', 'Erro ao buscar regiões', err)
  }
}

module.exports = {
  listar,
}
