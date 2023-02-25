const express = require('express')
const rotas = express()

const usuarios = require('./controladores/usuarios');
const verificarUsuarioLogado = require('./intermediarios/autorizacao');



//rotas

rotas.post('/usuario', usuarios.cadastrarUsuario);
rotas.post('/login', usuarios.login);

rotas.use(verificarUsuarioLogado);

rotas.get('/usuario', usuarios.detalharUsuario);
rotas.put('/usuario', usuarios.atualizarUsuario);
rotas.get('/categoria', usuarios.listarCategorias)

module.exports = rotas