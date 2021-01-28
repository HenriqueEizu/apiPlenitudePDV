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

exports.GetItensEstoque = (req,res) => {
    strSql : String;
    estoque : String;
    palavraChave : String;
    strQuery : String;
    estoque = [req.query.estoque];
    palavraChave = [req.query.palavraChave];
    var data = [];

    strSql = "  Sp_LojasPesquisaEstoque  " + estoque + ", '" + palavraChave + "' "
    console.log(strSql)
    sql.connect(config).then(pool => {
        return pool.request()
            .query(strSql)
    }).then(us => {
        console.log(us.recordset.length);
        if (us.recordset.length == 0){
            data.push({
                Id_Alp	: null,
                Produto	: null,
                Quantidade	: null,
                Preco	: null,
                Livre : null,
                Qtd: null,
                QtdPedido : null,
            })
        }
        for (var i = 0; i < us.recordset.length; i++) {
        // for (var i = 0; i < 1; i++) {
            data.push({
                Id_Alp	: us.recordsets[0][i].Id_Alp,
                Produto	: us.recordsets[0][i].Produto,
                Quantidade	: us.recordsets[0][i].Quantidade,
                Preco	: us.recordsets[0][i].Preco,
                Livre : us.recordsets[0][i].Livre,
                Qtd: us.recordsets[0][i].Qtd,
                QtdPedido : 0,
            })
         }
        
        (res.status(200).send(data)
        // (res.status(200).send(us.recordsets[0])
            )
    }).catch(err => {
      // ... error checks
    });
}


exports.GetAllMidia = (req,res) => {
    strSql : String;
    var data = [];

    console.log(campo + "jjjjj");

    strSql = "  SELECT  M.IdMidia, M.Descr "
    strSql += " FROM    Midia M "
    sql.connect(config).then(pool => {
        return pool.request()
            .query(strSql)
    }).then(us => {
        console.log(us.rowsAffected);
        if (us.rowsAffected == 0){
            data.push({
                IdMidia: null, 
                DescMidia : null,
            })
        }
        for (var i = 0; i < us.rowsAffected; i++) {
        // for (var i = 0; i < 1; i++) {
            data.push({
                IdMidia: us.recordsets[0][i].IdMidia,  
                DescMidia : us.recordsets[0][i].Descr,
            })
         }
        
        (res.status(200).send(data)
        // (res.status(200).send(us.recordsets[0])
            )
    }).catch(err => {
      // ... error checks
    });
}

exports.GetAllEstoques = (req,res) => {
    strSql : String;
    var data = [];

    console.log(campo + "jjjjj");

    strSql = "  SELECT  E.Id_Alm, E.Descr "
    strSql += " FROM    Almoxar E "
    sql.connect(config).then(pool => {
        return pool.request()
            .query(strSql)
    }).then(us => {
        console.log(us.rowsAffected);
        if (us.rowsAffected == 0){
            data.push({
                Id_Alm: null, 
                Descr : null,
            })
        }
        for (var i = 0; i < us.rowsAffected; i++) {
        // for (var i = 0; i < 1; i++) {
            data.push({
                Id_Alm: us.recordsets[0][i].Id_Alm,  
                Descr : us.recordsets[0][i].Descr,
            })
         }
        
        (res.status(200).send(data)
        // (res.status(200).send(us.recordsets[0])
            )
    }).catch(err => {
      // ... error checks
    });
}


exports.GetAllVendedores = (req,res) => {
    strSql : String;
    var data = [];

    strSql = "  SELECT DISTINCT IDVENDEDOR, NOME FROM VEND_PED ORDER BY NOME "
    sql.connect(config).then(pool => {
        return pool.request()
            .query(strSql)
    }).then(us => {
        console.log(us.rowsAffected);
        if (us.rowsAffected == 0){
            data.push({
                IdVendedor: null, 
                Nome : null,
            })
        }
        for (var i = 0; i < us.rowsAffected; i++) {
        // for (var i = 0; i < 1; i++) {
            data.push({
                IdVendedor: us.recordsets[0][i].IDVENDEDOR,  
                Nome : us.recordsets[0][i].NOME,
            })
         }
        
        (res.status(200).send(data)
        // (res.status(200).send(us.recordsets[0])
            )
    }).catch(err => {
      // ... error checks
    });
}

