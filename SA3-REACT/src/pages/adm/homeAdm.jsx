//DEPENDENCIAS
import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';

//COMPENENTES
import api from "../../servise/api";
import Footer from "../../components/footer";

//IMAGENS
import EditBtn from "../../img/svg/buttonedit.svg";
import DeleteBtn from "../../img/svg/buttondelete.svg";
import AddBtn from "../../img/svg/btn-add.svg";
import Logo from "../../img/svg/logo.svg";

import { Spinner } from 'react-bootstrap';
import HeaderAdm from "../../components/headerAdm";

function HomeAdm() {

    //VARS



    //DEPENDENCIAS

    const navigate = useNavigate()


    //STATES

    //MAPS
    const [setor, setSetor] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [solicitacoes, setSolicitacoes] = useState([]);
    const [salas, setSalas] = useState([]);
    //RESET MAP
    const [isModificado, setModificado] = useState(true);
    //SELECT MAP(EDIT/DELETE)
    const [Solicitacao, setSolicitacao] = useState(null)
    const [Setores, setSetores] = useState(null)
    const [Sala, setSala] = useState(null)
    const [Usuario, setUsuario] = useState(null)

    const [selectedStatus, setSelectedStatus] = React.useState("Inativo"); // supondo que 'Inativo' seja o padrão
    const [Empresa, setEmpresa] = useState({})
    const [isActiveUsuarios, setIsActiveUsuarios] = useState(3);
    const [isActiveSetores, setIsActiveSetores] = useState(null);
    const [isActiveSalas, setIsActiveSalas] = useState(null);
    const [isActiveSolicitacaos, setIsActiveSolicitacaos] = useState(null);


    const [UserSession, setUserSession] = useState();
    useEffect(() => {
        const User = JSON.parse(localStorage.getItem('user'));
        setUserSession(User);
        setIsActiveUsuarios(3);
        handleClickAtualizar();
    }, [])

    const handleClick = (usuarios, setores, salas, solicitacoes) => {
        setIsActiveUsuarios(usuarios);
        setIsActiveSetores(setores);
        setIsActiveSalas(salas);
        setIsActiveSolicitacaos(solicitacoes);
    };

    // Exemplos de uso
    const clickUsuario = (e) => handleClick(e, null, null, null);
    const clickSetor = (e) => handleClick(null, e, null, null);
    const clickSala = (e) => handleClick(null, null, e, null);
    const clickSolicitacao = (e) => handleClick(null, null, null, e);


    //requisição apo
    //vars

    function handleClickAtualizar() {
        // Ao clicar no botão, atualiza o estado para refazer a requisição
        setModificado(!isModificado);

    };

    useEffect(() => {
        const fetchData = async () => {
            if (UserSession) {

                const idEmpresa = UserSession.emp

                //EMPRESA SETOR
                try {
                    const response = await api.post('/empresasetor', { idEmpresa });
                    setSetor(response.data);
                } catch (error) {
                    if (error.response) {
                        // Ocorreu um erro na resposta do servidor (status não 2xx)
                        Swal.fire({
                            title: 'Erro ao processar a solicitação',
                            text: 'Ocorreu um erro ao processar a solicitação. Por favor, tente novamente.',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    } else if (error.request) {
                        // A solicitação foi feita, mas não houve resposta do servidor
                        Swal.fire({
                            title: 'Sem resposta do servidor',
                            text: 'Não foi possível obter uma resposta do servidor. Por favor, tente novamente.',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    } else {
                        // Outro tipo de erro
                        console.error('Erro desconhecido:', error.message);
                    }
                }
                //EMPRESA USURIOS
                try {
                    const response = await api.post('/empresausuariosreservas', { idEmpresa });
                    setUsuarios(response.data);
                } catch (error) {
                    // console.error(error);
                }

                //EMPRESA SOLICITACAOES
                try {
                    const response = await api.post('/empresasolicitacoes', { idEmpresa });
                    setSolicitacoes(response.data);
                } catch (error) {
                    // console.error(error);
                }
                //EMPRESA SALAS
                try {
                    const response = await api.post('/empresasala', { idEmpresa });
                    setSalas(response.data);
                } catch (error) {
                    // console.error(error);  
                }
                //EMPRESA DADOS
                try {
                    const response = await api.post('/dadosempresa', { idEmpresa });
                    setEmpresa(response.data.message);
                } catch (error) {

                }
            };
        }

        fetchData();
    }, [isModificado])


    const [isActive, setIsActive] = useState(3);

    const filtrarUsuariosStatus = (status) => {
        if (isActiveUsuarios === 3) {
            return usuarios;
        } else {
            return usuarios.filter((usu) => usu.usu_status === status);
        }
    };
    const filtrarSetoresStatus = (status) => {
        if (isActiveSetores === 3) {
            return setor;
        } else {
            return setor.filter((set) => set.status_setor === status);
        }
    };
    const filtrarSalasStatus = (status) => {
        if (isActiveSalas === 3) {
            return salas;
        } else {
            return salas.filter((sala) => sala.status_sala === status);
        }
    };
    const filtrarSolicitacoesStatus = (status) => {
        if (isActiveSolicitacaos === 3) {
            return solicitacoes;
        } else {
            return solicitacoes.filter((sol) => sol.status_solicitacao === status);
        }
    };


    //ALTERAR TABELA

    //TABELA SETOR
    const AlterarSetor = async (e) => {
        const dados = {
            setStatus: e.status_setor,
            setNome: e.nome_setor
        };

        try {
            const res = await api.put(`/editarsetor/${e.id_setor}`, dados);

            if (res.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Alterado',
                    text: 'Setor alterado com sucesso!',
                    timer: 2500
                });
                document.getElementById('modalCloseESE').click();
                handleClickAtualizar();
            } else {
                throw new Error('Ocorreu um erro na alteração do Setor!');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: error.message || 'Ocorreu um erro ao atualizar o setor. Por favor, tente novamente.',
            });
        }
    };


    //ALTERAR SOLICITACAO

    const AlterarSolicitacao = async (e) => {
        try {
            const dados = {
                "solTipo": e.tipo_solicitacao,
                "solStatus": e.status_solicitacao
            };
            const res = await api.put(`/editarsolicitacao/${e.id_solicitacoes}`, dados);
            if (res.status == 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Alterado',
                    text: `Solicitação alterada com sucesso!`,
                    timer: 2500
                });
                document.getElementById('modalCloseESO').click();
                handleClickAtualizar();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocorreu um erro na alteração da Solicitação',
                    timer: 2500
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocorreu um error',
                timer: 2500
            })
        }
    }


    //TABELA SALA
    const AlterarSala = async (sala) => {
        try {
            const dados = {
                salDescricao: sala.desc_sala,
                salNome: sala.nome_sala,
                salNumero: sala.num_sala,
                salStatus: sala.status_sala
            }
            const res = await api.put(`/editarsala/${sala.id_sala}`, dados);
            if (res.status == 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Alterado',
                    text: `Sala alterada com sucesso!`,
                    timer: 2500
                });
                document.getElementById('modalCloseES').click();
                handleClickAtualizar();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocorreu um erro na alteração da Sala',

                });
            }

            //PUXA OS DADOS DA API DNV
            handleClickAtualizar();
        } catch (error) {
        }
    }

    //TABELA USUARIO
    const AlterarUsuario = async (usuario) => {
        try {
            const dados = {
                "usuNome": usuario.usu_nome,
                "usuEmail": usuario.usu_email,
                "idSetor": usuario.id_setor,
                "usuStatus": usuario.usu_status,
            }
            const res = await api.put(`/editarusuario/${usuario.id_usuario}`, dados);
            if (res.data.confirma) {
                Swal.fire({
                    icon: 'success',
                    title: `Alterado com sucesso!`,
                    text: "Continue assim, mantendo tudo atualizado",
                    showConfirmButton: false,
                    timer: 2500
                });
                document.getElementById('modalCloseEU').click();
                handleClickAtualizar();
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: "Não foi possível alterar o Usuário",
                    text: 'Ocorreu um erro ao tentar realizar a operação de edição do Usuário. Por favor tente novamente mais',
                    showConfirmButton: false,
                    timer: 2500
                })

            }

            //PUXA OS DADOS DA API DNV
            handleClickAtualizar();
        } catch (error) {
        }
    }






    //DELETE 

    //DELETE USUARIO 
    const DeletarUsuario = async (e) => {
        try {
            //REQUISISAO API
            const res = await api.delete(`/deletarusuario/${e.id_usuario}`)
            if (res.data.confirma == false) {
                Swal.fire({
                    icon: 'warning',
                    title: `Este Usuário possui agendamento!`,
                    text: 'Por favor tente novamente mais tarde'
                })
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Usuario deletado com sucesso!',
                    showConfirmButton: true,
                }).then((result) => {
                    if (result.isConfirmed) {
                        handleClickAtualizar();
                        document.getElementById('modalCloseDU').click();
                    }
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erro ao deletar o usuario!',
                text: 'Erro ao deletar o usuario!'
            })
        }
    }

    //DELETE SETOR
    const DeletarSetor = async (e) => {
        try {
            //REQUISISAO PRA DELETAR
            const res = await api.delete(`/deletarsetor/${e.id_setor}`);
            if (res.data.confirma === false) {
                Swal.fire({
                    icon: 'warning',
                    title: `Este setor possui usuarios ou agendamentos vinculados!`,
                    text: 'Por favor tente novamente mais tarde'
                })
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Setor deletado com sucesso!',
                    showConfirmButton: true,
                }).then((result) => {
                    if (result.isConfirmed) {
                        handleClickAtualizar();
                        document.getElementById('modalCloseDSE').click();
                    }
                });
            }
        } catch (error) {
        }
    }

    //DELETE SOLICITACAO
    const DeleteSolicitacao = async (e) => {
        try {
            //REQUISISAO PRA DELETAR
            const res = await api.delete(`/deletarsolicitacao/${e.id_solicitacoes}`);
            if (res.data.confirma === false) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Não é possivel deletar essa solicitação pois ela já foi atendida ou está em andamento',
                    text: 'Por favor tente novamente mais tarde'
                })
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Solicitação deletada com sucesso!',
                    showConfirmButton: true,
                }).then((result) => {
                    if (result.isConfirmed) {
                        handleClickAtualizar();
                        document.getElementById('modalCloseDSO').click();
                    }
                });
            }
        } catch (error) {
        }
    }

    //DELETE SALA
    const DeleteSala = async (e) => {
        try {
            //REQUISISAO PRA DELETAR
            const res = await api.delete(`/deletarsala/${e.id_sala}`);
            if (res.data.confirma === false) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Não é possivel deletar essa sala pois ela em uso',
                    text: 'Por favor tente novamente mais tarde',
                })
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Sala deletado com sucesso!',
                    showConfirmButton: true,
                }).then((result) => {
                    if (result.isConfirmed) {
                        handleClickAtualizar();
                        document.getElementById('modalCloseDS').click();
                    }
                });
            }
        } catch (error) {
        }
    }



    return (
        <>
            <div className="flex-container">
                <HeaderAdm />



                {/* <!--Container Main start--> */}
                <div className="height-100 bg-light">
                    <div className="d-flex flex-nowrap">
                        <div className="container">
                            <main>
                                <div className="row text-center my-5">
                                    <div className="fs-2 fw-bold title-sa3">
                                        AMBIENTE ADMINISTRATIVO
                                    </div>
                                    <div className="fs-5 text-muted fw-bold">
                                        {UserSession ? UserSession.nomeEmpresa : ''}
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-lg-3 col-md-4 col-sm-6 mb-5"> {/*usuarios*/}
                                        <div
                                            className="card adm border-0 text-center text-white fw-bolder fs-3 text-truncate my-3"
                                            id="bg-user"
                                        >
                                            <div className="row">
                                                <a onClick={() => { navigate('/cadusuario') }}>
                                                    <div className="mt-3">
                                                        <div>cadastrar</div>
                                                        <div>usuários</div>
                                                    </div>
                                                    <div className="text-center my-3">
                                                        <img
                                                            src={AddBtn}
                                                            alt=""

                                                        />
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="row justify-content-center">
                                            <div className="mini-card mini-card-user-1 fw-bolder fs-6 text-truncate my-1" onClick={() => clickUsuario(3)}>
                                                <div className="mx-2 d-flex justify-content-between">
                                                    <div className="text-start" >
                                                        usuários cadastrados
                                                    </div>
                                                    <div className="text-end">
                                                        {/* 10 */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row justify-content-center d-lg-flex">
                                            <div className="mini-card mini-card-user-2 fw-bolder fs-6 text-truncate my-1" onClick={() => clickUsuario(1)}>
                                                <div className="mx-2 d-flex justify-content-between">
                                                    <div className="text-start">
                                                        usuários ativos
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                        <div className="row justify-content-center d-lg-flex">
                                            <div className="mini-card mini-card-user-3 fw-bolder fs-6 text-truncate my-1" onClick={() => clickUsuario(0)}>
                                                <div className="mx-2 d-flex justify-content-between">
                                                    <div className="text-start">
                                                        usuários inativos
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>  {/* fim usuarios*/}
                                    <div className="col-lg-3 col-md-4 col-sm-6 mb-5">{/*setores*/}
                                        <div
                                            className="card adm border-0 text-center text-white fw-bolder fs-3 text-truncate my-3"
                                            id="bg-sector"
                                        >
                                            <div className="row">
                                                <a href="./cadsetor">
                                                    <div className="mt-3">
                                                        <div>cadastrar</div>
                                                        <div>setores</div>
                                                    </div>
                                                    <div className="text-center my-3">
                                                        <img
                                                            src={AddBtn}
                                                            alt=""

                                                        />
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="row justify-content-center">
                                            <div className="mini-card mini-card-sector-1 fw-bolder fs-6 text-truncate  my-1" onClick={() => clickSetor(3)}>
                                                <div className="mx-2 d-flex justify-content-between ">
                                                    <div className="text-start">
                                                        setores cadastrados
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                        <div className="row justify-content-center d-lg-flex">
                                            <div className="mini-card mini-card-sector-2 fw-bolder fs-6 text-truncate my-1" onClick={() => clickSetor(1)}>
                                                <div className="mx-2 d-flex justify-content-between">
                                                    <div className="text-start">
                                                        setores ativos
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                        <div className="row justify-content-center d-lg-flex">
                                            <div className="mini-card mini-card-sector-3 fw-bolder fs-6 text-truncate my-1" onClick={() => clickSetor(0)}>
                                                <div className="mx-2 d-flex justify-content-between">
                                                    <div className="text-start">
                                                        setores inativos
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div> {/*setores*/}
                                    <div className="col-lg-3 col-md-4 col-sm-6 mb-5"> {/*salas*/}
                                        <div
                                            className="card adm border-0 text-center text-white fw-bolder fs-3 text-truncate my-3"
                                            id="bg-room"
                                        >
                                            <div className="row">
                                                <a href="./cadsala">
                                                    <div className="mt-3">
                                                        <div>cadastrar</div>
                                                        <div>salas</div>
                                                    </div>
                                                    <div className="text-center my-3">
                                                        <img
                                                            src={AddBtn}
                                                            alt=""

                                                        />
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="row justify-content-center">
                                            <div className="mini-card mini-card-room-1 fw-bolder fs-6 text-truncate my-1" onClick={() => clickSala(3)}>
                                                <div className="mx-2 d-flex justify-content-between">
                                                    <div className="text-start">
                                                        salas cadastrados
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                        <div className="row justify-content-center d-lg-flex">
                                            <div className="mini-card mini-card-room-2 fw-bolder fs-6 text-truncate my-1" onClick={() => clickSala(1)}>
                                                <div className="mx-2 d-flex justify-content-between">
                                                    <div className="text-start">
                                                        salas ativos
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                        <div className="row justify-content-center d-lg-flex">
                                            <div className="mini-card mini-card-room-3 fw-bolder fs-6 text-truncate my-1" onClick={() => clickSala(0)}>
                                                <div className="mx-2 d-flex justify-content-between">
                                                    <div className="text-start">
                                                        salas inativos
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div> {/*salas*/}
                                    <div className="col-lg-3 col-md-4 col-sm-6 mb-5"> {/*solicitações*/}
                                        <div
                                            className="card adm border-0 text-center text-white fw-bolder fs-3 text-truncate my-3"
                                            id="bg-requests"
                                        >
                                            <div className="row">
                                                <a href="./cadsolicitacao">
                                                    <div className="mt-3">
                                                        <div>cadastrar</div>
                                                        <div>solicitações</div>
                                                    </div>
                                                    <div className="text-center my-3">
                                                        <img
                                                            src={AddBtn}
                                                            alt=""

                                                        />
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="row justify-content-center">
                                            <div className="mini-card mini-card-requests-1 fw-bolder fs-6 text-truncate my-1" onClick={() => clickSolicitacao(3)}>
                                                <div className="mx-2 d-flex justify-content-between">
                                                    <div className="text-start text-center">
                                                        solicitações cadastrados
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                        <div className="row justify-content-center d-lg-flex">
                                            <div className="mini-card mini-card-requests-2 fw-bolder fs-6 text-truncate my-1" onClick={() => clickSolicitacao(1)}>
                                                <div className="mx-2 d-flex justify-content-between">
                                                    <div className="text-start">
                                                        solicitações ativos
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                        <div className="row justify-content-center d-lg-flex">
                                            <div className="mini-card mini-card-requests-3 fw-bolder fs-6 text-truncate my-1" onClick={() => clickSolicitacao(0)}>
                                                <div className="mx-2 d-flex justify-content-between">
                                                    <div className="text-start">
                                                        solicitações inativos
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div> {/*solicitações*/}
                                </div>



                                {/* TABELA USUARIOS */}
                                {isActiveUsuarios !== null &&
                                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                        < table className="align-middle w-100 my-5">
                                            <thead>
                                                <tr>
                                                    <th colSpan="5">
                                                        <div className="mx-4 my-3 fs-4 fw-bolder text-black">
                                                            Você esta visualizando agora
                                                            {(() => {
                                                                switch (isActiveUsuarios) {
                                                                    case 0:
                                                                        return " (Todos inativos)";
                                                                    case 1:
                                                                        return " (Todos ativos)";
                                                                    case 3:
                                                                        return " (Todos usuários)";
                                                                    default:
                                                                        return "";
                                                                }
                                                            })()}

                                                        </div>
                                                    </th>
                                                </tr>
                                                <tr>
                                                    <th>
                                                        <div className="flex-row d-flex">
                                                            <div
                                                                style={{
                                                                    width: "15px",
                                                                }}
                                                                className=""
                                                            ></div>
                                                            <div className="">Nome</div>
                                                        </div>
                                                    </th>
                                                    <th>Status</th>
                                                    <th>Setor</th>
                                                    <th className="text-center">
                                                        Agendas em aberto
                                                    </th>
                                                    <th className="text-center">Alterar</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {usuarios.length > 0 ? (
                                                    // Verifica se há usuários e filtra pelo status
                                                    filtrarUsuariosStatus(isActiveUsuarios).map((usu, index, all) => (
                                                        // Verifica se a sessão do usuário existe e é de tipo 0 (outras condições podem ser adicionadas conforme necessário)
                                                        UserSession && UserSession.tipo === 0 && UserSession.usu !== usu.id_usuario ? (
                                                            <tr key={usu.id_usuario}>
                                                                {/* Se a condição for atendida, exibe os detalhes do usuário */}
                                                                <td>
                                                                    <div className="d-flex align-items-center">
                                                                        <div className="ms-3">
                                                                            <p className="text-black fs-4 fw-bold mb-0 text-truncate">
                                                                                {usu.usu_nome}
                                                                            </p>
                                                                            <p className="text-muted mb-0 text-truncate">
                                                                                {usu.usu_email}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <p
                                                                        className={
                                                                            usu.usu_status === 1
                                                                                ? "bg-active text-center fs-6 text-bold mb-0"
                                                                                : "bg-disabled text-center fs-6 text-bold mb-0"
                                                                        }
                                                                    >
                                                                        {usu.usu_status === 1 ? "Ativo" : "Inativo"}
                                                                    </p>
                                                                </td>
                                                                <td>{usu.nome_setor}</td>
                                                                <td className="text-center">{usu.numSlRes}</td>
                                                                <td className="d-flex justify-content-center">
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-link btn-sm btn-rounded"
                                                                        onClick={() => {
                                                                            setUsuario(usu);
                                                                        }}
                                                                    >
                                                                        <a
                                                                            id="edit-btn"
                                                                            href="#"
                                                                            data-bs-toggle="modal"
                                                                            data-bs-target="#modalEditUsuario"
                                                                        >
                                                                            <img src={EditBtn} alt="Edit Button" />
                                                                        </a>
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-link btn-sm btn-rounded"
                                                                        onClick={() => {
                                                                            setUsuario(usu);
                                                                        }}
                                                                    >
                                                                        <a
                                                                            id="delete-btn"
                                                                            href="#"
                                                                            data-bs-toggle="modal"
                                                                            data-bs-target="#modalDeleteUsuario"
                                                                        >
                                                                            <img src={DeleteBtn} alt="Delete Button" />
                                                                        </a>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ) : null
                                                    ))
                                                ) : (
                                                    // Se não houver usuários, exibe a mensagem
                                                    <tr>
                                                        <td colSpan={5}>
                                                            <div className="my-5 d-flex justify-content-center align-items-center">
                                                                <p className="text-muted mb-0">Nenhum registro encontrado.</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                }

                                {/* TABELA SETORES */}
                                {isActiveSetores !== null &&
                                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                        <table className="align-middle w-100 my-5">
                                            <thead>
                                                <tr>
                                                    <th colSpan="5">
                                                        <div className="mx-4 my-3 fs-4 fw-bolder text-black">
                                                            Setores Cadastrados
                                                            {(() => {
                                                                switch (isActiveSetores) {
                                                                    case 0:
                                                                        return " (Todos inativos)";
                                                                    case 1:
                                                                        return " (Todos ativos)";
                                                                    case 3:
                                                                        return " (Todos setores)";
                                                                    default:
                                                                        return "";
                                                                }
                                                            })()}
                                                        </div>
                                                    </th>
                                                </tr>
                                                <tr>
                                                    <th>
                                                        <div className="flex-row d-flex">
                                                            <div
                                                                style={{
                                                                    width: "15px",
                                                                }}
                                                                className=""
                                                            ></div>
                                                            <div className="">Nome</div>
                                                        </div>
                                                    </th>
                                                    <th>Status</th>
                                                    <th className="text-center">Alterar</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {setor.length > 0 ? (
                                                    filtrarSetoresStatus(isActiveSetores).map((set) => {
                                                        return (
                                                            <tr key={set.id_setor}>
                                                                <td>
                                                                    <div className="d-flex align-items-center">

                                                                        <div className="ms-3">
                                                                            <p className="text-black fs-4 fw-bold mb-0 text-truncate">
                                                                                {set.nome_setor}
                                                                            </p>
                                                                            <p className="text-muted mb-0 text-truncate">
                                                                                descrição
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <p className={set.status_setor === 1 ? "bg-active text-center fs-6 text-bold mb-0" : "bg-disabled text-center fs-6 text-bold mb-0"}>
                                                                        {set.status_setor === 1 ? 'Ativo' : 'Inativo'}
                                                                    </p>
                                                                </td>

                                                                <td className="d-flex justify-content-center">
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-link btn-sm btn-rounded"
                                                                        onClick={() => { setSetores(set) }}
                                                                    >
                                                                        <a
                                                                            id="edit-btn"
                                                                            href="#"
                                                                            data-bs-toggle="modal"
                                                                            data-bs-target="#modalEditSetor"
                                                                        >
                                                                            <img
                                                                                src={EditBtn}
                                                                                alt="Edit Button"
                                                                            />
                                                                        </a>
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-link btn-sm btn-rounded"
                                                                        onClick={() => { setSetores(set) }}
                                                                    >
                                                                        <a
                                                                            id="delete-btn"
                                                                            href="#"
                                                                            data-bs-toggle="modal"
                                                                            data-bs-target="#modalDeleteSetor"
                                                                        >
                                                                            <img
                                                                                src={DeleteBtn}
                                                                                alt="Delete Button"
                                                                            />
                                                                        </a>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })) : (<tr>
                                                        <td colSpan={3}>
                                                            <div className="my-5 d-flex justify-content-center align-items-center">

                                                                <p className="text-muted mb-0 text-truncate">
                                                                    Nenhum registro encontrado.
                                                                </p>
                                                            </div>
                                                        </td>
                                                    </tr>)}
                                            </tbody>
                                        </table>
                                    </div>
                                }

                                {/* TABLEA SALAS */}
                                {isActiveSalas !== null &&
                                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                        <table className="align-middle w-100 my-5">
                                            <thead>
                                                <tr>
                                                    <th colSpan="5">
                                                        <div className="mx-4 my-3 fs-4 fw-bolder text-black">
                                                            Salas Cadastradas
                                                            {(() => {
                                                                switch (isActiveSalas) {
                                                                    case 0:
                                                                        return " (Todas inativas)";
                                                                    case 1:
                                                                        return " (Todas ativas)";
                                                                    case 3:
                                                                        return " (Todas salas)";
                                                                    default:
                                                                        return "";
                                                                }
                                                            })()}
                                                        </div>
                                                    </th>
                                                </tr>
                                                <tr>
                                                    <th>
                                                        <div className="flex-row d-flex">
                                                            <div
                                                                style={{
                                                                    width: "15px",
                                                                }}
                                                                className=""
                                                            ></div>
                                                            <div className="">Nome</div>
                                                        </div>
                                                    </th>
                                                    <th>Status</th>
                                                    <th className="text-center">
                                                        Total de agendas
                                                    </th>
                                                    <th className="text-center">Alterar</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {salas.length > 0 ? (
                                                    filtrarSalasStatus(isActiveSalas).map((sala) => {
                                                        return (
                                                            <tr key={sala.id_sala}>
                                                                <td>
                                                                    <div className="d-flex align-items-center">

                                                                        <div className="ms-3">
                                                                            <p className="text-black fs-4 fw-bold mb-0 text-truncate">
                                                                                {sala.nome_sala} {sala.num_sala}
                                                                            </p>
                                                                            <p className="text-muted mb-0 text-truncate">
                                                                                {sala.desc_sala}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <p className={sala.status_sala === 1 ? "bg-active text-center fs-6 text-bold mb-0" : "bg-disabled text-center fs-6 text-bold mb-0"}>
                                                                        {sala.status_sala === 1 ? 'Ativo' : 'Inativo'}
                                                                    </p>
                                                                </td>
                                                                <td className="text-center">{sala.numSlRes}</td>
                                                                <td className="d-flex justify-content-center">
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-link btn-sm btn-rounded"
                                                                        onClick={() => { setSala(sala) }}
                                                                    >
                                                                        <a
                                                                            id="edit-btn"
                                                                            href="#"
                                                                            data-bs-toggle="modal"
                                                                            data-bs-target="#modalEditSala"
                                                                        >
                                                                            <img
                                                                                src={EditBtn}
                                                                                alt="Edit Button"
                                                                            />
                                                                        </a>
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-link btn-sm btn-rounded"
                                                                        onClick={() => { setSala(sala) }}
                                                                    >
                                                                        <a
                                                                            id="delete-btn"
                                                                            href="#"
                                                                            data-bs-toggle="modal"
                                                                            data-bs-target="#modalDeleteSala"
                                                                        >
                                                                            <img
                                                                                src={DeleteBtn}
                                                                                alt="Delete Button"
                                                                            />
                                                                        </a>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    }
                                                    )
                                                ) : <tr>
                                                    <td colSpan={4}>
                                                        <div className="my-5 d-flex justify-content-center align-items-center">

                                                            <p className="text-muted mb-0">
                                                                Nenhum registro encontrado.
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                                }

                                            </tbody>
                                        </table>
                                    </div>
                                }

                                {/* TABELA SOLICITAÇÕES */}
                                {isActiveSolicitacaos !== null &&
                                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                        <table className="align-middle w-100 my-5">
                                            <thead>
                                                <tr>
                                                    <th colSpan="5">
                                                        <div className="mx-4 my-3 fs-4 fw-bolder text-black">
                                                            Solicitações Cadastradas
                                                            {(() => {
                                                                switch (isActiveSolicitacaos) {
                                                                    case 0:
                                                                        return " (Todas inativas)";
                                                                    case 1:
                                                                        return " (Todas ativas)";
                                                                    case 3:
                                                                        return " (Todas solicitações)";
                                                                    default:
                                                                        return "";
                                                                }
                                                            })()}
                                                        </div>
                                                    </th>
                                                </tr>
                                                <tr>
                                                    <th>
                                                        <div className="flex-row d-flex">
                                                            <div
                                                                style={{
                                                                    width: "15px",
                                                                }}
                                                                className=""
                                                            ></div>
                                                            <div className="">Nome</div>
                                                        </div>
                                                    </th>
                                                    <th>Status</th>
                                                    <th className="text-center">
                                                        Quantidade
                                                    </th>
                                                    <th className="text-center">Alterar</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {solicitacoes.length > 0 ? (
                                                    filtrarSolicitacoesStatus(isActiveSolicitacaos).map((sol) => {

                                                        return (

                                                            <tr key={sol.id_solicitacoes}>
                                                                <td>
                                                                    <div className="d-flex align-items-center">

                                                                        <div className="ms-3">
                                                                            <p className="text-black fs-4 fw-bold mb-0 text-truncate">
                                                                                {sol.tipo_solicitacao}
                                                                            </p>
                                                                            <p className="text-muted mb-0 text-truncate">
                                                                                descrição
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <p className={sol.status_solicitacao === 1 ? "bg-active text-center fs-6 text-bold mb-0" : "bg-disabled text-center fs-6 text-bold mb-0"}>
                                                                        {sol.status_solicitacao === 1 ? 'Ativo' : 'Inativo'}
                                                                    </p>
                                                                </td>
                                                                <td className="text-center">{sol.numSlRes}</td>
                                                                <td className="d-flex justify-content-center">
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-link btn-sm btn-rounded"
                                                                        onClick={() => { setSolicitacao(sol) }}
                                                                    >
                                                                        <a
                                                                            id="edit-btn"
                                                                            href="#"
                                                                            data-bs-toggle="modal"
                                                                            data-bs-target="#modalEditSolicitacoes"
                                                                        >
                                                                            <img
                                                                                src={EditBtn}
                                                                                alt="Edit Button"
                                                                            />
                                                                        </a>
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-link btn-sm btn-rounded"
                                                                        onClick={() => { setSolicitacao(sol) }}
                                                                    >
                                                                        <a
                                                                            id="delete-btn"
                                                                            href="#"
                                                                            data-bs-toggle="modal"
                                                                            data-bs-target="#modalDeleteSolicitacoes"
                                                                        >
                                                                            <img
                                                                                src={DeleteBtn}
                                                                                alt="Delete Button"
                                                                            />
                                                                        </a>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    }
                                                    )
                                                ) : <tr>
                                                    <td colSpan={4}>
                                                        <div className="my-5 d-flex justify-content-center align-items-center">

                                                            <p className="text-muted mb-0">
                                                                Nenhum registro encontrado.
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                                }

                                            </tbody>
                                        </table>
                                    </div>
                                }

                                {/* <!-- MODAL --> */}

                                {/* <!-- USUARIO --> */}
                                {/* <!-- Inicio do Modal Edit Usuario--> */}
                                <div
                                    className="modal-lg modal fade"
                                    id="modalEditUsuario"
                                    tabIndex="-1"
                                    aria-labelledby="entrarContaLabel"
                                    aria-hidden="true"
                                >
                                    <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content container">
                                            <div className="row justify-content-end m-2">
                                                <button
                                                    type="button"
                                                    className="btn-close"
                                                    data-bs-dismiss="modal"
                                                    aria-label="Close"
                                                    id={'modalCloseEU'}
                                                ></button>
                                            </div>

                                            <div className="text-center">
                                                <strong>
                                                    <h4 className="fw-bold text-center title-sa3">
                                                        Editando dados do
                                                        Usuário
                                                    </h4>
                                                </strong>


                                            </div>

                                            <div className="container-sm p-4 px-5">
                                                <div className="my-3">
                                                    <label
                                                        htmlFor="nomeCompleto"
                                                        className="form-label fw-bolder"
                                                    >
                                                        Nome completo
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name=""
                                                        id="nomeCompleto"
                                                        className="form-control input-text"
                                                        placeholder="ex: João Costa"
                                                        value={Usuario ? Usuario.usu_nome : ''}
                                                        onChange={(e) => {
                                                            const value = e.target.value
                                                            setUsuario((prevState) => (
                                                                {
                                                                    ...prevState,
                                                                    usu_nome: value
                                                                }
                                                            ))
                                                        }}
                                                    />
                                                </div>

                                                <div className="my-3">
                                                    <label
                                                        htmlFor="Email"
                                                        className="form-label fw-bolder"
                                                    >
                                                        Email
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name=""
                                                        id="Email"
                                                        value={Usuario ? Usuario.usu_email : ''}
                                                        className="form-control input-text"
                                                        placeholder="ex: name@exemplo.com"
                                                        onChange={(e) => {
                                                            const value = e.target.value
                                                            setUsuario((prevState) => (
                                                                {
                                                                    ...prevState,
                                                                    usu_email: value
                                                                }
                                                            ))
                                                        }}
                                                    />
                                                </div>

                                                <div className="my-3">
                                                    <label
                                                        htmlFor="setor"
                                                        className="form-label fw-bolder"
                                                    >
                                                        Setor
                                                    </label>
                                                    <select
                                                        className="form-select input-text"
                                                        id="inputGroupSelect01"
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            setUsuario((prevState) => (
                                                                {
                                                                    ...prevState,
                                                                    id_setor: value
                                                                }
                                                            ))
                                                        }}
                                                    >
                                                        {setor ?
                                                            setor.map(
                                                                setor => {
                                                                    return (
                                                                        <option
                                                                            selected={Usuario ? setor.id_setor === Usuario.id_setor : false}
                                                                            key={setor.id_setor}
                                                                            value={setor.id_setor}
                                                                            defaultValue={Usuario ? setor.id_setor === Usuario.id_setor : false}
                                                                        >
                                                                            {setor.nome_setor}
                                                                        </option>
                                                                    )
                                                                }
                                                            )
                                                            : null
                                                        }
                                                    </select>
                                                </div>

                                                <div className="my-5">
                                                    <div className="card-modal-edit">
                                                        <div className="card-body row d-flex">
                                                            <p className="text-center fw-bolder my-2">
                                                                Status
                                                            </p>
                                                            <p className="text-center fs-6 text-muted">
                                                                Como deseja
                                                                manter este
                                                                usuario no
                                                                sistema?
                                                            </p>
                                                            <div className="d-flex justify-content-center mb-3">
                                                                <div className="form-check form-check-inline">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="AtivoUsuario"
                                                                        id="AtivoUsuario1"
                                                                        value="Ativo"
                                                                        checked={Usuario ? Usuario.usu_status === 1 : false}
                                                                        onChange={() => {
                                                                            setUsuario((prevState) => (
                                                                                {
                                                                                    ...prevState,
                                                                                    usu_status: 1
                                                                                }
                                                                            ))
                                                                        }}
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor="flexRadioDefault1"
                                                                    >
                                                                        Ativo
                                                                    </label>
                                                                </div>

                                                                <div className="form-check form-check-inline">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="InativoUsuario"
                                                                        id="InativoUsuario2"
                                                                        value="Inativo"
                                                                        checked={Usuario ? Usuario.usu_status === 0 : false}
                                                                        onChange={(e) => {
                                                                            setUsuario((prevState) => (
                                                                                {
                                                                                    ...prevState,
                                                                                    usu_status: 0
                                                                                }
                                                                            ))
                                                                        }}
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor="flexRadioDefault2"
                                                                    >
                                                                        Inativo
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row justify-content-center">
                                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                                        <input
                                                            className="btn rounded-5 my-3 p-2 mx-4 bg-disabled"
                                                            type="submit"
                                                            value="Cancelar"
                                                            data-bs-dismiss="modal"
                                                            aria-label="Close"
                                                        />
                                                    </div>
                                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                                        <input
                                                            className="btn rounded-5 my-3 p-2 mx-4 bg-active"
                                                            type="submit"
                                                            id=""
                                                            value="Confirmar"
                                                            onClick={() => AlterarUsuario(Usuario)}

                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <!-- Inicio do Modal Delete Usuario --> */}
                                <div
                                    className="modal-lg modal fade modal-lg"
                                    id="modalDeleteUsuario"
                                    tabIndex="-1"
                                    aria-labelledby="entrarContaLabel"
                                    aria-hidden="true"
                                >
                                    <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content container">
                                            <div className="row justify-content-end m-2">
                                                <button
                                                    type="button"
                                                    className="btn-close"
                                                    data-bs-dismiss="modal"
                                                    aria-label="Close"
                                                    id={'modalCloseDU'}
                                                ></button>
                                            </div>

                                            <strong>
                                                <h4 className="fw-bold text-center title-sa3">
                                                    Excluindo conta do Usuário
                                                </h4>
                                            </strong>

                                            <strong>
                                                <h4 className="fw-bold text-center">
                                                    Tem certeza que deseja
                                                    excluir esta conta?
                                                </h4>
                                            </strong>

                                            <div className="card-modal-delete mb-3 px-5">
                                                <div className="row g-0 justify-content-center">

                                                    <div className="col-md-7">
                                                        <div className="card-body">
                                                            <div className="d-flex row mx-2">
                                                                <div className="fs-6 fw-bold">
                                                                    Nome
                                                                </div>
                                                                <div className="fs-5 fw-regular text-truncate mb-3">
                                                                    {Usuario ? Usuario.usu_nome : null}

                                                                </div>
                                                                <div className="fs-6 fw-bold">
                                                                    Email
                                                                </div>
                                                                <div className="fs-5 fw-regular text-truncate mb-3">
                                                                    {Usuario ? Usuario.usu_email : null}

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-5">
                                                        <div className="card-body">
                                                            <div className="d-flex justify-content-center row text-center">
                                                                <div className="fs-6 fw-bold">
                                                                    Status
                                                                </div>
                                                                <div className={`py-2 w-75 ${Usuario ? Usuario.usu_status === 1 ? "bg-active" : "bg-disabled" : null}`}>
                                                                    {Usuario
                                                                        ? Usuario.usu_status === 1
                                                                            ? 'ativo'
                                                                            : 'inativo'
                                                                        : null}

                                                                </div>
                                                                <div className="fs-6 fw-bold">
                                                                    Setor
                                                                </div>
                                                                <div className="fs-6 fw-regular text-truncate bg-sector w-75 mx-auto">
                                                                    {setor.map((e) => {
                                                                        return (
                                                                            <div key={e.id_setor}> {e.id_setor === Usuario?.id_setor ? e.nome_setor : ''}</div>

                                                                        )
                                                                    })
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row ">
                                                <div className="d-flex justify-content-center col-lg-6 col-md-6 col-sm-6">
                                                    <input
                                                        className="btn rounded-5 my-3 p-2 bg-disabled"
                                                        type="submit"
                                                        id=""
                                                        value="Cancelar"
                                                        data-bs-dismiss="modal"
                                                        aria-label="Close"
                                                    />
                                                </div>
                                                <div className="d-flex justify-content-center col-lg-6 col-md-6 col-sm-6">
                                                    <input
                                                        className="btn rounded-5 my-3 p-2  bg-active"
                                                        type="submit"
                                                        id=""
                                                        value="Confirmar"
                                                        onClick={() => { DeletarUsuario(Usuario) }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <!-- SALA --> */}
                                {/* <!-- Inicio do Modal Edit Sala --> */}
                                <div
                                    className="modal-lg modal fade"
                                    id="modalEditSala"
                                    tabIndex="-1"
                                    aria-labelledby="entrarContaLabel"
                                    aria-hidden="true"
                                >
                                    <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content container">
                                            <div className="row justify-content-end m-2">
                                                <button
                                                    type="button"
                                                    className="btn-close"
                                                    data-bs-dismiss="modal"
                                                    aria-label="Close"
                                                    id={'modalCloseES'}
                                                ></button>
                                            </div>

                                            <div className="text-center">
                                                <strong>
                                                    <h4 className="fw-bold text-center title-sa3">
                                                        Editando dados da sala
                                                    </h4>
                                                </strong>
                                            </div>

                                            <div className="container-sm p-4 px-5">
                                                <div className="my-3">
                                                    <label
                                                        htmlFor="nomeSala"
                                                        className="form-label fw-bolder"
                                                    >
                                                        Nome da sala
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name=""
                                                        id="nomeSala"
                                                        value={Sala ? Sala.nome_sala : ''}
                                                        className="form-control input-text"
                                                        placeholder="ex: Audiovisual"
                                                        onChange={(e) => {
                                                            const value = e.target.value
                                                            setSala((prevState) => (
                                                                {
                                                                    ...prevState,
                                                                    nome_sala: value
                                                                }
                                                            ))
                                                        }}
                                                    />
                                                </div>

                                                <div className="my-3">
                                                    <label
                                                        htmlFor="numSala"
                                                        className="form-label fw-bolder"
                                                    >
                                                        Número
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name=""
                                                        value={Sala ? Sala.num_sala : ''}
                                                        id="numSala"
                                                        className="form-control input-text"
                                                        placeholder="ex: 001"
                                                        onChange={(e) => {
                                                            const value = e.target.value
                                                            setSala((prevState) => (
                                                                {
                                                                    ...prevState,
                                                                    num_sala: value
                                                                }
                                                            ))
                                                        }}
                                                    />
                                                </div>

                                                <div className="my-3">
                                                    <label
                                                        htmlFor="descSala"
                                                        className="form-label fw-bolder"
                                                    >
                                                        Descrição
                                                    </label>
                                                    <textarea
                                                        name=""
                                                        id="descSala"
                                                        style={{
                                                            height: "100px",
                                                        }}
                                                        value={Sala ? Sala.desc_sala : ''}
                                                        className="form-control input-text"
                                                        placeholder="Um espaço especialmente projetado para a apresentação e/ou gravação de conteúdos sonoros e visuais."
                                                        onChange={(e) => {
                                                            const value = e.target.value
                                                            setSala((prevState) => (
                                                                {
                                                                    ...prevState,
                                                                    desc_sala: value
                                                                }
                                                            ))
                                                        }}
                                                    ></textarea>
                                                </div>

                                                <div className="mt-5 mb-2">
                                                    <div className="card-modal-edit">
                                                        <div className="card-body row d-flex">
                                                            <p className="text-center fw-bolder my-2">
                                                                Status
                                                            </p>
                                                            <p className="text-center fs-6 text-muted">
                                                                Como deseja
                                                                manter este
                                                                usuario no
                                                                sistema?
                                                            </p>
                                                            <div className="d-flex justify-content-center mb-3">
                                                                <div className="form-check form-check-inline">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="AtivoSala"
                                                                        id="AtivoSala1"
                                                                        checked={Sala ? Sala.status_sala === 1 : false}
                                                                        onChange={() => {
                                                                            setSala((prevState) => (
                                                                                {
                                                                                    ...prevState,
                                                                                    status_sala: 1
                                                                                }
                                                                            ))
                                                                        }}
                                                                    // ou false, dependendo se você quer que esteja selecionado inicialmente ou não
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor="flexRadioDefault1"
                                                                    >
                                                                        Ativo
                                                                    </label>
                                                                </div>

                                                                <div className="form-check form-check-inline">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="InativoSala"
                                                                        id="InativoSala2"
                                                                        checked={Sala ? Sala.status_sala == 0 : false}
                                                                        onChange={() => {
                                                                            setSala((prevState) => (
                                                                                {
                                                                                    ...prevState,
                                                                                    status_sala: 0
                                                                                }
                                                                            ))
                                                                        }}

                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor="flexRadioDefault2"
                                                                    >
                                                                        Inativo
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <p className="text-muted text-center fs-6">
                                                    Lembre-se, ao desativar esta
                                                    sala, os usuários que já
                                                    realizaram algum tipo de
                                                    agendamento terão seus
                                                    compromissos desmarcados.
                                                </p>

                                                <div className="row justify-content-center">
                                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                                        <input
                                                            className="btn rounded-5 my-3 p-2 mx-4 bg-disabled"
                                                            type="submit"
                                                            id=""
                                                            value="Cancelar"
                                                            data-bs-dismiss="modal"
                                                            aria-label="Close"
                                                        />
                                                    </div>
                                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                                        <input
                                                            className="btn rounded-5 my-3 p-2 mx-4 bg-active"
                                                            type="submit"
                                                            id=""
                                                            value="Confirmar"
                                                            onClick={() => {
                                                                AlterarSala(Sala)
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <!-- Inicio do Modal Delete Sala --> */}
                                <div
                                    className="modal-lg modal fade"
                                    id="modalDeleteSala"
                                    tabIndex="-1"
                                    aria-labelledby="entrarContaLabel"
                                    aria-hidden="true"
                                >
                                    <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content container">
                                            <div className="row justify-content-end m-2">
                                                <button
                                                    type="button"
                                                    className="btn-close"
                                                    data-bs-dismiss="modal"
                                                    aria-label="Close"
                                                    id={'modalCloseDS'}

                                                ></button>
                                            </div>

                                            <strong>
                                                <h4 className="fw-bold text-center title-sa3">
                                                    Excluindo uma sala
                                                </h4>
                                            </strong>

                                            <strong>
                                                <h4 className="fw-bold text-center">
                                                    Tem certeza que deseja
                                                    excluir esta sala?
                                                </h4>
                                            </strong>

                                            <div className="card-modal-delete mb-3 px-5">
                                                <div className="row fs-6 fw-bolder">
                                                    <div className="col-md-4">
                                                        Nome da sala
                                                    </div>
                                                    <div className="col-md-4 text-center">
                                                        Nº
                                                    </div>
                                                    <div className="col-md-4 text-center">
                                                        Status
                                                    </div>
                                                </div>
                                                <div className="row fs-5 text-muted mt-2">
                                                    <div className="col-md-4">
                                                        {Sala ? Sala.nome_sala : ''}
                                                    </div>
                                                    <div className="col-md-4 text-center">
                                                        {Sala ? Sala.num_sala : ''}
                                                    </div>
                                                    <div className="col-md-4 text-center">
                                                        <span className={Sala ? Sala.status_sala === 1 ? "bg-active py-2 px-4" : "bg-disabled py-2 px-4" : null}
                                                        >
                                                            {Sala ? Sala.status_sala === 1 ? 'ativo' : 'inativo' : null}

                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-6 col-md-6 col-sm-6 d-flex justify-content-around">
                                                    <input
                                                        className="btn rounded-5 my-3 p-2 mx-4 bg-disabled"
                                                        type="submit"
                                                        id=""
                                                        value="Cancelar"
                                                        data-bs-dismiss="modal"
                                                        aria-label="Close"
                                                    />
                                                </div>
                                                <div className="col-lg-6 col-md-6 col-sm-6 d-flex justify-content-around">
                                                    <input
                                                        className="btn rounded-5 my-3 p-2 mx-4 bg-active"
                                                        type="submit"
                                                        id=""
                                                        value="Confirmar"
                                                        onClick={() => { DeleteSala(Sala) }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <!-- SOLICITACOES --> */}
                                {/* <!-- Inicio do Modal Edit Solicitações --> */}
                                <div
                                    className="modal-lg modal fade"
                                    id="modalEditSolicitacoes"
                                    tabIndex="-1"
                                    aria-labelledby="entrarContaLabel"
                                    aria-hidden="true"
                                >
                                    <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content container">
                                            <div className="row justify-content-end m-2">
                                                <button
                                                    type="button"
                                                    className="btn-close"
                                                    data-bs-dismiss="modal"
                                                    aria-label="Close"
                                                    id={'modalCloseESO'}
                                                ></button>
                                            </div>

                                            <div className="text-center">
                                                <strong>
                                                    <h4 className="fw-bold text-center title-sa3">
                                                        Editando dados da
                                                        Solicitação
                                                    </h4>
                                                </strong>
                                            </div>

                                            <div className="container-sm p-4 px-5">
                                                <div className="my-3">
                                                    <label
                                                        htmlFor="nomeSetor"
                                                        className="form-label fw-bolder"
                                                    >
                                                        Nome da Solicitação
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name=""
                                                        id="nomeSolicitacao"
                                                        className="form-control input-text"
                                                        placeholder="ex: Microfone"
                                                        value={Solicitacao ? Solicitacao.tipo_solicitacao : ''}
                                                        onChange={(e) => {
                                                            const value = e.target.value
                                                            setSolicitacao((prevState) => (
                                                                {
                                                                    ...prevState,
                                                                    tipo_solicitacao: value
                                                                }
                                                            ))
                                                        }}
                                                    />
                                                </div>

                                                <div className="mt-5 mb-2">
                                                    <div className="card-modal-edit">
                                                        <div className="card-body row d-flex">
                                                            <p className="text-center fw-bolder my-2">
                                                                Status
                                                            </p>
                                                            <p className="text-center fs-6 text-muted">
                                                                como deseja
                                                                manter esta
                                                                solicitação no
                                                                sistema?
                                                            </p>
                                                            <div className="d-flex justify-content-center mb-3">
                                                                <div className="form-check form-check-inline">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="AtivoSolicitacao"
                                                                        id="AtivoSolicitacao1"
                                                                        checked={Solicitacao ? Solicitacao.status_solicitacao === 1 : false}
                                                                        onChange={() => {
                                                                            setSolicitacao((prevState) => (
                                                                                {
                                                                                    ...prevState,
                                                                                    status_solicitacao: 1
                                                                                }
                                                                            ))
                                                                        }}

                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor="flexRadioDefault1"
                                                                    >
                                                                        Ativo
                                                                    </label>
                                                                </div>

                                                                <div className="form-check form-check-inline">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="InativoSolicitacao"
                                                                        id="InativoSolicitacao2"
                                                                        checked={Solicitacao ? Solicitacao.status_solicitacao === 0 : false}
                                                                        onChange={() => {
                                                                            setSolicitacao((prevState) => (
                                                                                {
                                                                                    ...prevState,
                                                                                    status_solicitacao: 0
                                                                                }
                                                                            ))
                                                                        }}

                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor="flexRadioDefault2"
                                                                    >
                                                                        Inativo
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <p className="text-muted text-center fs-6">
                                                    Lembre-se de que ao
                                                    desativar esta categoria de
                                                    solicitações, apenas os
                                                    objetos registrados nela
                                                    serão desativados, sem
                                                    impacto nos usuários
                                                    cadastrados.
                                                </p>

                                                <div className="row justify-content-center">
                                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                                        <input
                                                            className="btn rounded-5 my-3 p-2 mx-4 bg-disabled"
                                                            type="submit"
                                                            id=""
                                                            value="Cancelar"
                                                            data-bs-dismiss="modal"
                                                            aria-label="Close"
                                                        />
                                                    </div>
                                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                                        <input
                                                            className="btn rounded-5 my-3 p-2 mx-4 bg-active"
                                                            type="submit"
                                                            id=""
                                                            value="Confirmar"
                                                            onClick={() => { AlterarSolicitacao(Solicitacao) }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Inicio do Modal Delete Solicitações */}
                                <div
                                    className="modal-lg modal fade modal-lg"
                                    id="modalDeleteSolicitacoes"
                                    tabIndex="-1"
                                    aria-labelledby="entrarContaLabel"
                                    aria-hidden="true"
                                >
                                    <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content container">
                                            <div className="row justify-content-end m-2">
                                                <button
                                                    type="button"
                                                    className="btn-close"
                                                    data-bs-dismiss="modal"
                                                    aria-label="Close"
                                                    id={'modalCloseDSO'}

                                                ></button>
                                            </div>

                                            <strong>
                                                <h4 className="fw-bold text-center title-sa3">
                                                    Excluindo Solicitação
                                                </h4>
                                            </strong>

                                            <strong>
                                                <h4 className="fw-bold text-center">
                                                    Tem certeza que deseja
                                                    excluir esta solicitação?
                                                </h4>
                                            </strong>

                                            <div className="card-modal-delete mb-3 px-5">
                                                <div className="row fs-6 fw-bolder">
                                                    <div className="col-md-6">
                                                        Nome da solicitação
                                                    </div>
                                                    <div className="col-md-6 text-center">
                                                        Status
                                                    </div>
                                                </div>
                                                <div className="row fs-5 text-muted mt-2">
                                                    <div className="col-md-6">
                                                        {Solicitacao ? Solicitacao.tipo_solicitacao : ''}
                                                    </div>
                                                    <div className="col-md-6 text-center">
                                                        <span className={Solicitacao ? Solicitacao.status_solicitacao === 1 ? "bg-active py-2 px-4" : "bg-disabled py-2 px-4" : null}

                                                        >
                                                            {Solicitacao ? Solicitacao.status_solicitacao === 1 ? 'ativo' : 'inativo' : null}

                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row justify-content-center">
                                                <div className="col-lg-6 col-md-6 col-sm-6">
                                                    <input
                                                        className="btn rounded-5 my-3 p-2 mx-4 bg-disabled"
                                                        type="submit"
                                                        id=""
                                                        value="Cancelar"
                                                        data-bs-dismiss="modal"
                                                        aria-label="Close"
                                                    />
                                                </div>
                                                <div className="col-lg-6 col-md-6 col-sm-6">
                                                    <input
                                                        className="btn rounded-5 my-3 p-2 mx-4 bg-active"
                                                        type="submit"
                                                        id=""
                                                        value="Confirmar"
                                                        onClick={() => { DeleteSolicitacao(Solicitacao) }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <!-- SETORES --> */}
                                {/* <!-- Inicio do Modal Edit Setores --> */}
                                <div
                                    className="modal-lg modal fade"
                                    id="modalEditSetor"
                                    tabIndex="-1"
                                    aria-labelledby="entrarContaLabel"
                                    aria-hidden="true"
                                >
                                    <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content container">
                                            <div className="row justify-content-end m-2">
                                                <button
                                                    type="button"
                                                    className="btn-close"
                                                    data-bs-dismiss="modal"
                                                    aria-label="Close"
                                                    id={'modalCloseESE'}
                                                ></button>
                                            </div>

                                            <div className="text-center">
                                                <strong>
                                                    <h4 className="fw-bold text-center title-sa3">
                                                        Editando dados do setor
                                                    </h4>
                                                </strong>
                                            </div>

                                            <div className="container-sm p-4 px-5">
                                                <div className="my-3">
                                                    <label
                                                        htmlFor="nomeSetor"
                                                        className="form-label fw-bolder"
                                                    >
                                                        Nome do setor
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name=""
                                                        id="nomeSetor"
                                                        value={Setores ? Setores.nome_setor : ''}
                                                        className="form-control input-text"
                                                        placeholder="ex: Professor"
                                                        onChange={(e) => {
                                                            const nomeSetor = e.target.value
                                                            setSetores((prevState) => (
                                                                {
                                                                    ...prevState,
                                                                    nome_setor: nomeSetor
                                                                }
                                                            ))
                                                        }}
                                                    />
                                                </div>

                                                <p className="fs-6">
                                                    Ao cadastrar setores em uma
                                                    empresa, é essencial inserir
                                                    o nome do setor de forma
                                                    clara e
                                                    <strong>
                                                        sem erros ortográficos
                                                    </strong>
                                                    .
                                                </p>
                                                <p className="fs-6">
                                                    Garanta que o nome
                                                    corresponda fielmente à
                                                    designação oficial do{" "}
                                                    <strong>setor</strong> na
                                                    organização.
                                                </p>

                                                <div className="mt-5 mb-2">
                                                    <div className="card-modal-edit">
                                                        <div className="card-body row d-flex">
                                                            <p className="text-center fw-bolder my-2">
                                                                Status
                                                            </p>
                                                            <p className="text-center fs-6 text-muted">
                                                                como deseja
                                                                manter este
                                                                setor no
                                                                sistema?
                                                            </p>
                                                            <div className="d-flex justify-content-center mb-3">
                                                                <div className="form-check form-check-inline">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="AtivoSetor"
                                                                        id="AtivoSetor1"
                                                                        checked={Setores ? Setores.status_setor === 1 : false}
                                                                        onChange={() => {
                                                                            setSetores((prevState) => (
                                                                                {
                                                                                    ...prevState,
                                                                                    status_setor: 1
                                                                                }
                                                                            ))
                                                                        }}
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor="flexRadioDefault1"
                                                                    >
                                                                        Ativo
                                                                    </label>
                                                                </div>

                                                                <div className="form-check form-check-inline">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="InativoSetor"
                                                                        id="InativoSetor2"
                                                                        checked={Setores ? Setores.status_setor === 0 : false}
                                                                        onChange={() => {
                                                                            setSetores((prevState) => (
                                                                                {
                                                                                    ...prevState,
                                                                                    status_setor: 0
                                                                                }
                                                                            ))
                                                                        }}
                                                                    />




                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor="flexRadioDefault2"
                                                                    >
                                                                        Inativo
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <p className="text-muted text-center fs-6">
                                                    Lembre-se, ao destivar este
                                                    setor os usúario que já
                                                    estão cadastrados nele irão
                                                    ser dasativados também.
                                                </p>

                                                <div className="row justify-content-center">
                                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                                        <input
                                                            className="btn rounded-5 my-3 p-2 mx-4 bg-disabled"
                                                            type="submit"
                                                            id=""
                                                            value="Cancelar"
                                                            data-bs-dismiss="modal"
                                                            aria-label="Close"
                                                        />
                                                    </div>
                                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                                        <input
                                                            className="btn rounded-5 my-3 p-2 mx-4 bg-active"
                                                            type="submit"
                                                            id=""
                                                            value="Confirmar"
                                                            onClick=
                                                            {
                                                                () => {
                                                                    AlterarSetor(Setores);
                                                                }
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <!-- Inicio do Modal Delete Setores --> */}
                                <div
                                    className="modal-lg modal fade"
                                    id="modalDeleteSetor"
                                    tabIndex="-1"
                                    aria-labelledby="entrarContaLabel"
                                    aria-hidden="true"
                                >
                                    <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content container">
                                            <div className="row justify-content-end m-2">
                                                <button
                                                    type="button"
                                                    className="btn-close"
                                                    data-bs-dismiss="modal"
                                                    aria-label="Close"
                                                    id={'modalCloseDSE'}

                                                ></button>
                                            </div>

                                            <strong>
                                                <h4 className="fw-bold text-center title-sa3">
                                                    Excluindo um setor
                                                </h4>
                                            </strong>

                                            <strong>
                                                <h4 className="fw-bold text-center">
                                                    Tem certeza que deseja
                                                    excluir este setor?
                                                </h4>
                                            </strong>

                                            <div className="card-modal-delete mb-3 px-5">
                                                <div className="row fs-6 fw-bolder">
                                                    <div className="col-md-6 text-center">
                                                        Nome
                                                    </div>
                                                    <div className="col-md-6 text-center">
                                                        Status
                                                    </div>
                                                </div>
                                                <div className="row fs-5 text-muted mt-3">
                                                    <div className="col-md-6 text-center">
                                                        {Setores ? Setores.nome_setor : ''}
                                                    </div>
                                                    <div className="col-md-6 text-center">
                                                        <span className={Setores ? Setores.status_setor === 1 ? "bg-active py-2 px-4" : "bg-disabled py-2 px-4" : null}


                                                        >
                                                            {Setores ? Setores.status_setor === 1 ? 'ativo' : 'inativo' : null}

                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-6 col-md-6 col-sm-6 d-flex justify-content-around">
                                                    <input
                                                        className="btn rounded-5 my-3 p-2 mx-4 bg-disabled"
                                                        type="submit"
                                                        id=""
                                                        value="Cancelar"
                                                        data-bs-dismiss="modal"
                                                        aria-label="Close"
                                                    />
                                                </div>
                                                <div className="col-lg-6 col-md-6 col-sm-6 d-flex justify-content-around">
                                                    <input
                                                        className="btn rounded-5 my-3 p-2 mx-4 bg-active"
                                                        type="submit"
                                                        id=""
                                                        value="Confirmar"
                                                        onClick={() => { DeletarSetor(Setores) }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </main>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div >


        </>
    );
}

export default HomeAdm;
