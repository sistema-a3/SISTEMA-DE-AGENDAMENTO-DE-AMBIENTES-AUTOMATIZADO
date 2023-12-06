const { json } = require("express");
const db = require("../database/connection");

module.exports = {

    //AGENDA DO USUARIO
    async agendausuario(request, response) {
        try {
            const { usuId } = request.body;
            const sql = 'SELECT age.id_agenda, data_agenda, hora_inicio, hora_fim, nome_reserva, desc_reserva, age.id_sala, status_agenda, cor_agenda, nome_sala , num_sala ,desc_sala ,status_sala FROM tbagenda age INNER JOIN tbsala sal ON age.id_sala = sal.id_sala WHERE id_usuario = ?';
            const retorno = await db.query(sql, usuId);
            return response.status(200).json({ confirma: true, message: retorno[0] });
        } catch (error) {
            return response.status(500).json({ confirma: false, message: error });
        }
    },

    //AGENDA DA SALA
    async agendasala(request, response) {
        try {
            const { empId } = request.body;
            //INFO SALA
            const sqlSala = "SELECT id_sala , nome_sala , num_sala ,desc_sala ,status_sala FROM tbsala WHERE id_empresa = ?"
            const resSala = await db.query(sqlSala, empId);

            //INFO AGENDA
            const sqlAgenda = "SELECT sal.id_sala,usu_nome,usu_email ,id_agenda, usu.id_usuario, DATE_FORMAT(data_agenda, '%Y-%m-%d') AS data_formatada, hora_inicio, hora_fim, nome_reserva, desc_reserva, status_agenda, cor_agenda FROM tbsala sal INNER JOIN tbagenda age ON age.id_sala = sal.id_sala INNER JOIN tbusuario usu ON usu.id_usuario = age.id_usuario WHERE id_empresa = ?";
            const resAgenda = await db.query(sqlAgenda, empId);
            
            const Agenda = resAgenda[0].map((e) =>({
                id_usuario: e.id_usuario,
                usu_nome : e.usu_nome,
                usu_email: e.usu_email,
                id_sala: e.id_sala,
                id_agenda: e.id_agenda,
                title: e.nome_reserva,
                start: e.data_formatada+'T'+e.hora_inicio,
                end: e.data_formatada+'T'+e.hora_fim,
                extendedProps: {
                    description: e.desc_reserva,
                    state: e.status_agenda
                },
                overlap: false,
                backgroundColor: "#333338",
                id: e.id_agenda
            }));


            //INFO AGENDASOLICITACAO
            const sqlAgeSolicitacao = 'SELECT ags.id_solicitacoes , id_agenda , tipo_solicitacao , status_solicitacao FROM tbsolicitacoes sol INNER JOIN tbagendasolicitacoes ags on ags.id_solicitacoes = sol.id_solicitacoes WHERE id_empresa = ?;';
            const resAgeSolicitacao = await db.query(sqlAgeSolicitacao, empId);

            //INFO SOLICITACAO 
            const sqlSolicitacao = "SELECT id_solicitacoes, tipo_solicitacao, status_solicitacao FROM tbsolicitacoes WHERE id_empresa = ?"
            const resSolicitacao = await db.query(sqlSolicitacao, empId);

            //RETORNO
            return response.status(200).json({ confirma: true, message: { Sala: resSala[0], Agenda: Agenda, AgendaSolicitacao: resAgeSolicitacao[0], Solicitacao: resSolicitacao[0] } });
        } catch (error) {
            return response.status(500).json({ confirma: false, message: error });
        }
    },

    async cadastroagenda(request, response) {
        try {
            const { idSala, idUsu, agenda, inicio, fim, nome, desc, idSol } = request.body;

            //VALIDAR STATUS SALA USUARIO SOLICITACAO E INSERIR NA SOLICITACAO

            //VERIFICA SE A SALA ESTA ATIVA
            const sqlSala = "SELECT status_sala FROM tbsala WHERE id_sala = ?";
            const resSala = await db.query(sqlSala, idSala);
            const Sala = resSala[0][0].status_sala
            if (!Sala) {
                return response.status(202).json({ confirma: false, message: "Não foi possivel concluir o Agendamento:Sala Inativa" });
            }
            //VERIFICA SE O USUARIO ESTA ATIVO
            const sqlUsuario = "SELECT usu_status FROM tbusuario WHERE id_usuario = ?;";
            const resUsuario = await db.query(sqlUsuario, idUsu);
            const Usuario = resUsuario[0][0].usu_status
            if (!Usuario) {
                return response.status(203).json({ confirma: false, message: "Não foi possivel concluir o Agendamento:Usuario Inativo" })
            }
            //VERIFICA SE A SOLICITACAO ESTA ATIVA
            if (idSol) {
                const sqlSolicitacao = "SELECT status_solicitacao FROM tbsolicitacoes WHERE id_solicitacoes = ?";
                const resSolicitacao = await db.query(sqlSolicitacao, parseInt(idSol));
                const Solicitacao = resSolicitacao[0][0].status_solicitacao
                if (!Solicitacao) {
                    return response.status(204).json({ confirma: false, message: "Não foi possivel concluir o Agendamento:Solicitação Inativa" })
                }
            }

            //VERIFICA SE NÃO A AGENDAMENTOS NAQUELE DIA,HORARIO E SALA
            const sqlAgendado = "SELECT EXISTS ( SELECT 1 FROM tbagenda WHERE ( (hora_fim >= ? AND hora_inicio <= ?) OR (hora_fim >= ? AND hora_inicio <= ?) ) AND date(data_agenda) = ? AND id_sala = ? ) AS dataCadastrada;";
            const valuesAgendado = [inicio, inicio, fim, fim, agenda, idSala];
            const resAgendado = await db.query(sqlAgendado, valuesAgendado);

            //SE EXISTIR RETORNA UMA MENSAGEM
            const dataCadastrada = resAgendado[0][0].dataCadastrada
            if (dataCadastrada) {
                return response.status(201).json({ confirma: false, message: "Agendamento já cadastrado neste horario para esta sala neste dia" })

                //SENAO EXECUTA O CADASTRO DA RESERVA
            } else {

                //CADASTRA A RESERVA
                const valuesAgenda = [idSala, idUsu, agenda, inicio, fim, nome, desc];
                const sqlAgenda = "INSERT INTO tbagenda (id_sala, id_usuario, data_agenda, hora_inicio, hora_fim, nome_reserva,  desc_reserva)VALUE (?,?,?,?,?,?,?);"
                const res = await db.query(sqlAgenda, valuesAgenda);
                const idAgenda = res[0].insertId
                //CADASTRA A SOLICITACAO
                if (idSol && idSol != null) {
                    const valuesAgendaSolicitacao = [idAgenda, parseInt(idSol)]
                    const sqlAgendaSolicitacao = "INSERT INTO tbagendasolicitacoes(id_agenda,id_solicitacoes)VALUES(?,?) "
                    const resAgendaSolicitacao = await db.query(sqlAgendaSolicitacao, valuesAgendaSolicitacao)
                    return response.status(200).json({ confirma: true, message: { Agenda: res, AgendaSolicitacao: resAgendaSolicitacao } })
                }
                return response.status(200).json({ confirma: true, message: { Agenda: res } })
            }
        } catch (error) {
            return response.status(500).json({ confirma: false, message: error });
        }
    },
    async editaragenda(request, response) {
        try {
            const { idAgenda } = request.params
            const { idSala, idUsu, agenda, inicio, fim, nome, desc, idSol } = request.body;


            //VERIFICA SE A SALA ESTA ATIVA
            const sqlSala = "SELECT status_sala FROM tbsala WHERE id_sala = ?";
            const resSala = await db.query(sqlSala, idSala);
            const Sala = resSala[0][0].status_sala
            if (!Sala) {
                return response.status(202).json({ confirma: false, message: "Não foi possivel concluir o Agendamento:Sala Inativa" });
            }

            //VERIFICA SE O USUARIO ESTA ATIVO
            const sqlUsuario = "SELECT usu_status FROM tbusuario WHERE id_usuario = ?;";
            const resUsuario = await db.query(sqlUsuario, idUsu);
            const Usuario = resUsuario[0][0].usu_status
            if (!Usuario) {
                return response.status(203).json({ confirma: false, message: "Não foi possivel concluir o Agendamento:Usuario Inativo" })
            }

            //VERIFICA SE A SOLICITACAO ESTA ATIVA
            if (idSol) {
                const sqlSolicitacao = "SELECT status_solicitacao FROM tbsolicitacoes WHERE id_solicitacoes = ?";
                const resSolicitacao = await db.query(sqlSolicitacao, parseInt(idSol));
                const Solicitacao = resSolicitacao[0][0].status_solicitacao
                if (!Solicitacao) {
                    return response.status(204).json({ confirma: false, message: "Não foi possivel concluir o Agendamento:Solicitação Inativa" })
                }
            }

            //VERIFICA SE NÃO A AGENDAMENTOS NAQUELE DIA,HORARIO E SALA
            const sqlAgendado = "SELECT EXISTS ( SELECT 1 FROM tbagenda WHERE ( (hora_fim >= ? AND hora_inicio <= ?) OR (hora_fim >= ? AND hora_inicio <= ?) ) AND date(data_agenda) = ? AND id_sala = ? AND id_usuario != ?) AS dataCadastrada;";
            const valuesAgendado = [inicio, inicio, fim, fim, agenda, idSala, idUsu];
            const resAgendado = await db.query(sqlAgendado, valuesAgendado);

            //SE EXISTIR RETORNA UMA MENSAGEM
            const dataCadastrada = resAgendado[0][0].dataCadastrada;
            if (dataCadastrada) {
                return response.status(201).json({ confirma: false, message: "Agendamento já cadastrado neste horario para esta sala neste dia" });

                //SENAO EXECUTA O CADASTRO DA RESERVA
            } else {
                const valuesAgenda = [agenda, inicio, fim, nome, desc, idAgenda];
                const sqlAgenda = "UPDATE tbagenda SET data_agenda = ?, hora_inicio = ?, hora_fim = ?, nome_reserva = ?, desc_reserva = ? WHERE id_agenda = ?;"
                const res = await db.query(sqlAgenda, valuesAgenda);

                if (idSol) {
                    const valuesAgendaSolicitacao = [parseInt(idSol), idAgenda];
                    const sqlAgendaSolicitacao = "UPDATE tbagendasolicitacoes SET id_solicitacoes = ? WHERE id_agenda = ?;";
                    const resAgendaSolicitacao = await db.query(sqlAgendaSolicitacao, valuesAgendaSolicitacao);
                    return response.status(200).json({ confirma: true, message: { Agenda: res, AgendaSolicitacao: resAgendaSolicitacao } });
                }
                return response.status(200).json({ confirma: true, message: res })
            }
        } catch (error) {
            return response.status(500).json({ confirma: false, message: error });
        }
    },
    async deletaragenda(request, response) {
        try {
            const { idAgenda } = request.params;
            const value = [idAgenda];


            //DELETA AS SOLICITACOES DO AGENDAMENTO NA TABELA DE LIGACAO
            const sqlAgendaSolicitacao = "DELETE FROM TBagendasolicitacoes WHERE id_agenda = ?";
            const resAgendaSolicitacao = await db.query(sqlAgendaSolicitacao, value);

            //DELETA O AGENDAMENTO
            const sqlAgenda = "DELETE FROM TBagenda WHERE id_agenda = ?"
            const resAgenda = await db.query(sqlAgenda, value);

            return response.status(200).json({ confirma: true, message: { Agenda: resAgenda, AgendaSolicitacao: resAgendaSolicitacao } })
        } catch (error) {
            return response.status(500).json({ confirma: false, message: error });
        }
    },
    async cancelaragenda(request,response){
        try {

            const { idAgenda } = request.params;
            
            const sqlCancelar = "UPDATE tbagenda SET status_agenda = 0 WHERE id_agenda = ?"
            const resCancelar = await db.query(sqlCancelar , idAgenda)
            return response.status(200).json({ confirma: true, message: resCancelar })
        } catch (error) {
            return response.status(500).json({ confirma: false, message: error });
        }
    }
};
