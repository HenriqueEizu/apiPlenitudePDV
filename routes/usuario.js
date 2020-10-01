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
const usuariosControllers = require('../controllers/usuario-controller');


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.options('/', cors()) // enable pre-flight request for DELETE 
router.get('/', cors(), usuariosControllers.GetAllUsuarios)

module.exports = router;