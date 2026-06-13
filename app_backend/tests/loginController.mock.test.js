/**
 * Testes unitários com mock — loginController
 * Autor: <seu nome>
 *
 * Contexto: sistema de gestão de entregas (C214 - INATEL)
 * O loginController valida usuário/senha e retorna o tipo de perfil.
 * Aqui os objetos req e res do Express são substituídos por mocks Jest,
 * isolando completamente a lógica do controller sem subir o servidor.
 */

jest.mock("../src/services/authService", () => ({
  autenticar: jest.fn(),
}));

const authService = require("../src/services/authService");
const loginController = require("../src/controllers/loginController");

afterEach(() => {
  jest.clearAllMocks();
});

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
  test("deve autenticar admin e retornar tipo correto", async () => {
    authService.autenticar.mockResolvedValue({
      id: 1,
      nome: "Lucas Martins",
      email: "lucas.martins@duck.com",
      tipo: "admin",
    });

    const req = makeReq({ email: "lucas.martins@duck.com", senha: "123456" });
    const res = makeRes();

    await loginController.login(req, res);

    expect(authService.autenticar).toHaveBeenCalledWith("lucas.martins@duck.com", "123456");
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      mensagem: "Login realizado com sucesso",
      tipo: "admin",
      usuario: {
        id: 1,
        nome: "Lucas Martins",
        email: "lucas.martins@duck.com",
        tipo: "admin",
      },
    });
  });

  test("deve autenticar operador e retornar tipo correto", async () => {
    authService.autenticar.mockResolvedValue({
      id: 2,
      nome: "Fernanda Lima",
      email: "fernanda.lima@duck.com",
      tipo: "operador",
    });

    const req = makeReq({ email: "fernanda.lima@duck.com", senha: "123456" });
    const res = makeRes();

    await loginController.login(req, res);

    expect(authService.autenticar).toHaveBeenCalledWith("fernanda.lima@duck.com", "123456");
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      mensagem: "Login realizado com sucesso",
      tipo: "operador",
      usuario: {
        id: 2,
        nome: "Fernanda Lima",
        email: "fernanda.lima@duck.com",
        tipo: "operador",
      },
    });
  });
});

// ─── Suíte 2: tentativas de acesso não autorizado ────────────────────────────
describe("loginController — login com credenciais inválidas", () => {
  test("deve retornar 401 para email desconhecido", async () => {
    authService.autenticar.mockResolvedValue(null);

    const req = makeReq({ email: "entregador@duck.com", senha: "1234" });
    const res = makeRes();

    await loginController.login(req, res);

    expect(authService.autenticar).toHaveBeenCalledWith("entregador@duck.com", "1234");
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      mensagem: "Usuário ou senha inválidos",
    });
  });

  test("deve retornar 401 para senha incorreta de admin", async () => {
    authService.autenticar.mockResolvedValue(null);

    const req = makeReq({ email: "lucas.martins@duck.com", senha: "senhaerrada" });
    const res = makeRes();

    await loginController.login(req, res);

    expect(authService.autenticar).toHaveBeenCalledWith("lucas.martins@duck.com", "senhaerrada");
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      mensagem: "Usuário ou senha inválidos",
    });
    const chamada = res.json.mock.calls[0][0];
    expect(chamada).not.toHaveProperty("tipo");
  });
});

/**
 * Teste 5
 * Cenário: validação propositalmente incorreta do tipo retornado.
 * Esperado: o teste PASSA porque a assertiva falha é capturada.
 */
test("deve passar ao detectar falha de assertiva no tipo do usuário", async () => {
  const req = makeReq({ email: "ferreira@duck.com", senha: "123456" });
  const res = makeRes();

  await loginController.login(req, res);

  expect(() => {
    expect(res.json).toHaveBeenCalledWith({
      mensagem: "Login realizado com sucesso",
      tipo: "admin", // errado de propósito
    });
  }).toThrow();
});

/**
 * Teste 6
 * Cenário: verificação incorreta de status HTTP.
 * Esperado: o teste PASSA porque esperamos que a verificação falhe.
 */
test("deve passar ao detectar falha na verificação de status HTTP", async () => {
  const req = makeReq({ email: "entregador@duck.com", senha: "1234" });
  const res = makeRes();

  await loginController.login(req, res);

  expect(() => {
    expect(res.status).not.toHaveBeenCalled();
  }).toThrow();
});

/**
 * Teste 7
 * Cenário: requisição sem email.
 * Esperado: status 400 com mensagem de validação.
 */
test("deve retornar 400 quando email não for enviado", async () => {
  const req = makeReq({ senha: "1234" });
  const res = makeRes();

  await loginController.login(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    mensagem: "Email e senha são obrigatórios",
  });
});

/**
 * Teste 8
 * Cenário: requisição sem senha.
 * Esperado: status 400 com mensagem de validação.
 */
test("deve retornar 400 quando senha não for enviada", async () => {
  const req = makeReq({ email: "admin@duck.com" });
  const res = makeRes();

  await loginController.login(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    mensagem: "Email e senha são obrigatórios",
  });
});

/**
 * Teste 9
 * Cenário: body vazio.
 * Esperado: status 400.
 */
test("deve retornar 400 quando body estiver vazio", () => {
  const req = makeReq({});
  const res = makeRes();

  loginController.login(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
});

/**
 * Teste 10
 * Cenário: tipos inválidos nos campos.
 * Esperado: status 400.
 */
test("deve retornar 400 para tipos inválidos", () => {
  const req = makeReq({
    email: 123,
    senha: true,
  });

  const res = makeRes();

  loginController.login(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
});