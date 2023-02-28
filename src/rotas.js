const express = require('express')
const rotas = express()

const usuarios = require('./controladores/usuarios');
const transacoes = require('./controladores/transacoes');

const verificarUsuarioLogado = require('./intermediarios/autorizacao');



//rotas

rotas.post('/usuario', usuarios.cadastrarUsuario);
rotas.post('/login', usuarios.login);

rotas.use(verificarUsuarioLogado);

rotas.get('/usuario', usuarios.detalharUsuario);
rotas.put('/usuario', usuarios.atualizarUsuario);
rotas.get('/categoria', transacoes.listarCategorias)
rotas.get('/transacao', transacoes.listarTransacoes);
rotas.post('/transacao', transacoes.cadastarTransacao);
rotas.put('/transacao/:id', transacoes.atualizarTransacao);

module.exports = rotas