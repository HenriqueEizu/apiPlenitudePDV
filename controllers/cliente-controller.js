const sql = require('mssql');
const config = require('../config');
// const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
 
exports.GetAllClientes = (req,res) => {
    strSql : String;
    campo : String;
    criterio : String;
    strQuery : String;
    campo = [req.query.campo];
    criterio = [req.query.criterio];
    var data = [];

    console.log(campo + "jjjjj");

    strSql = "  SELECT  C.ID_CLI, P.NOME, P.CNPJCPF, P.IESTRG, P.INDFISJUR "
    strSql += " FROM	CLIENTE C "
    strSql += " JOIN	PESSOA P ON C.IDPESSOA = P.IDPESSOA "
    if (campo != ""){
        if (campo == "C.ID_CLI")
            strSql += " WHERE   " + campo + " = " + criterio 
        else
            strSql += " WHERE   " + campo + " like  '%" + criterio + "%'"
    }
    else{
        strSql += " WHERE   1 = 2 "
    }
    
    console.log(strSql)
    sql.connect(config).then(pool => {
        // Query
        
        return pool.request()
            // .input('input_parameter', sql.Int, value)
            // .query('select * from mytable where id = @input_parameter')
            .query(strSql)
    }).then(us => {
        console.log(us.rowsAffected);
        if (us.rowsAffected == 0){
            data.push({
                Id_Cli: null, 
                rows: us.rowsAffected,
                OBJ_PESSOA : {
                    Nome : null, 
                    CnpjCpf :null, 
                    IEstRG : null, 
                    IndFisJur : null, 
                },
            })
        }
        for (var i = 0; i < us.rowsAffected; i++) {
        // for (var i = 0; i < 1; i++) {
            data.push({
                Id_Cli: us.recordsets[0][i].ID_CLI, 
                rows: us.rowsAffected,
                OBJ_PESSOA : {
                    Nome : us.recordsets[0][i].NOME, 
                    CnpjCpf : us.recordsets[0][i].CNPJCPF, 
                    IEstRG : us.recordsets[0][i].IESTRG, 
                    IndFisJur : us.recordsets[0][i].INDFISJUR, 
                },
            });
         }
        
        (res.status(200).send(data)
        // (res.status(200).send(us.recordsets[0])
            )
    }).catch(err => {
      // ... error checks
    });
}

exports.GetClienteCPF = (req,res) => {
    strSql : String;
    campo : String;
    criterio : String;
    strQuery : String;
    var data = [];

    strSql = "  SELECT  C.ID_CLI, P.NOME, P.CNPJCPF, P.IESTRG, P.INDFISJUR , PE.IdEndereco, PE.IndTipoEndereco "
    strSql += " FROM	CLIENTE C "
    strSql += " JOIN	PESSOA P ON C.IDPESSOA = P.IDPESSOA "
    strSql += " JOIN    PessoaEndereco PE ON PE.IdPessoa = P.IdPessoa "
    strSql += " WHERE   P.CNPJCPF = '" + [req.params.id]  + "'"
    console.log(strSql)
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query(strSql, function (err, rows) {
            if (err) {return res.status(500).send({ error: err})}
            if (rows.rowsAffected < 1){ 
                return res.status(200).send({ 
                    cliente : null,
                    })
            }
            if (err) { return res.status(401).send({ mensagem: 'Falha na autenticação 2'})}
            return res.status(200).send(
                 {  
                     cliente: {
                        Id_Cli : rows.recordsets[0][0].ID_CLI,
                        Nome : rows.recordsets[0][0].NOME,
                        cpf :  rows.recordsets[0][0].CNPJCPF,
                        IdEndereco : rows.recordsets[0][0].IdEndereco,
                        tipoEndereco : rows.recordsets[0][0].IndTipoEndereco,
                        }
                }
            )
        });
    });
    
}




