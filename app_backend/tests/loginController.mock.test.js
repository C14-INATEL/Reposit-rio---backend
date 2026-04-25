/**
 * Testes unitários com mock — loginController
 * Autor: <seu nome>
 *
 * Contexto: sistema de gestão de entregas (C214 - INATEL)
 * O loginController valida usuário/senha e retorna o tipo de perfil.
 * Aqui os objetos req e res do Express são substituídos por mocks Jest,
 * isolando completamente a lógica do controller sem subir o servidor.
 */

const loginController = require("../src/controllers/loginController");

// ─── helpers para criar req/res falsos ────────────────────────────────────────
function makeReq(body) {
  return { body };
}

function makeRes() {
  const res = {
    status: jest.fn(),
    json: jest.fn(),
  };
  // encadeamento: res.status(401).json({...})
  res.status.mockReturnValue(res);
  return res;
}

// ─── Suíte 1: autenticação bem-sucedida por perfil ───────────────────────────
describe("loginController — login com credenciais válidas", () => {
  /**
   * Teste 1
   * Cenário: usuário "lojista" envia senha correta.
   * Esperado: res.json() chamado com tipo "lojista"; res.status() NÃO chamado
   *           (HTTP 200 implícito, sem código de erro).
   *
   * Por que mock é necessário aqui?
   * O controller recebe req e res do Express — em produção esses objetos
   * vêm do framework. No teste, injetamos mocks para capturar o que o
   * controller tentou responder, sem precisar de servidor nem rede.
   */
  test("deve autenticar lojista e retornar tipo correto", () => {
    const req = makeReq({ usuario: "lojista", senha: "1234" });
    const res = makeRes();

    loginController.login(req, res);

    // Nenhum código de status de erro foi definido
    expect(res.status).not.toHaveBeenCalled();

    // Resposta contém o perfil esperado
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      mensagem: "Login realizado com sucesso",
      tipo: "lojista",
    });
  });

  /**
   * Teste 2
   * Cenário: usuário "operador" envia senha correta.
   * Esperado: mesmo padrão — status não chamado, json com tipo "operador".
   *
   * Confirma que cada perfil do sistema de entregas é tratado
   * individualmente pelo controller.
   */
  test("deve autenticar operador e retornar tipo correto", () => {
    const req = makeReq({ usuario: "operador", senha: "1234" });
    const res = makeRes();

    loginController.login(req, res);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      mensagem: "Login realizado com sucesso",
      tipo: "operador",
    });
  });
});

// ─── Suíte 2: tentativas de acesso não autorizado ────────────────────────────
describe("loginController — login com credenciais inválidas", () => {
  /**
   * Teste 3
   * Cenário: senha correta, mas usuário inexistente no sistema.
   * Esperado: res.status(401) chamado; json com mensagem de erro.
   *
   * Mock de res.status permite verificar o código HTTP sem HTTP real.
   */
  test("deve retornar 401 para usuário desconhecido", () => {
    const req = makeReq({ usuario: "entregador", senha: "1234" });
    const res = makeRes();

    loginController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      mensagem: "Usuário ou senha inválidos",
    });
  });

  /**
   * Teste 4
   * Cenário: usuário válido ("admin"), mas senha errada.
   * Esperado: res.status(401) e mensagem de erro — nenhum perfil retornado.
   *
   * Valida que a autenticação não concede acesso apenas pelo nome
   * de usuário correto.
   */
  test("deve retornar 401 para senha incorreta de admin", () => {
    const req = makeReq({ usuario: "admin", senha: "senhaerrada" });
    const res = makeRes();

    loginController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      mensagem: "Usuário ou senha inválidos",
    });
    // Garante que não vazou nenhum dado de perfil na resposta de erro
    const chamada = res.json.mock.calls[0][0];
    expect(chamada).not.toHaveProperty("tipo");
  });
});

  /**
   * Teste 5 (mock com falha esperada)
   * Cenário: validação propositalmente incorreta do tipo retornado.
   * Esperado: o teste PASSA porque a assertiva falha é capturada.
   *
   * Aqui testamos o próprio comportamento do Jest ao detectar erro.
   */
  test("deve passar ao detectar falha de assertiva no tipo do usuário", () => {
    const req = makeReq({ usuario: "lojista", senha: "1234" });
    const res = makeRes();

    loginController.login(req, res);

    expect(() => {
      expect(res.json).toHaveBeenCalledWith({
        mensagem: "Login realizado com sucesso",
        tipo: "admin", // errado de propósito
      });
    }).toThrow();
  });

  /**
   * Teste 6 (mock com falha esperada)
   * Cenário: verificação incorreta de status HTTP.
   * Esperado: o teste PASSA porque esperamos que a verificação falhe.
   *
   * Simula uma validação errada de contrato HTTP.
   */
  test("deve passar ao detectar falha na verificação de status HTTP", () => {
    const req = makeReq({ usuario: "entregador", senha: "1234" });
    const res = makeRes();

    loginController.login(req, res);

    expect(() => {
      expect(res.status).not.toHaveBeenCalled(); // errado de propósito (deveria ter sido chamado com 401)
    }).toThrow();
  });