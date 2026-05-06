const express = require('express');
const router = express.Router();
const db = require('../db');

// GET todos os produtos com categoria, marca e primeira imagem
router.get('/', async (req, res) => {
  try {
    const [produtos] = await db.query(`
      SELECT p.*, 
             c.nome_categoria, 
             m.nome_marca,
             (SELECT url FROM imagens_produto WHERE id_produto = p.id_produto AND ordem = 1) AS imagem_principal
      FROM produtos p
      LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
      LEFT JOIN marcas m ON p.id_marca = m.id_marca
      ORDER BY p.id_produto DESC
    `);
    res.json(produtos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao obter produtos' });
  }
});

// Rota de pesquisa 
router.get('/pesquisa', async (req, res) => {
    const termo = req.query.q; 

    if (!termo) {
        return res.status(400).json({ erro: "Termo de pesquisa não fornecido." });
    }

    try {
        // Query atualizada: igual à principal, mas com o WHERE para filtrar
        const [resultados] = await db.query(`
            SELECT p.*, 
                   c.nome_categoria, 
                   m.nome_marca,
                   (SELECT url FROM imagens_produto WHERE id_produto = p.id_produto AND ordem = 1) AS imagem_principal
            FROM produtos p
            LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
            LEFT JOIN marcas m ON p.id_marca = m.id_marca
            WHERE p.nome_produto LIKE ? OR p.descricao LIKE ?
            ORDER BY p.id_produto DESC
        `, [`%${termo}%`, `%${termo}%`]);

        res.json(resultados);
    } catch (err) {
        console.error("Erro ao pesquisar produtos:", err);
        res.status(500).json({ erro: "Erro no servidor ao pesquisar." });
    }
});

// GET produtos em promoção
router.get('/promocoes', async (req, res) => {
  try {
    const [produtos] = await db.query(`
      SELECT p.*, 
             c.nome_categoria, 
             m.nome_marca,
             (SELECT url FROM imagens_produto WHERE id_produto = p.id_produto AND ordem = 1) AS imagem_principal,
             ROUND((1 - p.preco / p.preco_anterior) * 100) AS desconto
      FROM produtos p
      LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
      LEFT JOIN marcas m ON p.id_marca = m.id_marca
      WHERE p.preco_anterior IS NOT NULL AND p.preco_anterior > p.preco
      ORDER BY desconto DESC
    `);
    res.json(produtos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao obter promoções' });
  }
});

// GET produto por id com todas as imagens e variantes
router.get('/:id', async (req, res) => {
  try {
    const [produto] = await db.query(`
      SELECT p.*, c.nome_categoria, c.id_categoria_pai, m.nome_marca
      FROM produtos p
      LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
      LEFT JOIN marcas m ON p.id_marca = m.id_marca
      WHERE p.id_produto = ?
    `, [req.params.id]);

    if (produto.length === 0) return res.status(404).json({ erro: 'Produto não encontrado' });

    const [imagens] = await db.query(
      'SELECT * FROM imagens_produto WHERE id_produto = ? ORDER BY ordem',
      [req.params.id]
    );

    const [variantes] = await db.query(
      'SELECT * FROM variante WHERE id_produto = ?',
      [req.params.id]
    );

    res.json({ ...produto[0], imagens, variantes });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao obter produto' });
  }
});

// POST criar produto
router.post('/', async (req, res) => {
  const { id_categoria, id_marca, nome_produto, preco, preco_anterior, descricao, materiais, guia_cuidados, stock, imagens, variantes } = req.body;

  try {
    const [resultado] = await db.query(
      'INSERT INTO produtos (id_categoria, id_marca, nome_produto, preco, preco_anterior, descricao, materiais, guia_cuidados, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id_categoria, id_marca, nome_produto, preco, preco_anterior || null, descricao, materiais, guia_cuidados, stock || 0]
    );

    const id_produto = resultado.insertId;

    // Inserir imagens
    if (imagens && imagens.length > 0) {
      for (const img of imagens) {
        await db.query(
          'INSERT INTO imagens_produto (id_produto, url, ordem) VALUES (?, ?, ?)',
          [id_produto, img.url, img.ordem]
        );
      }
    }

    // Inserir variantes
    if (variantes && variantes.length > 0) {
      for (const v of variantes) {
        await db.query(
          'INSERT INTO variante (id_produto, tamanho, cor, stock_variante) VALUES (?, ?, ?, ?)',
          [id_produto, v.tamanho, v.cor, v.stock_variante || 0]
        );
      }
    }

    res.status(201).json({ mensagem: 'Produto criado com sucesso!', id: id_produto });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao criar produto' });
  }
});

// PUT editar produto
router.put('/:id', async (req, res) => {
  const { id_categoria, id_marca, nome_produto, preco, preco_anterior, descricao, materiais, guia_cuidados, stock, imagens, variantes } = req.body;

  try {
    await db.query(
      'UPDATE produtos SET id_categoria=?, id_marca=?, nome_produto=?, preco=?, preco_anterior=?, descricao=?, materiais=?, guia_cuidados=?, stock=? WHERE id_produto=?',
      [id_categoria, id_marca, nome_produto, preco, preco_anterior || null, descricao, materiais, guia_cuidados, stock, req.params.id]
    );

    // Atualizar imagens
    if (imagens) {
      await db.query('DELETE FROM imagens_produto WHERE id_produto = ?', [req.params.id]);
      for (const img of imagens) {
        await db.query(
          'INSERT INTO imagens_produto (id_produto, url, ordem) VALUES (?, ?, ?)',
          [req.params.id, img.url, img.ordem]
        );
      }
    }

    // Atualizar variantes
    if (variantes) {
      await db.query('DELETE FROM variante WHERE id_produto = ?', [req.params.id]);
      for (const v of variantes) {
        await db.query(
          'INSERT INTO variante (id_produto, tamanho, cor, stock_variante) VALUES (?, ?, ?, ?)',
          [req.params.id, v.tamanho, v.cor, v.stock_variante || 0]
        );
      }
    }

    res.json({ mensagem: 'Produto atualizado com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar produto' });
  }
});

// DELETE eliminar produto
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM produtos WHERE id_produto = ?', [req.params.id]);
    res.json({ mensagem: 'Produto eliminado com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao eliminar produto' });
  }
});



module.exports = router;