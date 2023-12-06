const { json } = require("express");
const db = require("../database/connection");

module.exports = {
    async listarAgendaSolicitacoes(request, response){
        try{
            const sql = 'SELECT id_solicitacoes, id_agenda FROM TBAgendaSolicitacoes';
            const AgendaSolicitacoes = await db.query(sql);
            return response.status(200).json(AgendaSolicitacoes[0]);
        } catch (error){
            return response.status(500).json(error);
        }
    },
    async cadastrarAgendaSolicitacoes(request, response){
        try{
            const {id_solicitacoes, id_agenda} = request.body;
            const sql = 'INSERT INTO tbagendasolicitacoes (id_solicitacoes, id_agenda) VALUES (?, ?)';
            const values = [id_solicitacoes, id_agenda];
            const confirmacao = await db.query(sql, values);
            const id = confirmacao[0].insertId;
            return response.status(200).json({confirma: 'Sucesso', message: id});
        } catch (error){
            return response.status(500).json({confirma: 'Erro', message: error});
        }
    },
    async editarAgendaSolicitacoes(request, response){
        try{
               const {id_solicitacoes} = request.body;
               const {idAgenda} = request.params;
               const sql = 'UPDATE tbagendasolicitacoes SET id_solicitacoes = ?  WHERE id_agenda = ?';
               const values = [id_solicitacoes, idAgenda];
               const atualizacao = await db.query(sql, values);
                return response.status(200).json({confirma: 'Sucesso', message: 'Dados atualizados'});
            } catch (error){
                return response.status(500).json({confirma: 'Erro', message: error});
            }       
    },
    async excluirAgendaSolicitacoes(request, response){
        try{
            const {idSolicitacoes, idAgenda} = request.params;
            const sql = 'DELETE FROM tbagendasolicitacoes WHERE id_solicitacoes = ? AND id_agenda = ?';
            const values = [ idSolicitacoes, idAgenda];
            const atualizacao = await db.query(sql, values);
            return response.status(200).json({confirma: 'Excluir Solicitações'});
        } catch (error){
            return response.status(500).json({confirma: 'Erro', message: error});
        }
    },
};