exports.InserirPedido = (req, res) => {
    strSql : String;
    var dataEntrega = new Date();
    dataEntrega.setDate(req.body.Entrega.day)
    dataEntrega.setFullYear(req.body.Entrega.year)
    dataEntrega.setMonth(Number(req.body.Entrega.month) -1 )
    console.log(dataEntrega);
    var data = [];
    console.log(req.body.Entrega.year);
    console.log("passou aqui cdddd")
    sql.connect(config).then(pool => {
        return pool.request()
        .output('Id_Ped', sql.Int)
        .input('Id_Cli', sql.Int, req.body.Id_Cli)
        .input('IdMidia', sql.Int, req.body.IdMidia)
        .input('IdEnderecoEntrega', sql.Int, req.body.IdEnderecoEntrega)
        .input('FlMesmoEndEntrega', sql.Bit, true)
        .input('Tipo', sql.Char(3), "P")
        .input('Entrega', sql.DateTime, dataEntrega)
        .input('Per_Ent', sql.Char(1), req.body.Per_Ent)
        .input('ListaVends', sql.VarChar(200), req.body.IdVendedor)
        .input('VlFrete', sql.Int, 0)
        .input('Desconto', sql.Int, 0)
        .input('ObsMidia', sql.VarChar(30), req.body.DescMidia)
        .input('Observ', sql.Text, req.body.Observ)
        .input('Obs_Fin', sql.Text, "")
        .input('IdFoneEntrega', sql.Int, 0)
        .input('DDDEntrega', sql.VarChar(4), "")
        .input('FoneEntrega', sql.VarChar(15), "")
        .input('RamalEntrega', sql.VarChar(5), "")
        .output('Ok', sql.VarChar(500))
        .output('MensErro', sql.VarChar(500))
        .execute('Sp_PedidoCapaGrava')
    }).then(pool => {
        console.log("aqui passou 22222");
        console.log(pool);
        res.status(200).send(pool.output);
        // res.status(200).send(us.recordsets[0]);
        //    )
    }).catch(err => {
        console.log(err);
    });
}

