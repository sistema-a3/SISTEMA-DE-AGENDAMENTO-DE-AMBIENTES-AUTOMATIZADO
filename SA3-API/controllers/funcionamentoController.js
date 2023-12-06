const { json } = require("express");
const db = require("../database/connection");

module.exports = {
    async listarFuncionamentos(request, response){
        try{
            const sql = 'SELECT id_funcionamento, id_empresa, dia_semana, horario_inicio, horario_fim  FROM TBFuncionamento';
            const Funcionamento = await db.query(sql);
            return response.status(200).json(Funcionamento[0]);
        } catch (error){
            return response.status(500).json(error);
        }
    },
    async cadastrarFuncionamentos(request, response){
        try{
        const {id_empresa, dia_semana, horario_inicio, horario_fim} = request.body;
        const sql = 'INSERT INTO TBfuncionamento (id_empresa, dia_semana, horario_inicio, horario_fim) VALUES (?, ?, ?, ?)';
        const values = [id_empresa, dia_semana, horario_inicio, horario_fim];
        const confirmacao = await db.query(sql, values);
        const id_funcionamento = confirmacao[0].insertId;
        return response.status(200).json({confirma: 'Sucesso', message: id_funcionamento});
    } catch (error){
            return response.status(500).json({confirma: 'Erro', message: error});
        }
    },
    async editarFuncionamentos(request, response){
        try{
            const {id_empresa, dia_semana, horario_inicio, horario_fim} = request.body;
            const {idFuncionamento} = request.params;
            const sql = 'UPDATE TBfuncionamento SET id_empresa = ?, dia_semana = ?, horario_inicio = ?, horario_fim = ? WHERE id_funcionamento = ?';
            const values = [id_empresa, dia_semana, horario_inicio, horario_fim, idFuncionamento];
            const atualizacao = await db.query(sql, values);
             return response.status(200).json({confirma: 'Sucesso', message: 'Dados atualizados'});
         } catch (error){
             return response.status(500).json({confirma: 'Erro', message: error});
         }   
    },
    async excluirFuncionamentos(request, response){
        try{
            const {idFuncionamento} = request.params;
            const sql = 'DELETE FROM TBfuncionamento WHERE id_funcionamento = ?';
            const atualizacao = await db.query(sql, idFuncionamento);
            return response.status(200).json({confirma: 'Funcionamento'});
        } catch (error){
            return response.status(500).json({confirma: 'Erro', message: error});
        }
    },
};