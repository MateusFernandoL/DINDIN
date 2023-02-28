const pool = require('../conexao');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const senhaJwt = require('../senhaJwt');

const listarCategorias = async (req, res) => {
    try {
        const categorias = await pool.query('SELECT * FROM categorias')
        return res.status(200).json(categorias.rows)

    } catch (error) {
        return res.status(400).json({ mensagem: "Erro interno do servidor" })
    }
}

const listarTransacoes = async (req, res) => {
    const transacoesUsuario = await pool.query(`SELECT t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao as categoria_nome 
    FROM transacoes t JOIN categorias c ON t.usuario_id = c.id WHERE t.usuario_id = $1`, [tokenUsuario.id]);

    return res.status(200).json(transacoesUsuario.rows)
}

const cadastarTransacao = async (req, res) => {

    const { descricao, valor, data, categoria_id, tipo } = req.body

    if (!descricao || !valor || !data || !categoria_id || !tipo) {
        return res.status(400).json({ "mensagem": "Todos os campos obrigatórios devem ser informados." })
    }

    if (tipo !== "entrada" && tipo !== "saída") {
        res.status(400).json({ mensagem: "Informe o tipo de transação (entrada ou saída)." })
    }

    try {
        const categoriaExiste = await pool.query('SELECT * FROM categorias where id = $1', [categoria_id])

        if (categoriaExiste.rowCount === 0) {
            return res.status(400).json({ mensagem: "A categoria informada não existe, informe outra categoria." })
        }

        const inserirTransacao = await pool.query(`INSERT INTO transacoes (tipo, descricao, valor, data, usuario_id, categoria_id) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [tipo, descricao, valor, data, tokenUsuario.id, categoria_id]
        )

        const categoria = await pool.query('SELECT descricao from categorias where id = $1', [categoria_id])

        inserirTransacao.rows[0].categoria_nome = categoria.rows[0].descricao

        return res.status(201).json(inserirTransacao.rows[0])

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}

const atualizarTransacao = async (req, res) => {
    const { id } = req.params;
    const { descricao, valor, data, categoria_id, tipo } = req.body;

    try {
        if (!descricao || !valor || !data || !categoria_id || !tipo) {
            return res.status(400).json({ mensagem: "Todos os campos obrigatórios devem ser informados." })
        }

        const validarIdTransacao = await pool.query('SELECT * FROM transacoes WHERE id = $1 AND usuario_id = $2', [id, tokenUsuario.id]);

        if (validarIdTransacao.rowCount == 0) {
            return res.status(404).json({ mensagem: "Transação não encontrada" });
        }

        const validarCategoria = await pool.query('SELECT * FROM categorias WHERE id = $1', [categoria_id]);

        if (!validarCategoria.rows[0]) {
            return res.status(404).json({ mensagem: "Categoria informada não existe" });
        }

        if (tipo !== "entrada" && tipo !== "saida") {
            return res.status(400).json({ mensagem: "Tipo inválido" });
        }

        const alterecao = await pool.query(`
            UPDATE transacoes SET descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5 
            WHERE id = $6 AND usuario_id = $7`, [descricao, valor, data, categoria_id, tipo, id, tokenUsuario.id]
        );

        return res.status(200).json();
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
}

module.exports = {
    listarCategorias,
    cadastarTransacao,
    listarTransacoes,
    atualizarTransacao
}