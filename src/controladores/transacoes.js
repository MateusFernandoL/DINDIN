const pool = require('../conexao');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const senhaJwt = require('../senhaJwt');

const listarTransacoes = async (req, res) => {
    const transacoesUsuario = await pool.query(`SELECT t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao as categoria_nome 
    FROM transacoes t JOIN categorias c ON t.usuario_id = c.id WHERE t.usuario_id = $1`, [tokenUsuario.id]);

    return res.status(200).json(transacoesUsuario.rows)
}

module.exports = {
    listarTransacoes
}