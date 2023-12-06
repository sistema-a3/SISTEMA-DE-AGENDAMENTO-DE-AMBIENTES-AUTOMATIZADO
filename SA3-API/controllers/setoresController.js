const { json } = require("express");
const db = require("../database/connection");

module.exports = {
    async listarSetores(request, response) {
        try {
            const { idSetores } = request.params; // Remova a chamada a parseInt
            const sql = 'SELECT id_setor, nome_setor, status_setor FROM TBSetor WHERE id_empresa = ? ORDER BY id_setor DESC';
            const setores = await db.query(sql, idSetores);
            return response.status(200).json(setores[0]);
        } catch (error) {
            return response.status(500).json(error);
        }
    },
   
    //CADASTRO DE SETOR
    async cadastrarsetores(request, response) {
        try {
            const { nomeSetor, IdEmpresa } = request.body;

            //VERIFICA SE NAO EXISTE OUTRO SETOR COM ESTE NOME CADASTRADO NA EMPRESA
            const valueNse = [nomeSetor,IdEmpresa];
            const sqlNse = 'SELECT EXISTS(SELECT 1 FROM tbsetor WHERE nome_setor = ? AND id_empresa = ?) AS nse;'
            const resNse = await db.query(sqlNse,valueNse)
            const nse = resNse[0][0].nse
            //SE ESTIVER UM SERTOR COM ESTE NOME NA EMPRESA
            if (nse) {
                return response.status(200).json({confirma: false, message: "Setor já cadastrado" });
            //SE NAO DA UPDATE NA TABELA COM OS DADOS
            } else {
                const sql = 'INSERT INTO TBSetor (nome_setor,id_empresa) VALUES (?,?)';
                const values = [nomeSetor,IdEmpresa];
                const confirmacao = await db.query(sql, values);
                return response.status(200).json({confirma: true, message: confirmacao[0] });   
            }
        } catch (error) {
            return response.status(500).json({ confirma: 'Erro', message: error });
        }
    },

    //EDITAR SETOR
    async altearsetores(request, response) {
        try {
            const { setNome, setStatus,IdEmpresa } = request.body;
            const { idSetor } = request.params
            
            //VERIFICA SE NAO EXISTE OUTRO SETOR COM ESTE NOME CADASTRADO NA EMPRESA
            const valueNse = [setNome,IdEmpresa , idSetor];
            const sqlNse = 'SELECT EXISTS(SELECT 1 FROM tbsetor WHERE nome_setor = ? AND id_empresa = ? AND id_setor != ?) AS nse;'
            const resNse = await db.query(sqlNse,valueNse)
            const nse = resNse[0][0].nse
            //SE ESTIVER UM SERTOR COM ESTE NOME NA EMPRESA
            if (nse) {
                return response.status(201).json({nse:resNse, confirma: false, message: "Setor já cadastrado" });
            //SE NAO DA UPDATE NA TABELA COM OS DADOS
            } else {
                const sql = 'UPDATE TBSetor SET nome_setor = ?, status_setor = ? WHERE id_setor = ?';
                const values = [setNome,setStatus , idSetor];
                const confirmacao = await db.query(sql, values);
                return response.status(200).json({confirma: true, message: confirmacao[0] });
                
            }
            
        } catch (error) {
            return response.status(500).json({ confirma: 'Erro', message: error });
        }
    },

    //DELETAR SETOR
    async deletarsetor (request , response){
        try {
            const {idSetor} = request.params
            // TEM QUE VERIFICAR SE NAO TME PESSOAS NESSE SETOR 
            const sqlVerifica = 'SELECT EXISTS (SELECT 1 FROM tbusuario WHERE id_setor = ?) AS usuSet';
            const resVerifica =  await db.query(sqlVerifica , idSetor)

            //SE TIVER USUSARIO CADASTRADO NO SETOR NAO DEIXA REMOVER
            if (resVerifica[0][0].usuSet == 1) {
                return response.status(201).json({confirma : false , menssage : 'Usuario no setor'})
            } else {
                //SE NAO DELETA O SETOR
                const sql = 'DELETE FROM TBSetor WHERE id_setor = ?';
                const values = [idSetor];
                const res  = await db.query(sql , values);
                return response.status(200).json({confirma : true , menssage: res})
            }
        } catch (error) {
            return response.status(500).json({confirma:false , menssage: error})
        }
    },
};