# Backend — Sistema de Gestão de Entregas

Backend de um sistema web para gestão de entregas que organiza pedidos por região, prioriza entregas urgentes e calcula automaticamente o custo logístico.

---

## Estrutura esperada do repositório

Este repositório contém apenas o backend (`app_backend/`). Dois arquivos vivem **fora** desta pasta e precisam estar na **raiz do projeto** (um nível acima de `app_backend/`):

```
raiz-do-projeto/
├── docker-compose.yml          ← deve estar aqui, não dentro de app_backend/
├── package.json                ← (se existir na raiz, para scripts globais)
├── app_backend/
│   ├── index.js
│   ├── package.json            ← dependências do backend
│   ├── Dockerfile
│   └── ...
└── Repositorio_Banco_De_Dados/ ← repositório separado com o SQL e seed
    ├── db.sql
    └── popular_banco.js
```

> O `docker-compose.yml` referencia caminhos relativos como `../Repositorio_Banco_De_Dados/`, por isso ele precisa ficar na raiz e não dentro de `app_backend/`.

---

## Pré-requisitos

| Ferramenta | Versão mínima |
|---|---|
| Node.js | 20 |
| npm | 9 |
| Docker | 24 (para execução via Docker) |
| Docker Compose | v2 (para execução via Docker) |

---

## Opção 1 — Executar com Docker (recomendado)

O Docker Compose sobe o banco MySQL, executa o seed de dados e inicia o backend automaticamente.

### 1. Clone os dois repositórios lado a lado

```bash
git clone https://github.com/C14-INATEL/Reposit-rio---backend.git
git clone <url-do-repositorio-banco>   # Repositorio_Banco_De_Dados
```

A estrutura de pastas deve ficar como mostrado na seção acima.

### 2. Copie o `docker-compose.yml` para a raiz

O arquivo `docker-compose.yml` está versionado dentro de `app_backend/`, mas precisa ser movido (ou copiado) para a raiz do projeto antes de rodar:

```bash
# A partir da raiz do projeto
cp app_backend/docker-compose.yml ./docker-compose.yml
```

### 3. Suba os containers

```bash
# A partir da raiz do projeto (onde está o docker-compose.yml)
docker compose up -d --build
```

O Compose vai:
1. Subir o MySQL 8 e aguardar ele ficar saudável.
2. Rodar o serviço `seed` que popula o banco automaticamente.
3. Subir o `backend` na porta **3000** somente após o seed concluir.

### 4. Verifique se está no ar

```bash
curl http://localhost:3000
# Resposta: Servidor backend funcionando 🚀
```

### 5. Parar os containers

```bash
docker compose down
```

Para remover também os volumes (apaga os dados do banco):

```bash
docker compose down -v
```

---

## Opção 2 — Executar localmente (sem Docker)

### 1. Configure o banco de dados

Certifique-se de ter um MySQL rodando localmente e crie o banco com o script do repositório de banco de dados:

```bash
mysql -u root -p < ../Repositorio_Banco_De_Dados/db.sql
```

### 2. Configure as variáveis de ambiente

Dentro da pasta `app_backend/`, copie o arquivo de exemplo e preencha com seus dados:

```bash
cd app_backend
cp .env.example .env
```

Edite o `.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=sua_senha
DB_NAME=sistema_entregas
PORT=3000
NODE_ENV=development
```

### 3. Instale as dependências

```bash
# Dentro de app_backend/
npm install
```

### 4. Inicie o servidor

```bash
npm start
# ou
node index.js
```

O servidor estará disponível em `http://localhost:3000`.

---

## Rodando os testes

Os testes usam Jest com mocks — não é necessário banco de dados ativo.

```bash
# Dentro de app_backend/
npm test
```

Para rodar em sequência (necessário no CI/Jenkins):

```bash
npm test -- --runInBand
```

Os relatórios de teste são gerados na pasta `app_backend/reports/` após a execução pelo pipeline Jenkins.

---

## Rotas disponíveis

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/` | Health check |
| `POST` | `/login` | Autenticação |
| `GET` | `/usuarios` | Listar usuários |
| `POST` | `/cadastro` | Cadastrar usuário |
| `PUT` | `/usuarios/:id` | Atualizar usuário |
| `DELETE` | `/usuarios/:id` | Excluir usuário |
| `GET` | `/lojas` | Listar lojas |
| `POST` | `/lojas` | Criar loja |
| `PUT` | `/lojas/:id` | Atualizar loja |
| `DELETE` | `/lojas/:id` | Excluir loja |
| `GET` | `/entregas` | Listar entregas |
| `GET` | `/entregas/:id` | Buscar entrega por ID |
| `POST` | `/entregas` | Criar entrega |
| `PUT` | `/entregas/:id` | Atualizar entrega |
| `DELETE` | `/entregas/:id` | Excluir entrega |
| `GET` | `/regioes` | Listar regiões |

---

## Variáveis de ambiente

| Variável | Padrão | Descrição |
|---|---|---|
| `DB_HOST` | `localhost` | Host do banco de dados |
| `DB_PORT` | `3306` | Porta do banco de dados |
| `DB_USER` | `root` | Usuário do banco |
| `DB_PASS` | `root` | Senha do banco |
| `DB_NAME` | `sistema_entregas` | Nome do banco |
| `PORT` | `3000` | Porta do servidor |
| `NODE_ENV` | `development` | Ambiente de execução |

---

## Pipeline Jenkins

O `Jenkinsfile` dentro de `app_backend/` automatiza:

1. **Checkout** do código.
2. **Instalação** das dependências.
3. **Execução dos testes** com geração de relatório HTML.
4. **Envio do relatório** por e-mail (opcional — configure o parâmetro `EMAIL_DESTINATARIO_RELATORIO`).
5. **Deploy** via Docker (build da imagem e restart do container).

---

## Uso de Inteligência Artificial

Este projeto contou com o auxílio do **Claude** (Anthropic) durante o desenvolvimento.

A IA foi utilizada como ferramenta de apoio nas seguintes frentes:

- **Geração e revisão de código** — controllers, services, utilitários e rotas.
- **Escrita de testes** — criação dos arquivos de teste com Jest e mocks, cobrindo cenários de sucesso, erro de validação e falhas internas.
- **Documentação** — geração deste README e orientações sobre estrutura do projeto.
- **Resolução de dúvidas técnicas** — boas práticas de organização de código Node.js/Express, configuração do Docker Compose e pipeline Jenkins.

> O código gerado foi revisado, adaptado e validado pela equipe antes de ser incorporado ao projeto.