exports.GetIdCliente = (req,res) => {
    strSql : String;

strSql = " SELECT P.CNPJCPF, P.IESTRG, P.INDFISJUR , c.Id_Cli "
strSql += " ,p.IdPessoa, p.Nome,p.Apelido,p.OrgEmisRg, p.EstCivil "
strSql += " ,p.DtNascimento, c.ProfProfissao, p.DhIns "
strSql += " ,PE.IdPessoaEndereco, E.IdEndereco ,E.CEP, E.UF, E.LOCALIDADE,E.LOGRADOURO "
strSql += " ,E.NUMERO, E.COMPLEMENTO, E.BAIRRO "
strSql += " ,p.EMail,c.Contato "
// strSql += " ,f.CodDdd ,f.Numero, f.Ramal "
strSql += " FROM	CLIENTE C "
strSql += " JOIN	PESSOA P ON C.IDPESSOA = P.IDPESSOA "
strSql += " JOIN  PessoaEndereco PE ON PE.IdPessoa = P.IdPessoa "
strSql += " JOIN  Endereco E ON E.IdEndereco = PE.IdEndereco "
// strSql += " JOIN	PessoaTelefone T ON P.IdPessoa = T.IdPessoa "
// strSql += " JOIN	Telefone F ON F.IdTelefone = T.IdTelefone "
strSql += " WHERE   c.Id_Cli = " + [req.params.id]

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
                    Id_Cli : rows.recordsets[0][0].Id_Cli,
                    ProfProfissao : rows.recordsets[0][0].ProfProfissao,
                    Contato : rows.recordsets[0][0].Contato,
                    OBJ_PESSOA : {
                        CnpjCpf : rows.recordsets[0][0].CNPJCPF,
                        IEstRG : rows.recordsets[0][0].IESTRG,
                        IndFisJur :rows.recordsets[0][0].INDFISJUR,
                        IdPessoa : rows.recordsets[0][0].IdPessoa,
                        Nome : rows.recordsets[0][0].Nome,
                        Apelido : rows.recordsets[0][0].Apelido,
                        OrgEmisRg : rows.recordsets[0][0].OrgEmisRg,
                        EstCivil : rows.recordsets[0][0].EstCivil,
                        DtNascimento : rows.recordsets[0][0].DtNascimento,
                        DhIns : rows.recordsets[0][0].DhIns,
                        IdPessoaEndereco : rows.recordsets[0][0].IdPessoaEndereco,
                        IdEndereco : rows.recordsets[0][0].IdEndereco,
                        EMail : rows.recordsets[0][0].EMail,
                        OBJ_ENDERECO : {
                            CEP : rows.recordsets[0][0].CEP,
                            UF : rows.recordsets[0][0].UF,
                            Localidade : rows.recordsets[0][0].LOCALIDADE,
                            Logradouro : rows.recordsets[0][0].LOGRADOURO,
                            Numero : rows.recordsets[0][0].NUMERO,
                            Complemento : rows.recordsets[0][0].COMPLEMENTO,
                            Bairro : rows.recordsets[0][0].BAIRRO,
                        }
                    },
                }
            )
        });
    });
}

exports.GetContatoCliente = (req,res) => {
    strSql : String;
    var data = [];

    strSql += " SELECT  F.IdTelefone, F.CodDdi, F.CodDdd, F.Numero, F.Ramal, F.IndTipoFone "
    strSql += " FROM	CLIENTE C "
    strSql += " JOIN	PESSOA P ON C.IDPESSOA = P.IDPESSOA "
    strSql += " JOIN	PessoaTelefone T ON P.IdPessoa = T.IdPessoa "
    strSql += " JOIN	Telefone F ON F.IdTelefone = T.IdTelefone "
    strSql += " WHERE   c.Id_Cli = " + [req.params.id]

    sql.connect(config).then(pool => {
        // Query
        
        return pool.request()
            // .input('input_parameter', sql.Int, value)
            // .query('select * from mytable where id = @input_parameter')
            .query(strSql)
    }).then(us => {
        console.log(us.rowsAffected);
        for (var i = 0; i < us.rowsAffected; i++) {
            data.push({
                IdTelefone	: us.recordsets[0][i].IdTelefone, 
                CodDdi	: us.recordsets[0][i].CodDdi, 
                CodDdd	: us.recordsets[0][i].CodDdd, 
                Numero	: us.recordsets[0][i].Numero, 
                Ramal	: us.recordsets[0][i].Ramal, 
                IndTipoFone	: us.recordsets[0][i].IndTipoFone, 
            });
        }
        (res.status(200).send(data))
    }).catch(err => {
    // ... error checks
    });
}

