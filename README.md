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
│   ├── Jenkinsfile
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
| Docker | 24 |
| Docker Compose | v2 |

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

O arquivo `docker-compose.yml` está versionado dentro de `app_backend/`, mas precisa ser copiado para a raiz do projeto antes de rodar:

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

O `Jenkinsfile` dentro de `app_backend/` automatiza o ciclo completo: testes, geração de relatório HTML, envio por e-mail (opcional) e deploy via Docker.

### Pré-requisitos para rodar a pipeline

**1. Jenkins via Docker**

Suba o Jenkins localmente com o comando abaixo. O volume `-v /var/run/docker.sock` permite que a pipeline execute comandos Docker:

```powershell
docker run -d `
  --name jenkins `
  -p 8080:8080 `
  -p 50000:50000 `
  -v jenkins_home:/var/jenkins_home `
  -v /var/run/docker.sock:/var/run/docker.sock `
  jenkins/jenkins:lts
```

Acesse `http://localhost:8080` e conclua o setup inicial com a senha gerada:

```powershell
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

**2. Plugin NodeJS**

- Acesse **Manage Jenkins → Plugins → Available plugins**
- Instale o plugin **NodeJS Plugin**
- Após reiniciar, vá em **Manage Jenkins → Tools → NodeJS installations → Add NodeJS**
- Defina o nome exatamente como `NodeJS-20` e selecione a versão **20.x**

**3. Docker CLI dentro do container Jenkins**

A pipeline executa `docker build` e `docker run` no stage de Deploy. Instale o Docker CLI e conceda permissão ao usuário jenkins:

```powershell
docker exec -u root jenkins apt-get update
docker exec -u root jenkins apt-get install -y docker.io
docker exec -u root jenkins usermod -aG docker jenkins
docker exec -u root jenkins chmod 666 /var/run/docker.sock
docker restart jenkins
```

**4. Liberar a porta 3000 antes do Deploy**

O container de Deploy sobe na porta 3000. Se houver outro container usando essa porta (ex: `projetoduck-backend-1`), pare-o antes de rodar a pipeline:

```powershell
docker stop projetoduck-backend-1
```

Após os testes, para retornar ao ambiente normal:

```powershell
docker compose up -d
```

### Configurar a pipeline no Jenkins

1. Clique em **New Item**, dê um nome (ex: `backend-pipeline`) e escolha **Pipeline**
2. Em **Pipeline → Definition** selecione **Pipeline script from SCM**
3. Em **SCM** escolha **Git** e informe a URL:
   ```
   https://github.com/C14-INATEL/Reposit-rio---backend.git
   ```
4. Em **Branch Specifier** coloque `*/main`
5. Em **Script Path** coloque `app_backend/Jenkinsfile`
6. Salve e clique em **Build Now**

### Stages da pipeline

| Stage | O que faz | Sinal de sucesso |
|---|---|---|
| Checkout | Clona o repositório | Revision checkada sem erro |
| Instalar dependências | Executa `npm install` | `audited X packages` |
| Rodar testes e gerar relatório | Executa o Jest e gera `reports/test-report.html` | `Relatorio gerado em ...` |
| Enviar relatório por e-mail | Envia o HTML por SMTP (opcional) | `Sending email to: ...` |
| Deploy | Build da imagem e restart do container `backend` na porta 3000 | Container ID retornado |

### Relatório de testes

Após cada build, o relatório HTML fica disponível em **Build → Artifacts → reports/test-report.html** dentro do Jenkins.

### Envio de relatório por e-mail (opcional)

Para ativar o envio, configure o SMTP em **Manage Jenkins → System → Extended E-mail Notification**:

| Campo | Valor |
|---|---|
| SMTP server | `smtp.gmail.com` |
| SMTP Port | `465` |
| Use SSL | marcado |
| Credenciais | e-mail + senha de app do Google |

> Para gerar a senha de app: acesse [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords), crie uma senha para "Mail" e use-a no lugar da senha normal da conta.

Ao disparar o build, informe o e-mail no parâmetro `EMAIL_DESTINATARIO_RELATORIO`. Deixando vazio, o stage é pulado automaticamente.

---

## Uso de Inteligência Artificial

Este projeto contou com o auxílio do **Claude** (Anthropic) durante o desenvolvimento.

A IA foi utilizada como ferramenta de apoio nas seguintes frentes:

- **Geração e revisão de código** — controllers, services, utilitários e rotas.
- **Escrita de testes** — criação dos arquivos de teste com Jest e mocks, cobrindo cenários de sucesso, erro de validação e falhas internas.
- **Documentação** — geração deste README e orientações sobre estrutura do projeto.
- **Resolução de dúvidas técnicas** — boas práticas de organização de código Node.js/Express, configuração do Docker Compose e pipeline Jenkins.

> O código gerado foi revisado, adaptado e validado pela equipe antes de ser incorporado ao projeto.
