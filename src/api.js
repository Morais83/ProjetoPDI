const BASE_URL = 'http://localhost:5000/api';

// ————— AUTH —————

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