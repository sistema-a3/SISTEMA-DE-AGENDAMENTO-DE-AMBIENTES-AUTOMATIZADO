const { json } = require("express");
const db = require("../database/connection");

module.exports = {
    
    //CADASTRA SOLICITACAO 
    async cadastrarsolicitacoes(request, response){
        try{
            const {idEmpresa, nomeSolicitacao} = request.body;

            //VERIFICA SE A SOLICITACAO NAO ESTA CADASTRADA
            const sqlNse = 'SELECT EXISTS(SELECT 1 FROM tbsolicitacoes WHERE tipo_solicitacao = ? AND id_empresa = ?) AS nse'
            const resNse  = await db.query(sqlNse,[nomeSolicitacao, idEmpresa])
            const nse = resNse[0][0].nse
            //SE TIVER CADASTRADA
            if (nse) {
                return response.status(201).json({confirma : false , message : "Solicitação já cadastrada"})
            //SENAO CADASTRA SOLICITACAO
            } else {
                const sql = 'INSERT INTO tbsolicitacoes (id_empresa, tipo_solicitacao) VALUES (?,?)';
                const values = [idEmpresa, nomeSolicitacao];
                const confirmacao = await db.query(sql, values);
                return response.status(200).json({confirma: true, message: 'Solicitação cadastrada com susceso', data:confirmacao});
            }
        } catch (error){
            return response.status(500).json({confirma: 'Erro', message: error});
        }
    },

    //EDITAR SOLICITACAO
    async editarsolicitacao(request, response){
        
        try{
            const {solStatus, solTipo ,idEmp} = request.body;
            const {idSolicitacao} = request.params;

            //VERIFICA SE A SOLICITACAO NAO ESTA CADASTRADA
            const sqlNse = 'SELECT EXISTS(SELECT 1 FROM tbsolicitacoes WHERE tipo_solicitacao = ? AND id_empresa = ? AND id_solicitacoes != ?) AS nse'
            const resNse  = await db.query(sqlNse,[solTipo, idEmp , idSolicitacao])
            const nse = resNse[0][0].nse;
            //SE TIVER CADASTRADA
            if (nse) {
                return response.status(201).json({confirma : false , message : "Solicitação já existente"})
            
                //SENAO CADASTRA SOLICITACAO
            } else {
                const sql = 'UPDATE TBSolicitacoes SET tipo_solicitacao = ? , status_solicitacao = ? WHERE id_solicitacoes = ?';
                const values = [solTipo,solStatus,idSolicitacao];
                const confirmacao = await db.query(sql, values);
                return response.status(200).json({confirma: true, message: 'Solicitação editada com susceso', data:confirmacao});
            }
        } catch (error){
            return response.status(500).json({confirma: 'Erro', message: error});
        }
        
    },

    //DELETAR SOLICITACAO
    async deletarsolicitacao(request, response){

        

        try {
            const {idSolicitacao} = request.params;
            const values = [idSolicitacao]
            const sql = 'DELETE FROM TBSolicitacoes WHERE id_solicitacoes = ?  '
            const res = await db.query(sql , values)
            return response.status(200).json({confirma: 'Sucesso', message: res});
        } catch (error) {
            return response.status(500).json({confirma: 'Erro', message: error});
        }
    },
};