exports.ValidaCnpjCpf = (req,res) => {
    strSql : String;
    var data = [];

    strSql = "select dbo.Fn_ValidaCnpjCpf('" +  [req.params.id] + "') as cpfNotValid ";

    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query(strSql, function (err, rows) {
            if (err) {return res.status(500).send({ error: err})}
            if (rows.rowsAffected < 1){ 
                return res.status(401).send({ 
                    cpfNotValid : null,
                    })
            }
            if (err) { return res.status(401).send({ mensagem: 'Falha na autenticação 2'})}
            return res.status(200).send(
                 {  
                     cpf: {
                        cpfValid : rows.recordsets[0][0].cpfNotValid,
                     }
                    
                }
            )
        });
    });
}

exports.ConsultaCEP = (req,res) => {
    strSql : String;
    var data = [];

    strSql = "exec Sp_CepDados '" +  [req.params.id] + "'";

    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query(strSql, function (err, rows) {
            if (err) {return res.status(500).send({ error: err})}
            if (rows.rowsAffected < 1){ 
                return res.status(401).send({ 
                    UF : null,
                    Localidade : null,
                    Logradouro : null,
                    Bairro : null,})
            }
            if (err) { return res.status(401).send({ mensagem: 'Falha na autenticação 2'})}
            return res.status(200).send(
                 {  
                    UF : rows.recordsets[0][0].Uf,
                    Localidade : rows.recordsets[0][0].Localidade,
                    Logradouro :rows.recordsets[0][0].Logradouro,
                    Bairro : rows.recordsets[0][0].Bairro,
                }
            )
        });
    });
}

exports.GetAllEstados = (req,res) => {
    strSql : String;
    var data = [];

    strSql = "  select UF, Estado from tab_uf"

    sql.connect(config).then(pool => {
        // Query
        
        return pool.request()
            // .input('input_parameter', sql.Int, value)
            // .query('select * from mytable where id = @input_parameter')
            .query(strSql)
    }).then(us => {
        console.log(us.rowsAffected);
        for (var i = 0; i < us.rowsAffected; i++) {
        // for (var i = 0; i < 1; i++) {
            data.push({
                UF : us.recordsets[0][i].UF, 
                Estado : us.recordsets[0][i].Estado, 
            });
         }
        
        (res.status(200).send(data)
        // (res.status(200).send(us.recordsets[0])
            )
    }).catch(err => {
      // ... error checks
    });
}

exports.GetTelefonePorIdCliente = (req,res) => {
    strSql : String;
    var data = [];

    strSql = " SELECT  F.IdTelefone, F.CodDdd as DDD ,F.Numero, F.Ramal, F.IndTipoFone"
    strSql += " FROM	CLIENTE C "
    strSql += " JOIN	PESSOA P ON C.IDPESSOA = P.IDPESSOA "
    strSql += " JOIN    PessoaEndereco PE ON PE.IdPessoa = P.IdPessoa "
    strSql += " JOIN    Endereco E ON E.IdEndereco = PE.IdEndereco "
    strSql += " JOIN	PessoaTelefone T ON P.IdPessoa = T.IdPessoa "
    strSql += " JOIN	Telefone F ON F.IdTelefone = T.IdTelefone "
    strSql += " WHERE   c.Id_Cli = " + [req.params.id]

    sql.connect(config).then(pool => {
        // Query
        console.log()
        return pool.request()
            .query(strSql)
    }).then(us => {
        console.log("passou aqui telefone");
        for (var i = 0; i < us.rowsAffected; i++) {
            data.push({
                IdTelefone : us.recordsets[0][i].IdTelefone,
                DDD : us.recordsets[0][i].DDD, 
                Numero : us.recordsets[0][i].Numero, 
                Ramal : us.recordsets[0][i].Ramal,
                IndTipoFone : us.recordsets[0][i].IndTipoFone,
            });
         }
         console.log(data);
        (res.status(200).send(data)
            )
    }).catch(err => {
      // ... error checks
    });
}

