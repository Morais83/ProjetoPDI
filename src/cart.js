// Obter carrinho
export const getCarrinho = () => {
  try {
    return JSON.parse(localStorage.getItem('carrinho')) || [];
  } catch {
    return [];
  }
};

// Guardar carrinho
export const setCarrinho = (carrinho) => {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
};

// Adicionar produto ao carrinho
export const adicionarAoCarrinho = (produto) => {
  const carrinho = getCarrinho();
  const existe = carrinho.find(
    p => p.id_variante === produto.id_variante
  );
  if (existe) {
    existe.quantidade += produto.quantidade;
    setCarrinho(carrinho);
  } else {
    setCarrinho([...carrinho, produto]);
  }
};

// Remover produto do carrinho
export const removerDoCarrinho = (id_variante) => {
  const carrinho = getCarrinho().filter(p => p.id_variante !== id_variante);
  setCarrinho(carrinho);
};

// Atualizar quantidade
export const atualizarQuantidade = (id_variante, quantidade) => {
  const carrinho = getCarrinho().map(p =>
    p.id_variante === id_variante ? { ...p, quantidade } : p
  );
  setCarrinho(carrinho);
};

// Limpar carrinho
export const limparCarrinho = () => {
  localStorage.removeItem('carrinho');
};

// Contar artigos
export const contarArtigos = () => {
  return getCarrinho().reduce((acc, p) => acc + p.quantidade, 0);
};