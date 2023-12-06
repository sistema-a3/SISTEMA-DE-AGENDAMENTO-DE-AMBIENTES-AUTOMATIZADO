const { json } = require("express");
const db = require("../database/connection");

module.exports = {
    

    //LISTA AS SALAS DA EMPRESA
    async listarEmpresaSala(request, response){
        const {idEmpresa} = request.body;
        try{
            const sql = 'SELECT  emp.id_empresa , sal.id_sala, sal.nome_sala, sal.num_sala, sal.desc_sala, sal.status_sala,(SELECT COUNT(*) FROM TBAgenda age WHERE age.id_sala = sal.id_sala   AND data_agenda >= now()) AS numSlRes FROM tbempresa emp INNER JOIN tbsala sal ON sal.id_empresa = emp.id_empresa  WHERE emp.id_empresa = ?;';
            const empresa = await db.query(sql, idEmpresa);
            return response.status(200).json(empresa[0]);
        } catch (error){
            return response.status(500).json(error);
        }
    },

    //LISTA AS SOLICITACOES DA EMPRESA
    async listarEmpresaSolicitacoes(request, response){
        const {idEmpresa} = request.body;
        try{
            const sql = 'SELECT emp.id_empresa, sol.id_solicitacoes, sol.tipo_solicitacao , sol.status_solicitacao,(SELECT COUNT(*) FROM TBAgenda age WHERE age.id_agenda = ages.id_agenda AND data_agenda >= now()) AS numSlRes FROM TBEmpresa emp INNER JOIN tbsolicitacoes sol ON sol.id_empresa = emp.id_empresa LEFT JOIN tbagendasolicitacoes ages ON ages.id_solicitacoes = sol.id_solicitacoes WHERE emp.id_empresa = ?  ORDER BY sol.tipo_solicitacao DESC;';
            const empresa = await db.query(sql, idEmpresa);
            return response.status(200).json(empresa[0]);
        } catch (error){
            return response.status(500).json(error);
        }
    },

    //LISTA OS SETORES DA EMPRESA
    async listarEmpresaSetor(request, response){
        const {idEmpresa} = request.body;
        try{
            const sql = 'SELECT emp.id_empresa,  str.id_setor, str.nome_setor, str.status_setor FROM TBEmpresa emp INNER JOIN TBSetor str ON str.id_empresa = emp.id_empresa WHERE emp.id_empresa = ?;';
            const empresa = await db.query(sql, idEmpresa);
            return response.status(200).json(empresa[0]);
        } catch (error){
            return response.status(500).json(error);
        }
    },
    async dadosempresa(request,response){
        const {idEmpresa} = request.body;
        try {
            const sql = "SELECT id_empresa,nome_empresa,telefone_empresa  FROM TBEmpresa WHERE id_empresa = ?"
            const res = await db.query(sql,idEmpresa);
            return response.status(200).json({confirma:true,message:res[0][0]})
        } catch (error) {
            return response.status(500).json({confirma:false,message:error});
        }
    }
};