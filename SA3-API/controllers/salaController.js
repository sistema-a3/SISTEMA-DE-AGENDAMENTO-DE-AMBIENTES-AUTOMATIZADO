const { json } = require("express");
const db = require("../database/connection");

module.exports = {
    
    //CADASTRAR SALA
    async cadastrarsala(request, response){
        try{
            const { NomeSala, NumeroSala, DescricaoSala, IdEmpresa} = request.body;
            
            //VERIFICA SE A SALA JA EXISTE
            const sqlVerifica = 'SELECT EXISTS (SELECT 1 FROM tbsala WHERE nome_sala = ?AND num_sala = ? AND id_empresa = ?) AS salaExistente'
            const salaExistente = await db.query(sqlVerifica,[NomeSala,NumeroSala,IdEmpresa])
            
            //SE SALA JA ESTIVER CADASTRADA
            if (salaExistente[0][0].salaExistente) {
                return response.status(201).json({confirma:false , message:"Sala já cadastrada"})
            
            //SENAO CADASTRA A SALA
            } else {
                const sql = 'INSERT INTO TBSala (nome_sala, num_sala, desc_sala, id_empresa) VALUES (?,?,?,?)';
                const values = [NomeSala, NumeroSala, DescricaoSala, IdEmpresa];
                const res = await db.query(sql, values);
                return response.status(200).json({confirma: true, message: "Sala cadastrada com susseco", data:res});
            }
            
            // const sql = 'INSERT INTO TBSala (nome_sala, num_sala, desc_sala, id_empresa) VALUES (?,?,?,?)';
            // const values = [NomeSala, NumeroSala, DescricaoSala, IdEmpresa];
            // const res = await db.query(sql, values);
            // return response.status(200).json({confirma: true, message: "Sala cadastrada com susseco", data:res});
        } catch (error){
            return response.status(500).json({confirma: false, message: error});
        }
    },
    
    //EDITAR SALA
    async editarsala(request, response){
        try{
            const { idSala } = request.params
            const { salNome, salNumero, salDescricao , salStatus , idEmpresa} = request.body;

            //VERIFICA SE A SALA JA EXISTE
            const sqlVerifica = 'SELECT EXISTS (SELECT 1 FROM tbsala WHERE nome_sala = ? AND id_empresa = ? AND num_sala = ? AND id_sala != ?) AS salaExistente'
            
            const salaExistente = await db.query(sqlVerifica,[salNome,idEmpresa,salNumero,idSala])
            const salaJaExistente = salaExistente[0][0].salaExistente
            if (salaJaExistente) {
                return response.status(201).json({confirma:false, message:"Sala já existente"})
            } else {
                const sql = 'UPDATE TBSala SET nome_sala = ?, num_sala = ?, desc_sala = ?, status_sala = ? WHERE id_sala = ? ';
                const values = [salNome, salNumero, salDescricao, salStatus , idSala];
                const res = await db.query(sql, values);
                return response.status(200).json({confirma: 'Sucesso', message: "Sala editada com susseso",data: res});
            }
            
        } catch (error){
            return response.status(500).json({confirma: false, message: error});
        }
    },
    //DELETAR SALA
    async deletarsala(request, response){
        try{
            const { idSala } = request.params
            const sql = 'DELETE FROM TBSala WHERE id_sala = ? ';
            const values = [idSala];
            const res = await db.query(sql, values);
            return response.status(200).json({confirma: 'Sucesso', message: res});
        } catch (error){
            return response.status(500).json({confirma: 'Erro', message: error});
        }
    },
};