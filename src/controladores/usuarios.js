const pool = require('../conexao');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const senhaJwt = require('../senhaJwt');

// Resposta
// Em caso de sucesso, deveremos enviar no corpo (body) da resposta o conteúdo do usuário cadastrado, 
// incluindo seu respectivo id e excluindo a senha criptografada. Em caso de falha na validação, a resposta deverá possuir status code apropriado, 
// e em seu corpo (body) deverá possuir um objeto com uma propriedade mensagem que deverá possuir como valor um texto explicando o motivo da falha.

// REQUISITOS OBRIGATÓRIOS

// Validar os campos obrigatórios:
// nome
// email
// senha
// Validar se o e-mail informado já existe
// Criptografar a senha antes de persistir no banco de dados
// Cadastrar o usuário no banco de dados

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body
    
    if(!nome || !email || !senha) {
        return res.status(400).json({mensagem: "Informe o nome, email e senha." })
    }

    try {
        const resultado = await pool.query(
            "select * from usuarios where email = $1", 
            [email]
        )
        
        if(resultado) {
            return res.status(400).json({mensagem: "O email informado já está sendo utilizado, informe outro email."})
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10)
        
        const novoUsuario = await pool.query('insert into usuarios (nome, email, senha) values ($1, $2, $3) returning *', 
        [nome, email, senhaCriptografada])
//retirar a senhaCriptografada

        return res.status(200).json(novoUsuario)

    } catch (error) {
        return res.status(500).json({mensagem: "Erro interno do servidor"})
    }
}

const detalharUsuario = async (req, res) => {
    const {autorization} = req.headers;
    
    try {
        const token = autorization.split(" ")[1];
    
        const { idToken } = jwt.verify(token, senhaJwt);
    
        const acharUsuario = await pool.query('SELECT * FROM usuarios WHERE id = $1', [idToken]);
    
        const {id, nome, email} = acharUsuario.rows
        
        return res.status(200).json({
            id,
            nome,
            email
        })
    } catch (error) {
        return res.status(500).json({mensagem: "Erro interno do servidor"})
    }
}

module.exports = {
    cadastrarUsuario,
    detalharUsuario
}