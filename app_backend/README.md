# Duck — Backend

Backend do sistema de gestão de entregas Duck. Organiza pedidos por região e gerencia lojas, usuários e entregas.

---

## Tecnologias

- Node.js 20 + Express 5
- MySQL 8 (via Docker)
- mysql2 (driver de banco)
- Jest + Supertest (testes)

---

## Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e rodando
- Git

---

## Como rodar

### 1. Clonar o repositório

```bash
git clone https://github.com/C14-INATEL/Reposit-rio---backend.git
cd Reposit-rio---backend
```

### 2. Subir banco de dados + backend com Docker

```bash
docker compose up -d --build
```

O Docker irá:
- Subir o MySQL 8 na porta `3306`
- Executar o `db.sql` automaticamente (cria tabelas e insere dados iniciais)
- Subir o backend na porta `3000`

### 3. Verificar se está funcionando

```bash
curl http://localhost:3000/
# Resposta: Servidor backend funcionando 🚀
```

---

## Variáveis de ambiente

Configuradas automaticamente pelo `docker-compose.yml`:

| Variável   | Valor padrão      |
|------------|-------------------|
| DB_HOST    | db                |
| DB_PORT    | 3306              |
| DB_USER    | root              |
| DB_PASS    | root              |
| DB_NAME    | sistema_entregas  |
| PORT       | 3000              |

---

## Rotas disponíveis

### Autenticação
| Método | Rota       | Descrição                        |
|--------|------------|----------------------------------|
| POST   | /login     | Login com e-mail e senha         |
| POST   | /cadastro  | Cadastro de novo usuário         |

### Usuários
| Método | Rota            | Descrição                  |
|--------|-----------------|----------------------------|
| GET    | /usuarios       | Listar todos os usuários   |
| GET    | /usuarios?tipo= | Filtrar por tipo           |
| PUT    | /usuarios/:id   | Atualizar usuário          |
| DELETE | /usuarios/:id   | Excluir usuário            |

### Lojas
| Método | Rota        | Descrição            |
|--------|-------------|----------------------|
| GET    | /lojas      | Listar todas as lojas|
| POST   | /lojas      | Cadastrar nova loja  |
| PUT    | /lojas/:id  | Atualizar loja       |
| DELETE | /lojas/:id  | Excluir loja         |

---

## Usuários de teste (seed)

| E-mail             | Senha  | Tipo     |
|--------------------|--------|----------|
| admin@email.com    | 123456 | admin    |
| op1@email.com      | 123456 | operador |
| op2@email.com      | 123456 | operador |
| A@email.com        | 123456 | lojista  |
| B@email.com        | 123456 | lojista  |

---

## Rodar testes

```bash
cd app_backend
npm install
npm test
```

---

## Comandos úteis do Docker

```bash
# Ver logs do banco e backend
docker compose logs -f

# Parar os containers
docker compose down

# Recriar tudo do zero (apaga dados)
docker compose down -v
docker compose up -d --build
```
