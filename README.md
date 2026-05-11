# Lilistore — Moda Chique

Loja online de moda desenvolvida com React (frontend) e Node.js/Express (backend), com base de dados MySQL e armazenamento de imagens via Cloudinary.

---

## Tecnologias

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Base de dados:** MySQL
- **Imagens:** Cloudinary
- **Autenticação:** JWT
- **Emails:** Nodemailer

---

## Pré-requisitos

Instala as seguintes ferramentas antes de começar:

```bash
# Node.js (v18 ou superior)
sudo apt update
sudo apt install -y nodejs npm

# Verifica as versões
node -v
npm -v

# MySQL
sudo apt install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

> Em distribuições baseadas em Arch (Manjaro, etc.) substitui `apt` por `pacman -S`

---

## Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/teu-utilizador/lilistore.git
cd lilistore
```

### 2. Instalar dependências

```bash
# Frontend (na raiz do projeto)
npm install

# Backend
cd backend
npm install
cd ..
```

### 3. Configurar a base de dados

```bash
# Entra no MySQL
sudo mysql -u root

# Dentro do MySQL:
CREATE DATABASE modachique;
EXIT;

# Importa o ficheiro SQL
sudo mysql -u root modachique < basedados.sql
```

Se o MySQL tiver password definida:
```bash
mysql -u root -p modachique < basedados.sql
```

### 4. Criar os ficheiros de ambiente

Cria o ficheiro **`backend/.env`**:

```bash
nano backend/.env
```

Cola o seguinte conteúdo (substitui `a_tua_password_mysql` pela tua password do MySQL):

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=a_tua_password_mysql
DB_NAME=modachique
JWT_SECRET=modachique_secret_key_2024
PORT=5000
EMAIL_USER=lilistoremodachique@gmail.com
EMAIL_PASS=yxza vehp eusk ambu
CLOUDINARY_CLOUD_NAME=dsikjwwtp
CLOUDINARY_API_KEY=672846264741849
CLOUDINARY_API_SECRET=6FXsMP16WkP66rcoRb8y0rG2WPQ
FRONTEND_URL=http://localhost:5173
```

Cria o ficheiro **`.env`** na raiz do projeto:

```bash
nano .env
```

```env
VITE_API_URL=http://localhost:5000
```

>  Estes ficheiros não estão no GitHub por segurança.

---

## Arrancar o projeto

Precisas de dois terminais em simultâneo.

**Terminal 1 — Backend:**
```bash
cd backend
node server.js
```

**Terminal 2 — Frontend:**
```bash
npm run dev
```

Abre o browser em: [http://localhost:5173](http://localhost:5173)

---

## Possível erro no MySQL (Linux)

No Linux, o MySQL por vezes não permite login com root sem sudo. Se tiveres erro de acesso, corre:

```bash
sudo mysql -u root
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'a_tua_password';
FLUSH PRIVILEGES;
EXIT;
```

Depois atualiza o `DB_PASSWORD` no `backend/.env` com essa password.

---

## Funcionalidades

- Catálogo com filtros por categoria, marca, cor, tamanho e preço
- Página de produto com seleção de cor e tamanho
- Carrinho de compras
- Registo, login e recuperação de senha por email
- Perfil com favoritos, encomendas e moradas guardadas
- Checkout com vários métodos de pagamento e levantamento em loja
- Página de promoções e página de marcas
- Painel de administração (produtos, categorias, marcas, encomendas, utilizadores)

---

## Estrutura do projeto

```
lilistore/
├── src/                  # Frontend React
│   ├── admin/            # Painel de administração
│   ├── api.js            # Chamadas à API
│   ├── cart.js           # Carrinho (localStorage)
│   └── ...páginas
├── backend/
│   ├── routes/           # Rotas da API REST
│   ├── middleware/       # Autenticação JWT
│   ├── db.js             # Ligação à base de dados
│   └── server.js         # Servidor Express
├── .env                  # Config frontend (não está no git)
└── backend/.env          # Config backend (não está no git)
```
