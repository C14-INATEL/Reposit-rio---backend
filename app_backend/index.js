require('dotenv').config()

const express = require('express')
const cors = require('cors')

const loginRoutes = require('./src/routes/loginRoutes')
const lojasRoutes = require('./src/routes/lojasRoutes')
const usuariosRoutes = require('./src/routes/usuariosRoutes')
const entregasRoutes = require('./src/routes/entregasRoutes')
const regioesRoutes = require('./src/routes/regioesRoutes')

const app = express()
const PORT = process.env.PORT || 3000

const rotas = [
  loginRoutes,
  lojasRoutes,
  usuariosRoutes,
  entregasRoutes,
  regioesRoutes,
]

// Middleware manual mantido para responder preflight antes das rotas.
const configurarCorsManual = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204)
  }

  return next()
}

const registrarMiddlewares = () => {
  app.use(configurarCorsManual)
  app.use(cors())
  app.use(express.json())
}

const registrarRotas = () => {
  rotas.forEach((rota) => app.use('/', rota))

  app.get('/', (req, res) => {
    res.send('Servidor backend funcionando 🚀')
  })
}

const iniciarServidor = () => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
  })
}

registrarMiddlewares()
registrarRotas()

if (require.main === module) {
  iniciarServidor()
}

module.exports = app
