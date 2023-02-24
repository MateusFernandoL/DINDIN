const express = require('express')
const rotas = express()

const { detalharUsuario } = require('./controladores/usuarios');

const verificarUsuarioLogado = require('./intermediarios/autorizacao');



//rotas

// rotas.post('/cadastrarUsuario', cadastrarUsuario);
// rotas.post('/login', login);

// rotas.use(verificarUsuarioLogado);

rotas.get('/usuario', detalharUsuario);

module.exports = rotas