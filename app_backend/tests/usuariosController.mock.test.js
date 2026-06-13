const usuariosController = require('../src/controllers/usuariosController')
const usuariosService = require('../src/services/usuariosService')

jest.mock('../src/services/usuariosService')

const makeReq = (body = {}, params = {}, query = {}) => ({ body, params, query })

const makeRes = () => {
  const res = {
    status: jest.fn(),
    json: jest.fn(),
  }
  res.status.mockReturnValue(res)
  return res
}

describe('usuariosController - cadastro de lojista', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('deve criar usuario do tipo lojista', async () => {
    const novoLojista = {
      id: 7,
      nome: 'Lojista Teste',
      email: 'lojista@duck.com',
      tipo: 'lojista',
    }

    usuariosService.criar.mockResolvedValue(novoLojista)

    const req = makeReq({
      nome: 'Lojista Teste',
      email: 'lojista@duck.com',
      senha: 'senha123',
      tipo: 'lojista',
    })
    const res = makeRes()

    await usuariosController.criar(req, res)

    expect(usuariosService.criar).toHaveBeenCalledWith({
      nome: 'Lojista Teste',
      email: 'lojista@duck.com',
      senha: 'senha123',
      tipo: 'lojista',
    })
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
      mensagem: 'Usuário cadastrado com sucesso',
      usuario: novoLojista,
    })
  })
})
