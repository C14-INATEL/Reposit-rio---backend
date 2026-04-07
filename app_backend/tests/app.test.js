const request = require("supertest");
const app = require("../index");

describe("Rotas do backend", () => {
  test("GET / deve retornar status 200 e mensagem de funcionamento", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("Servidor backend funcionando 🚀");
  });

  test("POST /login com admin/1234 retorna tipo admin", async () => {
    const response = await request(app)
      .post("/login")
      .send({ usuario: "admin", senha: "1234" });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      mensagem: "Login realizado com sucesso",
      tipo: "admin",
    });
  });

  test("POST /login com cliente/1234 retorna tipo cliente", async () => {
    const response = await request(app)
      .post("/login")
      .send({ usuario: "cliente", senha: "1234" });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      mensagem: "Login realizado com sucesso",
      tipo: "cliente",
    });
  });

  test("POST /login com credenciais inválidas retorna 401", async () => {
    const response = await request(app)
      .post("/login")
      .send({ usuario: "usuario-invalido", senha: "senha" });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      mensagem: "Usuário ou senha inválidos",
    });
  });
});
