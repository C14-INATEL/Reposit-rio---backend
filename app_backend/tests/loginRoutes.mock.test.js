/**
 * Testes unitários com mock — rota POST /login
 * Autor: <seu nome>
 *
 * Contexto: sistema de gestão de entregas (C214 - INATEL)
 * Aqui testamos a camada de ROTA isoladamente, mockando o loginController
 * com jest.mock(). O objetivo é garantir que a rota /login repassa
 * corretamente a requisição ao controller — sem executar a lógica de
 * autenticação real nem abrir conexão com banco de dados.
 */

const request = require("supertest");
const express = require("express");

// ── Mock do controller ANTES de importar as rotas ────────────────────────────
// jest.mock() intercepta o require() do loginController em loginRoutes.js,
// substituindo a função login por um spy controlado pelo teste.
jest.mock("../src/controllers/loginController", () => ({
  login: jest.fn(),
}));

const loginController = require("../src/controllers/loginController");
const loginRoutes = require("../src/routes/loginRoutes");

// App mínimo só com a rota de login — sem depender do index.js completo
function buildApp() {
  const app = express();
  app.use(express.json());
  app.use("/", loginRoutes);
  return app;
}

// ─── Suíte 1: rota repassa req ao controller ─────────────────────────────────
describe("POST /login — rota delega para o controller", () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();     // limpa contagens entre testes
    app = buildApp();
  });

  /**
   * Teste 1
   * Cenário: cliente envia POST /login com body válido.
   * Esperado: o controller mockado é chamado exatamente 1 vez.
   *
   * Por que mock é necessário aqui?
   * Queremos testar SOMENTE a responsabilidade da rota (receber a requisição
   * e chamar o controller). Se usássemos o controller real, qualquer bug
   * nele faria este teste falhar — misturando responsabilidades.
   * Com mock, isolamos a rota completamente.
   */
  test("deve chamar loginController.login ao receber POST /login", async () => {
    // Configura o mock para simular resposta bem-sucedida
    loginController.login.mockImplementation((req, res) => {
      res.status(200).json({ mensagem: "Login realizado com sucesso", tipo: "cliente" });
    });

    await request(app)
      .post("/login")
      .send({ usuario: "cliente", senha: "1234" });

    // A rota deve ter acionado o controller exatamente uma vez
    expect(loginController.login).toHaveBeenCalledTimes(1);
  });

  /**
   * Teste 2
   * Cenário: controller mockado retorna erro 401.
   * Esperado: a rota propaga o status 401 ao cliente sem alterar nada.
   *
   * Valida que a camada de rota não interfere na resposta de erro —
   * ela apenas repassa o que o controller decidir.
   */
  test("deve propagar status 401 quando controller rejeitar credenciais", async () => {
    // Mock simula falha de autenticação
    loginController.login.mockImplementation((req, res) => {
      res.status(401).json({ mensagem: "Usuário ou senha inválidos" });
    });

    const response = await request(app)
      .post("/login")
      .send({ usuario: "hacker", senha: "tentativa" });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ mensagem: "Usuário ou senha inválidos" });

    // Controller foi chamado (rota não bloqueou antes)
    expect(loginController.login).toHaveBeenCalledTimes(1);
  });
});