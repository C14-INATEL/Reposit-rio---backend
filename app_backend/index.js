const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const loginRoutes = require("./src/routes/loginRoutes");
const lojasRoutes = require("./src/routes/lojasRoutes");
const usuariosRoutes = require("./src/routes/usuariosRoutes");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());

app.use("/", loginRoutes);
app.use("/", lojasRoutes);
app.use("/", usuariosRoutes);

app.get("/", (req, res) => {
  res.send("Servidor backend funcionando 🚀");
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

module.exports = app;
