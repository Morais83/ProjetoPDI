# Lilistore — Moda Chique

Loja online de moda desenvolvida com React (frontend) e Node.js/Express (backend), com base de dados MySQL e armazenamento de imagens local.

---

## Tecnologias

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Base de dados:** MySQL
- **Autenticação:** JWT
- **Pagamentos:** Stripe
- **Emails:** Nodemailer (Gmail)

---

## Pré-requisitos

- [Node.js v18+](https://nodejs.org/)
- [MySQL 8.0+](https://dev.mysql.com/downloads/mysql/)

---

## Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/Morais83/ProjetoPDI.git
cd ProjetoPDI
```

### 2. Instalar dependências

```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

### 3. Configurar variáveis de ambiente

Cria o ficheiro `backend/.env` com base no exemplo abaixo:

```env
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=modachique
JWT_SECRET=
PORT=5000
EMAIL_USER=
EMAIL_PASS=
FRONTEND_URL=
STRIPE_SECRET_KEY=sk_test_
```

Cria também o ficheiro `.env` na raiz do projeto:

```env
VITE_API_URL=
VITE_STRIPE_PUBLIC_KEY=
```

### 4. Importar a base de dados

No MySQL Workbench (ou cliente MySQL), cria a base de dados e importa o ficheiro SQL:

```sql
CREATE DATABASE modachique;
```

Depois importa o ficheiro `modachique.sql` incluído no repositório.

---

## Execução

Abre dois terminais:

```bash
# Terminal 1 — Backend
cd backend
node server.js

# Terminal 2 — Frontend
npm run dev
```

O site fica disponível em `http://localhost:5173`.

---

## Funcionalidades

- Catálogo de produtos com filtros por categoria e marca
- Carrinho de compras e checkout
- Pagamento por cartão (Stripe), MBWay e cobrança
- Autenticação de utilizadores (registo, login, recuperação de password)
- Área de perfil com histórico de encomendas e moradas
- Painel de administração (produtos, categorias, marcas, encomendas, utilizadores)
- Notificações por email (confirmação de encomenda, atualizações de estado)
- Sistema de suporte ao cliente

---

## Autores
Pedro Moreira 
João Morais 
Projeto desenvolvido no âmbito da unidade curricular de Programação e Desenvolvimento de Internet.
