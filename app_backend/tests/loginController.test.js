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
  });

  test("deve retornar admin quando usuário for admin e senha for 1234", () => {
    req.body = { usuario: "admin", senha: "1234" };

    loginController.login(req, res);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      mensagem: "Login realizado com sucesso",
      tipo: "admin",
    });
  });

  test("deve retornar cliente quando usuário for cliente e senha for 1234", () => {
    req.body = { usuario: "cliente", senha: "1234" };

    loginController.login(req, res);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      mensagem: "Login realizado com sucesso",
      tipo: "cliente",
    });
  });

  test("deve retornar 401 quando usuário for inválido", () => {
    req.body = { usuario: "invalido", senha: "1234" };

    loginController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      mensagem: "Usuário ou senha inválidos",
    });
  });

  test("deve retornar 401 quando senha for inválida", () => {
    req.body = { usuario: "admin", senha: "senhaerrada" };

    loginController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      mensagem: "Usuário ou senha inválidos",
    });
  });
});

