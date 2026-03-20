# Reposit-rio---backend
Backend de um sistema web para gestão de entregas que organiza pedidos por região, prioriza entregas urgentes e calcula automaticamente o custo logístico.

1) Requisitos
Node.js >= 20
npm >= 9
(opcional) Docker + Docker Compose
Git (para clonar)

2) Clonar o repositório

git clone https://github.com/C14-INATEL/Reposit-rio---backend.git
cd Reposit-rio---backend/app_backend

3) Instalar dependências

npm install

4) Rodar em modo desenvolvimento

node index.js

5) Variáveis de ambiente (se usar banco ou config)

PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=appdb

6) Usando Docker

cd c:\Users\faria\Documents\DUCK
docker compose up -d --build
http://localhost:3000