exports.IncluirCliente = (req, res) => {
    var d = new Date();
    idPessoa : Number;
    // i : Number;
    strSql : String;
    idPessoa = 0;
    var data = [];
    console.log(req.body.Id_Cli);
    sql.connect(config).then(pool => {
        return pool.request()
        .input('Id_Cli', sql.Int, req.body.Id_Cli)
        .input('IdPessoa', sql.Int, req.body.OBJ_PESSOA.IdPessoa)
        .input('IndFisJur', sql.VarChar(500), req.body.OBJ_PESSOA.IndFisJur)
        .input('Nome', sql.VarChar(500), req.body.OBJ_PESSOA.Nome)
        .input('Apelido', sql.VarChar(500), req.body.OBJ_PESSOA.Apelido)
        .input('CnpjCpf', sql.VarChar(500), req.body.OBJ_PESSOA.CnpjCpf)
        .input('IEstRG', sql.VarChar(500), req.body.OBJ_PESSOA.IEstRG)
        .input('OrgEmisRg', sql.VarChar(500), req.body.OBJ_PESSOA.OrgEmisRg)
        .input('DtEmisRg', sql.DateTime, req.body.OBJ_PESSOA.DtEmisRg)
        .input('DtNascimento', sql.DateTime, req.body.OBJ_PESSOA.DtNascimento)
        .input('EstCivil', sql.VarChar(500), req.body.OBJ_PESSOA.EstCivil)
        .input('EMail', sql.VarChar(500), req.body.OBJ_PESSOA.EMail)
        .input('HomePage', sql.VarChar(500), req.body.OBJ_PESSOA.HomePage)
        .input('Natural', sql.VarChar(500), req.body.OBJ_PESSOA.Natural)

        .input('Contato', sql.VarChar(500), req.body.Contato)
        .input('ProfEmpresa', sql.VarChar(500), req.body.ProfEmpresa)
        .input('ProfCargo', sql.VarChar(500), req.body.ProfCargo)
        .input('ProfProfissao', sql.VarChar(500), req.body.ProfProfissao)
        .input('ProfSalario', sql.Numeric, req.body.ProfSalario)
        .input('ProfDtAdmissao', sql.DateTime, req.body.ProfDtAdmissao)
        .input('BanCodBanco', sql.VarChar(500), req.body.BanCodBanco)
        .input('BanNomeBanco', sql.VarChar(500), req.body.BanNomeBanco)
        .input('BanDtInicioBanco', sql.DateTime, req.body.BanDtInicioBanco)
        .input('BanAgencia', sql.VarChar(500), req.body.BanAgencia)
        .input('BanNumConta', sql.VarChar(500), req.body.BanNumConta)
        .input('BanChequeEspecial', sql.Bit, req.body.BanChequeEspecial)
        .input('IdUsuario', sql.Int, req.body.IdUsuario)
        // .input('UsrUpd', sql.Date,d)
        .output('Ok', sql.VarChar(500))
        .output('MensErro', sql.VarChar(500))
        .execute('Sp_ClienteGrava')
    }).then(pool => {
        console.log("aqui passou 22222")
        // console.log(pool)
        pool.close;
        // (res.status(200).send())
        // (res.status(200).send(us.recordsets[0])
        //    )
    }).catch(err => {
        pool.close;
        console.log(err);
    });

    //*******************
    strSql = "SELECT MAX(IdPessoa) as IdPessoa from CLIENTE "

    console.log("cobsulta idPessoa");

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
            idPessoa = rows.recordsets[0][0].IdPessoa
            console.log("idPessoa: " )
            console.log(idPessoa)
        });
    });
    
    //*/

    // if (idPessoa > 0)
    // {
        sql.connect(config).then(pool => {
            console.log("passou aqui 1")
            console.log(req.body);
            return pool.request()
            .input('IdPessoaEndereco', sql.Int, req.body.IdPessoaEndereco)
            .input('IdPessoa', sql.Int, idPessoa)
            .input('IdEndereco', sql.Int, req.body.IdEndereco)
            .input('IndTipoEndereco', sql.VarChar(5), req.body.OBJ_PESSOA.OBJ_ENDERECO.IndTipoEndereco)
            .input('Logradouro', sql.VarChar(60), req.body.OBJ_PESSOA.OBJ_ENDERECO.Logradouro)
            .input('Numero', sql.VarChar(8), req.body.OBJ_PESSOA.OBJ_ENDERECO.Numero)
            .input('Complemento', sql.VarChar(20), req.body.OBJ_PESSOA.OBJ_ENDERECO.Complemento)
            .input('Bairro', sql.VarChar(35), req.body.OBJ_PESSOA.OBJ_ENDERECO.Bairro)
            .input('Localidade', sql.VarChar(60), req.body.OBJ_PESSOA.OBJ_ENDERECO.Localidade)
            .input('CodMuni', sql.VarChar(7), req.body.OBJ_PESSOA.OBJ_ENDERECO.CodMuni)
            .input('UF', sql.VarChar(2), req.body.OBJ_PESSOA.OBJ_ENDERECO.UF)
            .input('CEP', sql.VarChar(8), req.body.OBJ_PESSOA.OBJ_ENDERECO.CEP)
            .input('CodPais', sql.VarChar(4), req.body.OBJ_PESSOA.OBJ_ENDERECO.CodPais)
            .input('PontoReferencia', sql.VarChar(100), req.body.OBJ_PESSOA.OBJ_ENDERECO.PontoReferencia)
            .output('Ok', sql.VarChar(500))
            .output('MensErro', sql.VarChar(500))
            .execute('Sp_PessoaEnderecoGrava')
        }).then(pool => {
            console.log(pool)
            res.status(200).send()
            pool.close;
                
        }).catch(err => {
            console.log(err);
        });
    // }
    //grava TELEFONES
    

    // for(i = 0; i<= req.body.OBJ_PESSOA.lstTelefone.length -1; i++){

    //     // console.log(req.body.OBJ_PESSOA.lstTelefone[0]["IdTelefone"]);
    //     console.log("passou aqui 2 telefone");
    //     console.log(req.body.OBJ_PESSOA.lstTelefone[i].IdTelefone);

    //     sql.connect(config).then(pool => {
    //         console.log("passou aqui 2")
    //         console.log(req.body.OBJ_PESSOA.lstTelefone[0].IdTelefone);
    //         return pool.request()
    //         .input('IdPessoa', sql.Int, req.body.OBJ_PESSOA.IdPessoa)
    //         .input('IdTelefone', sql.Int, req.body.OBJ_PESSOA.lstTelefone[0].IdTelefone)
    //         .input('Sequencia', sql.Int, i + 1)
    //         // .input('CodDdi', sql.VarChar(4), req.body.OBJ_PESSOA.lstTelefone["CodDdi"])
    //         .input('CodDdd', sql.VarChar(4), req.body.OBJ_PESSOA.lstTelefone[0].DDD)
    //         .input('Numero', sql.VarChar(6), req.body.OBJ_PESSOA.lstTelefone[0].Numero)
    //         .input('Ramal', sql.VarChar(6), req.body.OBJ_PESSOA.lstTelefone[0].Ramal)
    //         .input('IndTipoFone', sql.VarChar(2), req.body.OBJ_PESSOA.lstTelefone[0].IndTipoFone)
    //         .input('IndUsoFone', sql.VarChar(2), "P")
    //         .output('Ok', sql.VarChar(500))
    //         .output('MensErro', sql.VarChar(500))
    //         .execute('Sp_PessoaTelefoneGrava')
    //     }).then(pool => {
    //         console.log(pool)
    //         res.status(200).send()
    //         pool.close;
                
    //     }).catch(err => {
    //         // pool.close;
    //         console.log(err);
    //     });
    // }
}