exports.GetIdPedido = (req,res) => {
    strSql : String;

    strSql = " SELECT  PD.*, "
    // strSql += " PD.Situacao, PD.DescrSituacao, PD.Entrega, PD.Per_Ent, "
    strSql += " P.Nome, M.Descr, VP.IdVendedor, VP.Nome as NomeVendedor, "
    // strSql += " IV.Produto, IV.Quantid, IV.Valuni, IV.Tp_Frete, "
    // strSql += " FP.FormaPag, FP.Tot_Parc, FP.Val_Fin, "
    // strSql += " IP.Num_Parc, IP.Document, IP.Dt_Venc, IP.Agencia, IP.Praca, IP.Agencia, IP.Num_Cheq, IP.Val_ARec, "
    strSql += " F.CodDdd, F.Numero, F.Ramal, "
    strSql += " E.CEP, E.UF, E.Localidade, E.Logradouro, E.Numero, E.Complemento,E.Bairro, E.PontoReferencia "

    strSql += " FROM    CapaVend PD "
    // strSql += " LEFT JOIN    ItemVend IV ON PD.Id_Ped = IV.Id_Ped "
    // strSql += " LEFT JOIN    Frm_Ped FP ON FP.Id_Ped = PD.Id_Ped "
    // strSql += " LEFT JOIN    ItemPag IP ON IP.Id_Frp = FP.Id_Frp "
    strSql += " LEFT JOIN    CLIENTE C ON C.Id_Cli = PD.Id_Cli "
    strSql += " LEFT JOIN	  PESSOA P ON C.IDPESSOA = P.IDPESSOA "
    strSql += " LEFT JOIN    PessoaEndereco PE ON PE.IdPessoa = P.IdPessoa "
    strSql += " LEFT JOIN    Endereco E ON E.IdEndereco = PE.IdEndereco "
    strSql += " LEFT JOIN	  (SELECT TOP 1 * FROM PessoaTelefone) T ON P.IdPessoa = T.IdPessoa "
    strSql += " LEFT JOIN	  Telefone F ON F.IdTelefone = T.IdTelefone "
    strSql += " LEFT JOIN    Midia M ON M.IdMidia = PD.IdMidia "
    strSql += " LEFT JOIN    Vend_Ped VP ON VP.Id_Ped = PD.Id_Ped "
    strSql += " WHERE   PD.Id_Ped =  " + [req.params.id]

console.log(strSql);
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
            return res.status(200).send(
                 {  
                    IdPedido: rows.recordsets[0][0].IdPedido,
                    Id_Ped	: rows.recordsets[0][0].Id_Ped,
                    Id_Cli	: rows.recordsets[0][0].Id_Cli,
                    // cliente	: Cliente,
                    vendedor : {
                        IdVendedor : rows.recordsets[0][0].IdVendedor,
                        Nome : rows.recordsets[0][0].NomeVendedor,
                    },
                    Id_Loja	: rows.recordsets[0][0].Id_Loja,
                    // loja	: Loja,
                    IdMidia	: rows.recordsets[0][0].IdMidia,
                    DescMidia : rows.recordsets[0][0].DescMidia,
                    // midia	: Midia,
                    FlMesmoEndEntrega	: rows.recordsets[0][0].FlMesmoEndEntrega,
                    IdEnderecoEntrega	: rows.recordsets[0][0].IdEnderecoEntrega,
                    endereco	: {
                        CEP : rows.recordsets[0][0].CEP,
                        UF  : rows.recordsets[0][0].UF,
                        Localidade : rows.recordsets[0][0].Localidade,
                        Logradouro : rows.recordsets[0][0].Logradouro,
                        Numero : rows.recordsets[0][0].Numero,
                        Complemento : rows.recordsets[0][0].Complemento,
                        Bairro : rows.recordsets[0][0].Bairro,
                        PontoReferencia : rows.recordsets[0][0].PontoReferencia,
                    },
                    IdFoneEntrega	: rows.recordsets[0][0].IdFoneEntrega,
                    telefone	: {
                        CodDdd : rows.recordsets[0][0].CodDdd,
                        Numero : rows.recordsets[0][0].Numero,
                        Ramal :  rows.recordsets[0][0].Ramal,
                    },
                    Situacao	: rows.recordsets[0][0].Situacao,
                    DescrSituacao	: rows.recordsets[0][0].DescrSituacao,
                    Tipo	: rows.recordsets[0][0].Tipo,
                    DescrTipo	: rows.recordsets[0][0].DescrTipo,
                    DtPed	: rows.recordsets[0][0].DtPed,
                    Entrega	: rows.recordsets[0][0].Entrega,
                    DtReceb	: rows.recordsets[0][0].DtReceb,
                    Per_Ent	: rows.recordsets[0][0].Per_Ent,
                    TotProd	: rows.recordsets[0][0].TotProd,
                    Desconto	: rows.recordsets[0][0].Desconto,
                    Desc_Por	: rows.recordsets[0][0].Desc_Por,
                    TotPed	: rows.recordsets[0][0].TotPed,
                    VlFrete	: rows.recordsets[0][0].VlFrete,
                    Val_Afin	: rows.recordsets[0][0].Val_Afin,
                    Entregue	: rows.recordsets[0][0].Entregue,
                    Cup_Fisc	: rows.recordsets[0][0].Cup_Fisc,
                    Tem_Frt	: rows.recordsets[0][0].Tem_Frt,
                    Encerrou	: rows.recordsets[0][0].Encerrou,
                    Enviado	: rows.recordsets[0][0].Enviado,
                    Nome_Cli	: rows.recordsets[0][0].Nome_Cli,
                    Versao	: rows.recordsets[0][0].Versao,
                    Codpdv	: rows.recordsets[0][0].Codpdv,
                    Impresso	: rows.recordsets[0][0].Impresso,
                    Env_Mail	: rows.recordsets[0][0].Env_Mail,
                    Id_PdOri	: rows.recordsets[0][0].Id_PdOri,
                    Bloq_Est	: rows.recordsets[0][0].Bloq_Est,
                    Prazo_Mp	: rows.recordsets[0][0].Prazo_Mp,
                    Desc_Max	: rows.recordsets[0][0].Desc_Max,
                    Nf_Pauli	: rows.recordsets[0][0].Nf_Pauli,
                    TemCupom	: rows.recordsets[0][0].TemCupom,
                    NumCupom	: rows.recordsets[0][0].NumCupom,
                    EnvCupom	: rows.recordsets[0][0].EnvCupom,
                    ObsMidia	: rows.recordsets[0][0].ObsMidia,
                    Observ	: rows.recordsets[0][0].Observ,
                    Obs_Fin	: rows.recordsets[0][0].Obs_Fin,
                }
            )
        });
    });
}




