const { json } = require("express");
const db = require("../database/connection");
var fs = require('fs');
const { log } = require("console");
const { waitForDebugger } = require("inspector");




module.exports = {

    //LOGIN
    async login(request, response) {
        try {
            const { usuEmail, usuSenha } = request.body;
            const values = [usuEmail, usuSenha /*STATUS ATIVO*/];
            //SELECT DE LOGIN  QUE VERIFICA SE O USUARIO 
            const sql = 'SELECT usu.id_usuario,empUsu.id_empresa, usu.usu_nome, usu.usu_email, usu.usu_senha, usu.usu_telefone, usu.id_setor,usu.usu_status , empUsu.usu_tipo , emp.nome_empresa , str.nome_setor FROM TBUsuario usu INNER JOIN TBEmpresasUsuarios empUsu ON empUsu.id_usuario = usu.id_usuario INNER JOIN tbempresa emp ON empUsu.id_empresa = emp.id_empresa INNER JOIN tbsetor str on str.id_setor = usu.id_setor WHERE usu.usu_email = ? AND usu.usu_senha = ?';

            //EXECUTA QUERRY
            const Retorno = await db.query(sql, values);

            //SE TIVE RETORNO 
            if (Retorno[0].length) {
                //PEGA OS DADOS DO USUARIO
                const user = {
                    
                    "usu": Retorno[0][0].id_usuario,
                    "emp": Retorno[0][0].id_empresa,
                    "setor": Retorno[0][0].id_setor,
                    "nomeSetor": Retorno[0][0].nome_setor,
                    "nome": Retorno[0][0].usu_nome,
                    "email": Retorno[0][0].usu_email,
                    "telefone": Retorno[0][0].usu_telefone,
                    "status": Retorno[0][0].usu_status,
                    "tipo": Retorno[0][0].usu_tipo,
                    "nomeEmpresa": Retorno[0][0].nome_empresa
                }

                //RETORNA OS DADOS
                return response.status(200).json({ confirma: true, message: user });

                //RETORNA ERRO
            } else {
                return response.status(200).json({ confirma: false, message: 'Usuário ou Senha Invalido ou Usuário Inativado' });
            }

            //RETORNA ERRO
        } catch (error) {
            return response.status(500).json({ confirma: 'Erro', message: error });
        }
    },

    //CADASTRO USUARIO ADM
    async cadastro(request, response) {
        try {
            const { usuEmail, usuSenha, usuNome, empNome, empTelefone } = request.body;

            //VERIFICA SE O EMAIL JA NAO ESTA CADASTRADO
            const sqlEmail = "SELECT EXISTS(SELECT 1 FROM TBUsuario WHERE usu_email = ?) AS emailExistente";
            const RetornoEmail = await db.query(sqlEmail, usuEmail);

            //RETORNA FALSE CASO EMAIL JA ESTEJA CADASTRADO
            if (RetornoEmail[0][0].emailExistente === 1) {
                return response.status(201).json({ confirma: false, message: "Email" })

                //SENAO INICIAS INSERT
            } else {
                //CRIA EMPRESA
                //INSERT TABALA EMPRESA
                const sqlE = 'INSERT INTO tbempresa(nome_empresa,telefone_empresa)VALUES(?,?);'
                const valueE = [empNome, empTelefone]
                const RetornoE = await db.query(sqlE, valueE);
                const idE = RetornoE[0].insertId;

                //INSERT TABELA SETOR
                const sqlS = 'INSERT INTO tbsetor(nome_setor , id_empresa) VALUES(?,?)';
                const valuesS = ['Administrador', idE];
                const RetornoS = await db.query(sqlS, valuesS);
                const idS = RetornoS[0].insertId;

                //INSERT TABELA USUARIOS
                const sqlU = 'INSERT INTO tbusuario(usu_nome , usu_email, usu_senha,id_setor) VALUES (?,?,?,?)'
                const valuesU = [usuNome, usuEmail, usuSenha, idS];
                const RetornoU = await db.query(sqlU, valuesU);
                const id = RetornoU[0].insertId;

                //INSERT TABELA EMPRESASUSUARIOS
                const sqlEU = 'INSERT INTO tbempresasusuarios(id_empresa,id_usuario,usu_tipo)VALUES(?,?,?)'
                const valuesEU = [idE, id, 0];// 0 pois e ADM
                const RetornoEU = await db.query(sqlEU, valuesEU);

                return response.status(200).json({ confirma: true, message: 'Usuário cadastrado com susceso' });
            }
        } catch (error) {
            return response.status(500).json({ confirma: false, message: error });
        }
    },
    //CADASTRO USUARIO COMUM
    async cadastrocomum(request, response) {
        try {
            const { usuEmail, usuSenha, usuNome, idEmp, idSet } = request.body;

            //VERIFICA SE O EMAIL JA NAO ESTA CADASTRADO
            const sqlEmail = "SELECT EXISTS(SELECT 1 FROM TBUsuario WHERE usu_email = ?) AS emailExistente";
            const RetornoEmail = await db.query(sqlEmail, usuEmail);

            //RETORNA FALSE CASO EMAIL JA ESTEJA CADASTRADO
            if (RetornoEmail[0][0].emailExistente === 1) {
                return response.status(201).json({ confirma: false, message: "Email já cadastrado" })

                //CADASTRA O USUARIO  COMO USUARIO COMUM
            } else {

                //ACHA O SETOR EM QUE O USUARIO FOI CADASTRADO 
                const sql = "SELECT id_setor FROM tbsetor WHERE id_setor = ? AND id_empresa = ?;"
                const Retorno = await db.query(sql, [idSet, idEmp]);
                const idSetor = Retorno[0][0].id_setor

                //CADASTRA O USUARIO 
                const values = [usuNome, usuEmail, usuSenha, idSetor]
                const sql1 = 'INSERT INTO tbusuario(usu_nome , usu_email, usu_senha, id_setor) VALUES (?,?,?,?)'
                const Retorno1 = await db.query(sql1, values);
                const id = Retorno1[0].insertId;

                //ASOCIA O USUARIO A EMPRESA
                const values1 = [idEmp, id, 1];// 0 pois e ADM
                const sql2 = 'INSERT INTO tbempresasusuarios(id_empresa,id_usuario,usu_tipo)VALUES(?,?,?)'
                const Retorno2 = await db.query(sql2, values1);
                return response.status(200).json({ confirma: true, message: [Retorno, Retorno1, Retorno2] });
            }
        } catch (error) {
            console.error('Erro no cadastro do usuário:', error);
            return response.status(500).json({ confirma: false, message: "Erro interno no servidor" });
        }
    },

    //EDITAR USUARIO
    async editarusuariocomunadm(request, response) {
        try {
            const { usuEmail, usuNome, usuStatus, idSetor } = request.body;
            const { idUsuario } = request.params;

            //VERIFICA SE O EMAIL EXISTE E PERTENCE A UM USUARIO DEFERENTE DO QUE SERA MODIFICADO
            const sqlEmail = "SELECT EXISTS(SELECT 1 FROM TBUsuario WHERE usu_email = ? AND id_usuario != ?) AS emailExistente";
            const value = [usuEmail, idUsuario];
            const retornoEmail = await db.query(sqlEmail, value);

            //RETORNO CASO EMAIL JÁ CADASTRADO E NAO PERTENCER AO USUARIO
            if (retornoEmail[0][0].emailExistente === 1) {
                return response.status(201).json({ confirma: false, message: "ESTE EMAIL NÃO SER UTULIZADO" })

                //FAZ O UPDATE    
            } else {
                const sql = 'UPDATE tbusuario SET usu_nome = ? , usu_email = ?,usu_status = ? , id_setor = ? WHERE id_usuario = ?'
                const values = [usuNome, usuEmail, usuStatus, idSetor, idUsuario]
                const res = await db.query(sql, values);
                return response.status(200).json({ confirma: true, message: res });
            }
        } catch (error) {
            return response.status(500).json({ confirma: 'Erro', message: error });
        }
    },

    //DELETAR USUARIO
    async deletarusuariocomunadm(request, response) {
        try {
            const { idUsuario } = request.params;

            //VERIFICA SE O USUÁRIO NÃO TEM AGENDAMENTOS 
            const sqlAgenda = 'SELECT EXISTS(SELECT 1 FROM tbagenda WHERE id_usuario = ?) AS agendamento';
            const resAgenda = await db.query(sqlAgenda, idUsuario);
            // SE TIVER AGENDAMENTOS
            if (resAgenda[0][0].agendamento == 1) {
                return response.status(200).json({ confirma: false, message: "O USUARIO AINDA TEM AGENDAMENTOS" });
            } else {
                //FAZ O DELETE DA TABELA EMPRESAUSUARIO
                const sqlEU = "DELETE FROM TBEmpresasUsuarios WHERE id_usuario = ?"
                const resEu = await db.query(sqlEU, idUsuario)
                //FAZ O DELETE DA TABELA USUARIO
                const sql = "DELETE FROM TBUsuario WHERE id_usuario = ?";
                const res = await db.query(sql, idUsuario);
                return response.status(200).json({ confirma: true, message: res });
            }
        } catch (error) {
            return response.status(500).json({ confirma: 'Erro', message: error });
        }
    },

    //LISTAR USUARIO PELO ID
    async infoUsuario(request, response) {
        try {
            const { idUsuario } = request.params

            //LISTA O USUARIO PELO ID
            const sql = 'SELECT id_usuario, usu_nome, usu_email, usu_senha, usu_telefone, id_setor, usu_status FROM TBUsuario WHERE id_usuario = ? ;';
            const usuarioInfo = await db.query(sql, idUsuario);
            return response.status(200).json(usuarioInfo[0]);
        } catch (error) {
            return response.status(500).json(error);
        }
    },
};