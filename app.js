const express = require('express');
const app = express();
// const morgan = require('morgan');
const bodyParser = require('body-parser');
var cors = require('cors')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const rotaUsuarios = require('./routes/usuario')
const rotaCleintes = require('./routes/cliente')
const rotaPedidos = require('./routes/pedido')


// app.use(morgan('dev'));
app.use('/usuario',rotaUsuarios);
app.use('/cliente',rotaCleintes);
app.use('/pedido',rotaPedidos);

module.exports = app;