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

        const inserirTransacao = await pool.query(`INSERT INTO transacoes (descricao, valor, data, categoria_id, usuario_id, tipo) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [descricao, valor, data, categoria_id, tokenUsuario.id, tipo]
        )

        return res.status(201).json(inserirTransacao.rows[0])

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }
}



module.exports = {
    listarCategorias,
    cadastarTransacao
}