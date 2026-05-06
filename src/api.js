const BASE_URL = 'http://localhost:5000/api';

export const registar = async (dados) => {
  const res = await fetch(`${BASE_URL}/auth/registo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  return res.json();
};

export const login = async (dados) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  return res.json();
};

export const getPerfil = async () => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/auth/perfil`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return res.json();
};

// ————— PRODUTOS —————

export const getProdutos = async () => {
  const res = await fetch(`${BASE_URL}/produtos`);
  return res.json();
};

export const getProduto = async (id) => {
  const res = await fetch(`${BASE_URL}/produtos/${id}`);
  return res.json();
};

export const criarProduto = async (dados) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/produtos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(dados),
  });
  return res.json();
};

export const editarProduto = async (id, dados) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/produtos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(dados),
  });
  return res.json();
};

export const eliminarProduto = async (id) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/produtos/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return res.json();
};

// ————— FAVORITOS —————

export const getFavoritos = async () => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/favoritos`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
};

export const verificarFavorito = async (id_produto) => {
  const token = localStorage.getItem('token');
  if (!token) return { favorito: false };
  const res = await fetch(`${BASE_URL}/favoritos/verificar/${id_produto}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
};

export const adicionarFavorito = async (id_produto) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/favoritos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ id_produto })
  });
  return res.json();
};

export const removerFavorito = async (id_produto) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/favoritos/${id_produto}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
};

// ————— ENCOMENDAS —————

export const criarEncomenda = async (dados) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/encomendas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(dados),
  });
  return res.json();
};

// ————— RECUPERAR PASSWORD —————
export const pedirRecuperacao = async (email) => {
    try {
        const response = await fetch('http://localhost:5000/api/auth/esqueci-senha', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        return await response.json();
    } catch (error) {
        console.error("Erro no fetch:", error);
        return { erro: 'Erro de ligação ao servidor' };
    }
};

// ————— REPOR PASSWORD —————
export const reporSenha = async (token, novaPassword) => {
    try {
        const response = await fetch(`http://localhost:5000/api/auth/repor-senha`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, novaPassword })
        });
        return await response.json();
    } catch (error) {
        return { erro: 'Erro de ligação ao servidor' };
    }
};