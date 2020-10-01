const mysql = require('mssql');
const config = require('../config');
// const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
 
exports.GetAllUsuarios = (req,res) => {
    return res.status(200).send("hELLO wORLD");
}
