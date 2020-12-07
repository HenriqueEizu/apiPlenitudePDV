const sql = require('mssql');
const config = require('../config');
// const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
 
exports.GetAllPedidos = (req,res) => {
    strSql : String;
    campo : String;
    criterio : String;
    strQuery : String;
    campo = [req.query.campo];
    criterio = [req.query.criterio];
    var data = [];

    console.log(campo + "jjjjj");

    strSql = "  SELECT  DISTINCT PD.Id_Ped, P.Nome,PD.DtPed, PD.Entrega, PD.Situacao, PD.DescrSituacao, PD.Tipo, PD.DescrTipo "
    strSql += " FROM    CapaVend PD "
    strSql += " JOIN    CLIENTE C ON C.Id_Cli = PD.Id_Cli "
    strSql += " JOIN	PESSOA P ON C.IDPESSOA = P.IDPESSOA "
    if (campo != ""){
        if (campo == "PD.Id_Ped")
            strSql += " WHERE   " + campo + " = " + criterio 
        else
            strSql += " WHERE   " + campo + " like  '%" + criterio + "%'"
    }
    else{
        strSql += " WHERE   1 = 2 "
    }
    
    console.log(strSql)
    sql.connect(config).then(pool => {
        return pool.request()
            .query(strSql)
    }).then(us => {
        console.log(us.rowsAffected);
        if (us.rowsAffected == 0){
            data.push({
                Id_Ped: null, 
                cliente: {
                    OBJ_PESSOA : {
                        Nome : null, 
                    },
                },
                DtPed : null,
                Entrega : null,
                Situacao : null,
                DescrSituacao : null,
                Tipo : null,
                DescrTipo : null,
            })
        }
        for (var i = 0; i < us.rowsAffected; i++) {
        // for (var i = 0; i < 1; i++) {
            data.push({
                Id_Ped: us.recordsets[0][i].Id_Ped,  
                cliente: {
                    OBJ_PESSOA : {
                        Nome : us.recordsets[0][i].Nome,   
                    },
                },
                DtPed : us.recordsets[0][i].DtPed,
                Entrega : us.recordsets[0][i].Entrega,
                Situacao : us.recordsets[0][i].NSituacaoome,
                DescrSituacao : us.recordsets[0][i].DescrSituacao,
                Tipo : us.recordsets[0][i].Tipo,
                DescrTipo : us.recordsets[0][i].DescrTipo,
            })
         }
        
        (res.status(200).send(data)
        // (res.status(200).send(us.recordsets[0])
            )
    }).catch(err => {
      // ... error checks
    });
}