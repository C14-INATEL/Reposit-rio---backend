const express = require("express");
const app = express();

const loginRoutes = require("./src/routes/loginRoutes");

app.use(express.json());

app.use("/", loginRoutes);

app.get("/", (req, res) => {
  res.send("Servidor backend funcionando 🚀");
});

if (require.main === module) {
  app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
  });
}

module.exports = app;