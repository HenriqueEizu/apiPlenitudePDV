const sql = require('mssql');
const config = require('../config');
// const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
 
exports.GetAllUsuarios = (req,res) => {
    return res.status(200).send("hELLO wORLD");
}

exports.Login = (req,res) => {
    strSql : String;
    
    strSql = "SELECT * FROM USUARIO WHERE Login = '" + req.body.Login + "' AND Senha = '" +  req.body.Senha + "'"

    sql.connect(config, function (err) {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        request.query(strSql, function (err, rows) {

            if (err) {return res.status(500).send({ error: err})}
            if (rows.length < 1){ return res.status(401).send({ mensagem: 'Falha na autenticação 1'})}
            if (err) { return res.status(401).send({ mensagem: 'Falha na autenticação 2'})}
            // return res.send(rows.recordsets[0][0])
            return res.status(200).send({
                usuario: { Id_Usr : rows.recordsets[0][0].Id_Usr,
                            Login : rows.recordsets[0][0].Login,
                            Usuario :rows.recordsets[0][0].Usuario,
                            FlAtivo : rows.recordsets[0][0].FlAtivo,
                            DtVencSenha : rows.recordsets[0][0].DtVencSenha,
                            IdEMail : rows.recordsets[0][0].IdEMail,
                }
            })
        });
    });
}