exports.AlterarCliente_OBSOLETO = (req,res) => {

    var d = new Date();
    strSql : String;
    var data = [];
    console.log(req.body.OBJ_PESSOA.OBJ_ENDERECO);
    sql.connect(config).then(pool => {
        return pool.request()
        .input('Id_Cli', sql.Int, req.body.Id_Cli)
        .input('IdPessoa', sql.Int, req.body.OBJ_PESSOA.IdPessoa)
        .input('IndFisJur', sql.VarChar(500), req.body.OBJ_PESSOA.IndFisJur)
        .input('Nome', sql.VarChar(500), req.body.OBJ_PESSOA.Nome)
        .input('Apelido', sql.VarChar(500), req.body.OBJ_PESSOA.Apelido)
        .input('CnpjCpf', sql.VarChar(500), req.body.OBJ_PESSOA.CnpjCpf)
        .input('IEstRG', sql.VarChar(500), req.body.OBJ_PESSOA.IEstRG)
        .input('OrgEmisRg', sql.VarChar(500), req.body.OBJ_PESSOA.OrgEmisRg)
        .input('DtEmisRg', sql.DateTime, req.body.OBJ_PESSOA.DtEmisRg)
        .input('DtNascimento', sql.DateTime, req.body.OBJ_PESSOA.DtNascimento)
        .input('EstCivil', sql.VarChar(500), req.body.OBJ_PESSOA.EstCivil)
        .input('EMail', sql.VarChar(500), req.body.OBJ_PESSOA.EMail)
        .input('HomePage', sql.VarChar(500), req.body.OBJ_PESSOA.HomePage)
        .input('Natural', sql.VarChar(500), req.body.OBJ_PESSOA.Natural)

        .input('Contato', sql.VarChar(500), req.body.Contato)
        .input('ProfEmpresa', sql.VarChar(500), req.body.ProfEmpresa)
        .input('ProfCargo', sql.VarChar(500), req.body.ProfCargo)
        .input('ProfProfissao', sql.VarChar(500), req.body.ProfProfissao)
        .input('ProfSalario', sql.Numeric, req.body.ProfSalario)
        .input('ProfDtAdmissao', sql.DateTime, req.body.ProfDtAdmissao)
        .input('BanCodBanco', sql.VarChar(500), req.body.BanCodBanco)
        .input('BanNomeBanco', sql.VarChar(500), req.body.BanNomeBanco)
        .input('BanDtInicioBanco', sql.DateTime, req.body.BanDtInicioBanco)
        .input('BanAgencia', sql.VarChar(500), req.body.BanAgencia)
        .input('BanNumConta', sql.VarChar(500), req.body.BanNumConta)
        .input('BanChequeEspecial', sql.Bit, req.body.BanChequeEspecial)
        .input('IdUsuario', sql.Int, req.body.IdUsuario)
        // .input('UsrUpd', sql.Date,d)
        .output('Ok', sql.VarChar(500))
        .output('MensErro', sql.VarChar(500))
        .execute('Sp_ClienteGrava')
    }).then(pool => {
        (res.status(200).send()
        // (res.status(200).send(us.recordsets[0])
            )
    }).catch(err => {
        console.log(err);
    });
}

