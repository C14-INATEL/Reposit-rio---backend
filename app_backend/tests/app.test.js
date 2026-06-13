jest.mock("../src/services/authService", () => ({
  autenticar: jest.fn(),
}));

const request = require("supertest");
const authService = require("../src/services/authService");
const app = require("../index");

describe("Rotas do backend", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("GET / deve retornar status 200 e mensagem de funcionamento", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("Servidor backend funcionando 🚀");
  });

  test("POST /login com email admin retorna tipo admin", async () => {
    authService.autenticar.mockResolvedValue({
      id: 1,
      nome: "Lucas Martins",
      email: "lucas.martins@duck.com",
      tipo: "admin",
    });

    const response = await request(app)
      .post("/login")
      .send({ email: "lucas.martins@duck.com", senha: "123456" });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
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

  test("POST /login com email operador retorna tipo operador", async () => {
    authService.autenticar.mockResolvedValue({
      id: 2,
      nome: "Fernanda Lima",
      email: "fernanda.lima@duck.com",
      tipo: "operador",
    });

    const response = await request(app)
      .post("/login")
      .send({ email: "fernanda.lima@duck.com", senha: "123456" });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
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

  test("POST /login com credenciais inválidas retorna 401", async () => {
    authService.autenticar.mockResolvedValue(null);

    const response = await request(app)
      .post("/login")
      .send({ email: "usuario-invalido@duck.com", senha: "senha" });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      mensagem: "Usuário ou senha inválidos",
    });
  });
});
