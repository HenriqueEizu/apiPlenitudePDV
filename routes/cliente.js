const express = require('express');
const router = express.Router();
const mysql = require('mssql');
let config = require('../config.js');
var cors = require('cors')
// const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
// const Login = require('../middleware/login');
const clienteControllers = require('../controllers/cliente-controller');


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.options('/listaclientes', cors()) // enable pre-flight request for DELETE 
router.get('/listaclientes', cors(), clienteControllers.GetAllClientes)

router.options('/GetAllEstados', cors()) // enable pre-flight request for DELETE 
router.get('/GetAllEstados', cors(), clienteControllers.GetAllEstados)


router.options('/GetIdCliente/:id', cors()) // enable pre-flight request for DELETE 
router.get('/GetIdCliente/:id', cors(), clienteControllers.GetIdCliente)

router.options('/GetContatoCliente/:id', cors()) // enable pre-flight request for DELETE 
router.get('/GetContatoCliente/:id', cors(), clienteControllers.GetContatoCliente)

router.options('/ConsultaCEP/:id', cors()) // enable pre-flight request for DELETE 
router.get('/ConsultaCEP/:id', cors(), clienteControllers.ConsultaCEP)

router.options('/ValidaCnpjCpf/:id', cors()) // enable pre-flight request for DELETE 
router.get('/ValidaCnpjCpf/:id', cors(), clienteControllers.ValidaCnpjCpf)

router.options('/Incluir',  bodyParser.json(),cors()) // enable pre-flight request for DELETE 
router.post('/Incluir', cors(),clienteControllers.IncluirCliente)

router.options('/Alterar/:id', bodyParser.json(),cors())
router.put('/Alterar/:id', cors(), clienteControllers.AlterarCliente);

router.options('/Excluir/:id', bodyParser.json(),cors())
router.delete('/Excluir/:id', cors(), clienteControllers.ExcluirCliente);

router.options('/GetTelefonePorIdCliente/:id', cors()) // enable pre-flight request for DELETE 
router.get('/GetTelefonePorIdCliente/:id', cors(), clienteControllers.GetTelefonePorIdCliente)

module.exports = router;