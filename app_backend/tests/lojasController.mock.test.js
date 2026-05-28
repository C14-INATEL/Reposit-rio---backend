/**
 * Testes unitários com mock — lojasController
 *
 * Contexto:
 * Estes testes validam a função atualizar() do lojasController.
 * O objetivo é garantir que:
 * - entradas inválidas retornem erro 400,
 * - erros internos retornem 500,
 * - atualizações válidas funcionem corretamente.
 *
 * Os testes usam mocks do Jest para isolar completamente o controller,
 * sem acessar banco de dados nem subir servidor Express.
 */

const lojasController = require("../src/controllers/lojasController")
const lojasService = require("../src/services/lojasService")

jest.mock("../src/services/lojasService")

describe("lojasController — atualização de lojas", () => {

  let req
  let res

  beforeEach(() => {

    req = {
      params: {},
      body: {}
    }

    res = {
      status: jest.fn(() => res),
      json: jest.fn()
    }

    jest.clearAllMocks()
  })

  /**
   * Teste 1
   * Cenário: ID inválido enviado na rota.
   * Esperado: Retornar status 400 e mensagem de erro.
   * Objetivo: Garantir que apenas IDs numéricos sejam aceitos.
   */
  test("deve retornar 400 para ID inválido", async () => {

    req.params = {
      id: "abc"
    }

    await lojasController.atualizar(req, res)

    expect(res.status).toHaveBeenCalledWith(400)

    expect(res.json).toHaveBeenCalledWith({
      mensagem: "ID inválido"
    })
  })

  /**
   * Teste 2
   * Cenário: Campo nome não enviado.
   * Esperado:Retornar status 400.
   * Objetivo: Validar obrigatoriedade do nome da loja.
   */
  test("deve retornar 400 quando nome não for enviado", async () => {

    req.params = {
      id: 1
    }

    req.body = {
      usuario_id: 1
    }

    await lojasController.atualizar(req, res)

    expect(res.status).toHaveBeenCalledWith(400)

    expect(res.json).toHaveBeenCalledWith({
      mensagem: "Nome e usuário são obrigatórios"
    })
  })

  /**
   * Teste 3
   * Cenário: usuario_id enviado em tipo inválido.
   * Esperado: Retornar status 400.
   * Objetivo: Garantir validação de tipos de dados.
   */
  test("deve retornar 400 para usuario_id inválido", async () => {

    req.params = {
      id: 1
    }

    req.body = {
      nome: "Loja Teste",
      usuario_id: "abc"
    }

    await lojasController.atualizar(req, res)

    expect(res.status).toHaveBeenCalledWith(400)

    expect(res.json).toHaveBeenCalledWith({
      mensagem: "Nome e usuário são obrigatórios"
    })
  })

  /**
   * Teste 4
   * Cenário: Dados válidos enviados.
   * Esperado: Atualização concluída com sucesso.
   * Objetivo: Garantir fluxo correto da atualização.
   */
  test("deve atualizar loja com sucesso", async () => {

    lojasService.atualizar.mockResolvedValue()

    req.params = {
      id: 1
    }

    req.body = {
      nome: "Loja Nova",
      endereco: "Rua A",
      telefone: "999999",
      usuario_id: 1
    }

    await lojasController.atualizar(req, res)

    expect(lojasService.atualizar).toHaveBeenCalledTimes(1)

    expect(res.json).toHaveBeenCalledWith({
      mensagem: "Loja atualizada com sucesso"
    })
  })

  /**
   * Teste 5
   * Cenário: Service lança erro interno.
   * Esperado:Retornar status 500.
   * Objetivo: Garantir tratamento correto de falhas internas.
   */
  test("deve retornar 500 quando service falhar", async () => {

    lojasService.atualizar.mockRejectedValue(
      new Error("Erro interno")
    )

    req.params = {
      id: 1
    }

    req.body = {
      nome: "Loja",
      usuario_id: 1
    }

    await lojasController.atualizar(req, res)

    expect(res.status).toHaveBeenCalledWith(500)

    expect(res.json).toHaveBeenCalledWith({
      mensagem: "Erro ao atualizar loja"
    })
  })
})