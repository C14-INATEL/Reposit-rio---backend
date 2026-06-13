/**
 * Testes unitários com mock — rota POST /login
 *
 * Contexto: sistema de gestão de entregas (C214 - INATEL)
 */

const request = require("supertest");
const express = require("express");

jest.mock("../src/controllers/loginController", () => ({
  login: jest.fn(),
}));

const loginController = require("../src/controllers/loginController");
const loginRoutes = require("../src/routes/loginRoutes");

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use("/", loginRoutes);
  return app;
}

// app no escopo global — acessível por todos os testes
let app;

beforeEach(() => {
  jest.clearAllMocks();
  app = buildApp();
});

describe("POST /login — rota delega para o controller", () => {

  test("deve chamar loginController.login ao receber POST /login", async () => {
    loginController.login.mockImplementation((req, res) => {
      res.status(200).json({ mensagem: "Login realizado com sucesso", tipo: "cliente" });
    });

    await request(app).post("/login").send({ email: "fernanda.lima@duck.com", senha: "123456" });

    expect(loginController.login).toHaveBeenCalledTimes(1);
  });

  test("deve propagar status 401 quando controller rejeitar credenciais", async () => {
    loginController.login.mockImplementation((req, res) => {
      res.status(401).json({ mensagem: "Usuário ou senha inválidos" });
    });

    const response = await request(app).post("/login").send({ email: "hacker@duck.com", senha: "tentativa" });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ mensagem: "Usuário ou senha inválidos" });
    expect(loginController.login).toHaveBeenCalledTimes(1);
  });
});

test("deve repassar email e senha corretamente ao controller", async () => {
  loginController.login.mockImplementation((req, res) => {
    res.status(200).json({ ok: true });
  });

  await request(app).post("/login").send({ email: "lucas.martins@duck.com", senha: "123456" });

  const reqRecebida = loginController.login.mock.calls[0][0];
  expect(reqRecebida.body).toEqual({ email: "lucas.martins@duck.com", senha: "123456" });
});

test("deve retornar content-type application/json", async () => {
  loginController.login.mockImplementation((req, res) => {
    res.status(200).json({ mensagem: "OK" });
  });

  const response = await request(app).post("/login").send({ email: "admin@duck.com", senha: "123456" });

  expect(response.headers["content-type"]).toContain("application/json");
});

test("deve chamar controller uma vez por requisição", async () => {
  loginController.login.mockImplementation((req, res) => {
    res.status(200).json({ ok: true });
  });

  await request(app).post("/login").send({ email: "fernanda.lima@duck.com", senha: "123456" });

  expect(loginController.login).toHaveBeenCalledTimes(1);
});

test("deve encaminhar body vazio ao controller", async () => {
  loginController.login.mockImplementation((req, res) => {
    res.status(400).json({ mensagem: "Usuário e senha são obrigatórios" });
  });

  const response = await request(app).post("/login").send({});

  expect(response.statusCode).toBe(400);
  expect(loginController.login).toHaveBeenCalledTimes(1);
});

test("deve rejeitar GET em /login", async () => {
  const response = await request(app).get("/login");
  expect(response.statusCode).toBe(404);
});