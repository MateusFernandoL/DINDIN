const pool = require('../conexao');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const senhaJwt = require('../senhaJwt');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body
    
    if(!nome || !email || !senha) {
        return res.status(400).json({mensagem: "Informe o nome, email e senha." })
    }
    
    try {
        const emailExiste = await pool.query('select * from usuarios where email = $1', [email])

        if(emailExiste.rowCount > 0) {
            return res.status(400).json({mensagem: "Já existe usuário cadastrado com o e-mail informado."})
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10)
        
        const { rows } = await pool.query(
            'insert into usuarios (nome, email, senha) values ($1, $2, $3) returning *', 
            [nome, email, senhaCriptografada]
        )
        
        const { senha: _, ...usuario } = rows[0] 

        return res.status(200).json(usuario)

    } catch (error) {
        return res.status(500).json({mensagem: "Erro interno do servidor"})
    }
}

const login = async (req, res) => {
    const { email, senha } = req.body

    if(!email || !senha) {
        return res.status(400).json({mensagem: "Informe o email e senha." })
    }
    try {
        const usuario = await pool.query('select * from usuarios where email = $1', [email])

        if(usuario.rowCount === 0) {
            return res.status(400).json({mensagem: "Email ou senha inválidos."})
        }

        const senhaValida = await bcrypt.compare(senha, usuario.rows[0].senha)

        if(!senhaValida) {
            return res.status(400).json({mensagem: "Email ou senha inválidos"})
        }

        const token = jwt.sign({id: usuario.rows[0].id}, senhaJwt, {expiresIn: '1d'})

        const { senha: _, ...usuarioLogado} = usuario.rows[0]
               
        return res.status(200).json({ usuario: usuarioLogado, token})

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({mensagem: "Erro interno do servidor"})
    }
}

const detalharUsuario = async (req, res) => {
    const {authorization} = req.headers;
    
    // o token foi gerado, vc pode acessá-lo pela propriedade 'tokenUsuario' 
    // console.log(tokenUsuario)
    
    try {
        const token = authorization.split(' ')[1];
    
        const idToken = jwt.verify(token, senhaJwt);
    
        const acharUsuario = await pool.query('SELECT * FROM usuarios WHERE id = $1', [idToken.id]);

        const {id, nome, email, } = acharUsuario.rows[0]

        return res.status(200).json({
            id,
            nome,
            email
        });

    } catch (error) {
        return res.status(500).json({mensagem: "Erro interno do servidor"})
    }
}

module.exports = {
    cadastrarUsuario,
    login,
    detalharUsuario
}