const authService = require("../src/services/authService");
const loginController = require("../src/controllers/loginController");

describe("loginController", () => {
  let req;
  let res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    jest.spyOn(authService, "autenticar").mockReset();
  });

  test("deve retornar admin quando email for válido e senha for 123456", async () => {
    req.body = { email: "lucas.martins@duck.com", senha: "123456" };
    authService.autenticar.mockResolvedValue({
      id: 1,
      nome: "Lucas Martins",
      email: "lucas.martins@duck.com",
      tipo: "admin",
    });

    await loginController.login(req, res);

    expect(authService.autenticar).toHaveBeenCalledWith("lucas.martins@duck.com", "123456");
    expect(res.status).not.toHaveBeenCalled();
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

  test("deve retornar operador quando email for válido e senha for 123456", async () => {
    req.body = { email: "fernanda.lima@duck.com", senha: "123456" };
    authService.autenticar.mockResolvedValue({
      id: 2,
      nome: "Fernanda Lima",
      email: "fernanda.lima@duck.com",
      tipo: "operador",
    });

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

  test("deve retornar 401 quando email for inválido", async () => {
    req.body = { email: "invalido@duck.com", senha: "1234" };
    authService.autenticar.mockResolvedValue(null);

    await loginController.login(req, res);

    expect(authService.autenticar).toHaveBeenCalledWith("invalido@duck.com", "1234");
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      mensagem: "Usuário ou senha inválidos",
    });
  });

  test("deve retornar 401 quando senha for inválida", async () => {
    req.body = { email: "lucas.martins@duck.com", senha: "senhaerrada" };
    authService.autenticar.mockResolvedValue(null);

    await loginController.login(req, res);

    expect(authService.autenticar).toHaveBeenCalledWith("lucas.martins@duck.com", "senhaerrada");
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      mensagem: "Usuário ou senha inválidos",
    });
  });
});

