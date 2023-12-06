const { json } = require("express");
const db = require("../database/connection");

module.exports = {
    
    //LISTAR USUARIOS DA EMPRESA
    async listarEmpresasUsuariosReservas(request, response){
        try{
            const {idEmpresa} = request.body;
            const sql = 'SELECT empUsu.id_empresa, empUsu.id_usuario, empUsu.usu_tipo, usu.usu_nome, usu.usu_email, usu.usu_senha, usu.usu_telefone, usu.id_setor, str.nome_setor, usu.usu_status, (SELECT COUNT(*) FROM TBAgenda WHERE id_usuario = empUsu.id_usuario AND data_agenda >= now()) AS numSlRes FROM TBEmpresasUsuarios empUsu INNER JOIN TBUsuario usu ON empUsu.id_usuario = usu.id_usuario INNER JOIN tbsetor str ON usu.id_setor = str.id_setor WHERE empUsu.id_empresa = ?;';
            const EmpresasUsuarios = await db.query(sql, idEmpresa);
            return response.status(200).json(EmpresasUsuarios[0]);
        } catch (error){
            return response.status(500).json(error);
        }
    },
};