exports.AlterarCliente = (req,res) => {

    var d = new Date();
    // i : Number;
    strSql : String;
    var data = [];
    console.log(req.body.OBJ_PESSOA.OBJ_ENDERECO);
    sql.connect(config).then(pool => {
        return pool.request()
        .input('Id_Cli', sql.Int, req.body.Id_Cli)
        .input('IdPessoa', sql.Int, req.body.OBJ_PESSOA.IdPessoa)
        .input('IndFisJur', sql.VarChar(500), req.body.OBJ_PESSOA.IndFisJur)
        .input('Nome', sql.VarChar(500), req.body.OBJ_PESSOA.Nome)
        .input('Apelido', sql.VarChar(500), req.body.OBJ_PESSOA.Apelido)
        .input('CnpjCpf', sql.VarChar(500), req.body.OBJ_PESSOA.CnpjCpf)
        .input('IEstRG', sql.VarChar(500), req.body.OBJ_PESSOA.IEstRG)
        .input('OrgEmisRg', sql.VarChar(500), req.body.OBJ_PESSOA.OrgEmisRg)
        .input('DtEmisRg', sql.DateTime, req.body.OBJ_PESSOA.DtEmisRg)
        .input('DtNascimento', sql.DateTime, req.body.OBJ_PESSOA.DtNascimento)
        .input('EstCivil', sql.VarChar(500), req.body.OBJ_PESSOA.EstCivil)
        .input('EMail', sql.VarChar(500), req.body.OBJ_PESSOA.EMail)
        .input('HomePage', sql.VarChar(500), req.body.OBJ_PESSOA.HomePage)
        .input('Natural', sql.VarChar(500), req.body.OBJ_PESSOA.Natural)

        .input('Contato', sql.VarChar(500), req.body.Contato)
        .input('ProfEmpresa', sql.VarChar(500), req.body.ProfEmpresa)
        .input('ProfCargo', sql.VarChar(500), req.body.ProfCargo)
        .input('ProfProfissao', sql.VarChar(500), req.body.ProfProfissao)
        .input('ProfSalario', sql.Numeric, req.body.ProfSalario)
        .input('ProfDtAdmissao', sql.DateTime, req.body.ProfDtAdmissao)
        .input('BanCodBanco', sql.VarChar(500), req.body.BanCodBanco)
        .input('BanNomeBanco', sql.VarChar(500), req.body.BanNomeBanco)
        .input('BanDtInicioBanco', sql.DateTime, req.body.BanDtInicioBanco)
        .input('BanAgencia', sql.VarChar(500), req.body.BanAgencia)
        .input('BanNumConta', sql.VarChar(500), req.body.BanNumConta)
        .input('BanChequeEspecial', sql.Bit, req.body.BanChequeEspecial)
        .input('IdUsuario', sql.Int, req.body.IdUsuario)
        // .input('UsrUpd', sql.Date,d)
        .output('Ok', sql.VarChar(500))
        .output('MensErro', sql.VarChar(500))
        .execute('Sp_ClienteGrava')
    }).then(pool => {
        pool.close;
        //(res.status(200).send()
        // (res.status(200).send(us.recordsets[0])
        //    )
    }).catch(err => {
        pool.close;
        console.log(err);
    });

    sql.connect(config).then(pool => {
        console.log("passou aqui 1")
        console.log(req.body);
        return pool.request()
        .input('IdPessoaEndereco', sql.Int, req.body.IdPessoaEndereco)
        .input('IdPessoa', sql.Int, req.body.IdPessoa)
        .input('IdEndereco', sql.Int, req.body.IdEndereco)
        .input('IndTipoEndereco', sql.VarChar(5), req.body.OBJ_PESSOA.OBJ_ENDERECO.IndTipoEndereco)
        .input('Logradouro', sql.VarChar(60), req.body.OBJ_PESSOA.OBJ_ENDERECO.Logradouro)
        .input('Numero', sql.VarChar(8), req.body.OBJ_PESSOA.OBJ_ENDERECO.Numero)
        .input('Complemento', sql.VarChar(20), req.body.OBJ_PESSOA.OBJ_ENDERECO.Complemento)
        .input('Bairro', sql.VarChar(35), req.body.OBJ_PESSOA.OBJ_ENDERECO.Bairro)
        .input('Localidade', sql.VarChar(60), req.body.OBJ_PESSOA.OBJ_ENDERECO.Localidade)
        .input('CodMuni', sql.VarChar(7), req.body.OBJ_PESSOA.OBJ_ENDERECO.CodMuni)
        .input('UF', sql.VarChar(2), req.body.OBJ_PESSOA.OBJ_ENDERECO.UF)
        .input('CEP', sql.VarChar(8), req.body.OBJ_PESSOA.OBJ_ENDERECO.CEP)
        .input('CodPais', sql.VarChar(4), req.body.OBJ_PESSOA.OBJ_ENDERECO.CodPais)
        .input('PontoReferencia', sql.VarChar(100), req.body.OBJ_PESSOA.OBJ_ENDERECO.PontoReferencia)
        .output('Ok', sql.VarChar(500))
        .output('MensErro', sql.VarChar(500))
        .execute('Sp_PessoaEnderecoGrava')
    }).then(pool => {
        console.log(pool)
        // res.status(200).send()
        pool.close;
            
    }).catch(err => {
        pool.close;
        console.log(err);
    });

    //grava TELEFONES
    

    for(i = 0; i<= req.body.OBJ_PESSOA.lstTelefone.length -1; i++){


        // console.log(req.body.OBJ_PESSOA.lstTelefone[0]["IdTelefone"]);
        console.log("passou aqui 2 telefone");
        console.log(req.body.OBJ_PESSOA.lstTelefone[i].IdTelefone);

        sql.connect(config).then(pool => {
            console.log("passou aqui 2")
            console.log(req.body.OBJ_PESSOA.lstTelefone[0].IdTelefone);

            return pool.request()
            .input('IdPessoa', sql.Int, req.body.OBJ_PESSOA.IdPessoa)
            .input('IdTelefone', sql.Int, req.body.OBJ_PESSOA.lstTelefone[0].IdTelefone.length > 10 ? null : req.body.OBJ_PESSOA.lstTelefone[0].IdTelefone)
            .input('Sequencia', sql.Int, i + 1)
            // .input('CodDdi', sql.VarChar(4), req.body.OBJ_PESSOA.lstTelefone["CodDdi"])
            .input('CodDdd', sql.VarChar(4), req.body.OBJ_PESSOA.lstTelefone[0].DDD)
            .input('Numero', sql.VarChar(6), req.body.OBJ_PESSOA.lstTelefone[0].Numero)
            .input('Ramal', sql.VarChar(6), req.body.OBJ_PESSOA.lstTelefone[0].Ramal)
            .input('IndTipoFone', sql.VarChar(2), req.body.OBJ_PESSOA.lstTelefone[0].IndTipoFone)
            .input('IndUsoFone', sql.VarChar(2), "P")
            .output('Ok', sql.VarChar(500))
            .output('MensErro', sql.VarChar(500))
            .execute('Sp_PessoaTelefoneGrava')
        }).then(pool => {
            console.log(pool)
            res.status(200).send()
            pool.close;
                
        }).catch(err => {
            // pool.close;
            console.log(err);
        });
    }
}

exports.ExcluirCliente = (req, res) => {
    var d = new Date();
    idPessoa : Number;
    // i : Number;
    strSql : String;
    idPessoa = 0;
    var data = [];
    console.log(req.body.Id_Cli);
    strSql = "DELETE FROM CLIENTE WHERE  Id_Cli = " + req.params.id

    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query(strSql, function (err, rows) {
            if (err) {return res.status(500).send({ error: err})}
            if (rows.length < 1){ return res.status(401).send({ mensagem: 'Falha na autenticação 1'})}
            if (err) { return res.status(401).send({ mensagem: 'Falha na autenticação 2'})}
            // return res.send(rows.recordsets[0][0])
            return res.status(200).send();
        });
    });
}
