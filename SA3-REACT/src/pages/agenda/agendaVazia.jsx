import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import '../../distt/themes/nano.min.css';
import Footer from '../../components/footer';
import ptLocale from '@fullcalendar/core/locales/pt';
import { format } from 'date-fns';
import Modal from 'react-modal';

import Header from '../../components/header';
import api from '../../servise/api';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function AgendaVazia() {

    const UserSession = JSON.parse(localStorage.getItem("user"));

    const navigate = useNavigate();

    const [isModalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [stateEvent] = useState(true);
    // const [bancoEvent, setbancoEvent] = useState(null)
    const [todasSalas, setTodasSalas] = useState(null)
    const [salaOps, setSalaOps] = useState('')
    const [solicitacoes, setSolicitacoes] = useState()
    const [solicitacaoOps, setSolicitacaoOps] = useState()
    const [AgendasFeitas, setAgendas] = useState([]);
    const [salaSelecionada, setSalaSelecionada] = useState(false)

    const [isModificado, setIsModificado] = useState(false);

    const modifica = () => setIsModificado(!isModificado);

    const [dadosDaAgenda, setDadosDaAgenda] = useState(false)


    const horaInicioRef = useRef('');
    const horaFimRef = useRef('');

    const [horaInicio, setHoraInicio] = useState('');
    const [horaFim, setHoraFim] = useState('');

    const diaInicioRef = useRef(null);
    const diaFimRef = useRef(null);
    const descricaoEventoRef = useRef(null);
    const calendarComponentRef = useRef(null);
    const titleRef = useRef(null);

    const [horaInicioValida, setHoraInicioValida] = useState(true);
    const [horaFimValida, setHoraFimValida] = useState(true);


    useEffect(() => {
        setTitle(titleRef.current.value);
    }, [title]);

    useEffect(() => {
        const fetchDataAgenda = async () => {


            // VARIAVEIS COM OS DADOS
            const empId = UserSession.emp
            try {
                const response = await api.post('/agendasala', { empId });

                //DADOS DA SALA
                setTodasSalas(response.data.message.Sala)

                //DADOS DA SOLICITACOES AGENDADAS


                //DADOS DOS AGENDAMENTOS
                setAgendas(response.data.message.Agenda);

                //DADOS DAS SOLICITACOES
                setSolicitacoes(response.data.message.Solicitacao)


            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    text: error.message || "Erro ao carregar os dados da agenda!",
                    showCancelButton: "Recarregar",
                }).then(
                    window.location.reload()
                )
            }

        };

        fetchDataAgenda();
    }, [isModificado]);

    useEffect(() => {
        const validarHoraInicio = (hora, setValida) => {

            const horarioInicioPadrao = "08:00";
            const horarioFimPadrao = "22:50";
            if (hora >= horarioInicioPadrao && hora <= horarioFimPadrao) {
                setHoraInicioValida(true);
            } else {
                setHoraInicioValida(false);
            }
        };
        const validarHoraFim = (hora, setValida) => {

            const horarioInicioPadrao = "08:00";
            const horarioFimPadrao = "22:50";
            if (hora >= horarioInicioPadrao && hora <= horarioFimPadrao) {
                setHoraFimValida(true);
            } else {
                setHoraFimValida(false);
            }
        };
        validarHoraInicio(horaInicioRef.current.value);
        validarHoraFim(horaFimRef.current.value);
    }, [horaInicioRef.current.value, horaFimRef.current.value]);



    useEffect(() => {
        if (AgendasFeitas) {

            setDadosDaAgenda(AgendasFeitas.filter(obj => obj.id_sala === parseInt(salaOps)));
        }
    }, [salaOps, AgendasFeitas]);

    const CurrDate = () => {
        return new Date();
    }

    // SELECIONAR UMA CAMPO DA AGENDA FAZ TUDO ISSO
    const Selected = (arg) => {
        // esvasiar todos os set
        setSolicitacaoOps('')
        if (!isModalVisible && salaOps === '') {
            Swal.fire({
                icon: 'warning',
                title: 'Você precisa selecionar um local!',
                text: 'Por favor, selecione uma sala!',
                timer: 2000,
            }).then(
                setSalaSelecionada(true)
            )
        } else {
            let diaInicio = arg.startStr;
            let diaFim = subtrairUmDia(arg.endStr);
            const horaInicio = "08:00";
            const horaFim = "08:00";
            // Define os valores padrões dos campos no modal
            horaInicioRef.current.value = horaInicio;
            horaFimRef.current.value = horaFim;
            diaInicioRef.current.value = diaInicio;
            diaFimRef.current.value = diaFim;
            descricaoEventoRef.current.value = '';
            titleRef.current.value = ''; // Limpa o campo título
            // Abre o modal e salva as informações do argumento para uso posterior se necessário
            setModalVisible(true);
            setSalaSelecionada(false)
        }
    }

    // APOS MODAL SER SALVO DO CRIAÇÃO DE AGENDA FAZ ISSO
    const saveEventFromModal = () => {
        // Pega os valores dos campos do modal
        const titulo = titleRef.current.value;
        const inicio = `${diaInicioRef.current.value}T${horaInicio}`;
        const fim = `${diaFimRef.current.value}T${horaFim}`;
        const descricaoEvento = `${descricaoEventoRef.current.value}`;


        // Se algum campo obrigatório estiver vazio, você pode querer mostrar uma mensagem de erro
        if (!titulo || !inicio || !fim) {
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'Preencha todos os dados!',
                showConfirmButton: 'Ok',
            });

        } else if (titulo != null && titulo.length >= 25) {
            Swal.fire({
                icon: 'warning',
                title: 'Erro...',
                text: 'Titulo muito grande!',
                showConfirmButton: 'Ok',
            })
        } else if (descricaoEvento != null && descricaoEvento.length >= 49) {
            Swal.fire({
                icon: 'warning',
                title: 'Erro...',
                text: 'Descrição muito grande!',
                showConfirmButton: 'Ok',
            })

        } else if (diaInicioRef.current.value > diaFimRef.current.value || horaInicioRef.current.value > horaFimRef.current.value) {
            Swal.fire({
                icon: 'info',
                title: 'Atenção!',
                text: 'Você definiu uma data de término anterior à data de início.',
            });
        } else {
            // Cria um novo evento com as informações do modal
            const eventosCriados = criarEventosSeparados(titulo, inicio, fim, descricaoEvento);
            // Adiciona os eventos criados à lista de eventos existente
            // Fecha o modal após a criação do evento
            eventosCriados.forEach(async (evento) => {
                try {

                    const tratadoHoraInicio = evento.start.toString().split("T")[1];
                    const tratadoDataInicio = evento.start.toString().split("T")[0];
                    const tratadoHoraFinal = evento.end.toString().split("T")[1];

                    const dados = {
                        idSol: solicitacaoOps ? solicitacaoOps : null,
                        idSala: salaOps,
                        idUsu: UserSession.usu,
                        agenda: tratadoDataInicio,
                        inicio: tratadoHoraInicio,
                        fim: tratadoHoraFinal,
                        nome: evento.title,
                        desc: evento.extendedProps.description,
                    }
                    const res = await api.post('/cadastroagenda', dados);
                    if (res.data.confirma) {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Agendamento realizado com sucesso!',
                            showConfirmButton: true,
                        }).then(() => {
                            // window.location.reload();
                            modifica();
                        })
                        setModalVisible(false);
                    } else {
                        Swal.fire({
                            position: 'center',
                            icon: 'warning',
                            title: 'Agendamento não realizado!',
                            text: 'Você tentou cadastra um agendamento em uma data que já tem agendamento!',
                            showConfirmButton: true,
                        }).then(() => {
                            // window.location.reload();
                            modifica();
                        })
                        setModalVisible(false);
                    }


                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro ao cadastrar o evento',
                        text: 'Por favor, tente novamente mais tarde.',
                        showConfirmButton: true,
                    });
                }
            });

        }
    };

    // CRIA TODOS EVENTOS - ATÉ MESMO SEPARADOS
    const criarEventosSeparados = (titulo, inicio, fim, descricaoEvento) => {
        const eventosCriados = [];
        const dataInicio = new Date(inicio);
        const dataFim = new Date(fim);
        while (dataInicio <= dataFim) {
            const novoEvento = {
                idUsu: UserSession ? UserSession.usu : '',
                title: titulo,
                start: format(dataInicio, "yyyy-MM-dd'T'HH:mm:ss"),
                end: format(dataInicio, "yyyy-MM-dd'T'") + format(dataFim, "HH:mm:ss"),
                allDay: false,
                extendedProps: {
                    description: descricaoEvento ? descricaoEvento : 'Sem descrição',
                    state: stateEvent,
                },
            };

            eventosCriados.push(novoEvento);
            dataInicio.setDate(dataInicio.getDate() + 1);
        }
        return eventosCriados;
    };

    const [onClose, setOnClose] = useState(false);


    //BOTAO EXCLUIR
    const handleDelete = async (IdAgenda) => {
        try {
            const res = await api.delete(`/deletaragenda/${IdAgenda}`)
            if (res.data.confirma) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: `Exclusão realizada com sucesso!`,
                    showConfirmButton: "Voltar",
                }).then(() => {
                    setIsModificado(!isModificado);
                    setOnClose(!onClose)
                }
                )
            }

        } catch (error) {
            Swal.fire({
                icon: 'warning',
                title: "Falha",
                text: `tente novamente mais tarde`,
                showConfirmButton: "Voltar",
            })
        }

    };
    const handleCancelarAgenda = async (IdAgenda) => {
        try {
            const res = await api.patch(`/cancelaragenda/${IdAgenda}`)
            if (res.data.confirma) {
                Swal.fire({
                    position: 'center',
                    icon: 'info',
                    title: `Agendamento cancelado com sucesso!`,
                    showConfirmButton: "Voltar",
                }).then(() => {
                    setIsModificado(!isModificado);
                    setOnClose(!onClose)
                })
            }

        } catch (error) {
            Swal.fire({
                icon: 'warning',
                text: 'Erro ao cancelar agendamento!',
                showCancelButton: "Voltar",
            })
        }
    };

    const modalAgenda = () => setOnClose(!onClose);



    const CustomModal = ({ isOpen, onClose, eventInfo }) => {
        const modalStyles = {
            content: {
                width: '30%',
                height: '62%',
                margin: 'auto',
                backgroundColor: '#f8f8f8',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            },

            overlay: {
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1000,
            },
        };

        return (
            <Modal isOpen={isOpen} onRequestClose={onClose} style={modalStyles} >


                {/* Conteúdo do modal com base nos dados do card */}
                <div className="row d-flex justify-content-end">
                    <button
                        type="button"
                        className="btn-close"
                        data-dismiss="modal"
                        onClick={() => modalAgenda(false)}
                    ></button>
                </div>

                <div className="text-center">
                    <strong>
                        <h4 className="fw-bold fs-5 text-center">
                            Informações sobre o agendamento
                        </h4>
                    </strong>
                </div>

                <div className="container-sm px-2">
                    <div className="row">
                        <div className="col-6 text-center ">
                            <div className="my-3">
                                <div className="fs-5 fw-bold mb-2 text-truncate ">Titulo</div>
                                <div className="">
                                    <p>{eventInfo.title}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="my-3">
                                <div className="fs-5 fw-bold my-2 text-center ">Status</div>
                                {UserSession && (
                                    <div className="row d-flex justify-content-center">
                                        <div
                                            className={`fs-5 text-center w-50 text-white bg-primary bg-gradient ${eventInfo._def.extendedProps.state === 1 ? "bg-success opacity-75" : "bg-danger opacity-75"}`}
                                            style={{ borderRadius: '50px' }}
                                        >
                                            {eventInfo._def.extendedProps.state === 1 ? "ativo" : "cancelado"}
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>

                    <div className="row text-center fw-bolder fs-6 fw-medium">
                        <div className="col-6">
                            <p>Horário de inicio</p>
                        </div>
                        <div className="col-6">
                            <p>Horário de encerramento</p>
                        </div>
                    </div>
                    <div className="row fw-bolder fs-4">
                        <div className="d-flex justify-content-center text-center">
                            <div className="col-6">
                                <div className="d-flex justify-content-center text-center">
                                    <div className="col-4 text-center mx-1">
                                        <span className="badge bg-black  text-white fs-4" id="hora_inicial" >
                                            {new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(eventInfo.start))}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="d-flex justify-content-center text-center">
                                    <div className="col-4 text-center mx-1">
                                        <span className="badge text-black border border-2 border-secondary  fs-4" id="hora_inicial">
                                            {new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(eventInfo.end))}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="my-2">
                        <div className="fs-5 fw-bold text-center ">Descrição</div>
                        <p className='text-center'>
                            {UserSession && (
                                UserSession.tipo === 0 ?
                                    eventInfo._def.extendedProps.description :
                                    (UserSession.tipo === 1 && UserSession.usu === eventInfo._def.extendedProps.id_usuario) ?
                                        eventInfo._def.extendedProps.description :
                                        "Descrição de outro usuário do sistema - você não tem acesso"
                            )}
                        </p>
                    </div>
                    <hr style={{ borderWidth: 1, borderColor: "gray" }} />
                    <div className="row">
                        <div className="mb-3 text-center ">
                            <div className="fs-5 fw-bold my-2">agendamento do usuario</div>

                            <div className="d-flex justify-content-center align-items-center">
                                <div className="align-items-center">
                                    <p className=" w-100 title-sa3 p-1 fs-6 fw-bold mb-0 text-truncate text-center" style={{ borderRadius: 50 }}>
                                        {eventInfo._def.extendedProps.usu_nome}
                                    </p>
                                    <p className="text-muted mb-0 text-truncate">
                                        <a href={`mailto:${eventInfo._def.extendedProps.usu_email}`} >
                                            {eventInfo._def.extendedProps.usu_email}
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row justify-content-center align-content-end ">


                        {//Se for do usuario aparece o botao excluir
                            UserSession.usu === eventInfo._def.extendedProps.id_usuario
                                ? (
                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                        <input
                                            className="btn rounded-5 my-3 p-2 w-100 bg-warning fw-bold "
                                            type="submit"
                                            id=""
                                            onClick={() => { handleDelete(eventInfo._def.extendedProps.id_agenda) }} // Substitua 'handleDelete' com a função apropriada
                                            value="Excluir"
                                        />
                                    </div>
                                ) : UserSession.tipo === 0 ? (
                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                        <input
                                            className="btn rounded-5 my-3 p-2 w-100 text-white bg-danger fw-bold "
                                            type="submit"
                                            id=""
                                            onClick={() => { handleCancelarAgenda(eventInfo._def.extendedProps.id_agenda) }} // Substitua 'handleDelete' com a função apropriada
                                            value="Cancelar agendamento"
                                        />
                                    </div>


                                ) : (
                                    <div className="row justify-content-center align-content-end ">
                                        {UserSession && (
                                            <div className="col-lg-6 col-md-6 col-sm-6">
                                                <input
                                                    className="btn rounded-5 my-3 p-2  w-100 bg-disabled"
                                                    type="submit"
                                                    id=""
                                                    value="Fechar"
                                                    data-dismiss="modal"
                                                    onClick={() => modalAgenda(false)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )
                        }
                    </div>
                </div>
            </Modal >
        );
    };

    const EventItem = ({ info }) => {
        const { event } = info;
        const [isModalOpen, setIsModalOpen] = useState(false);

        const openModal = () => {
            setIsModalOpen(true);
        };

        const closeModalInfo = () => {
            setIsModalOpen(false);
        };

        return (
            <div onClick={openModal} style={{
                width: "100%",
                height: 30,
                paddingTop: 5,
                color: '#fff',
                fontWeight: '600',
                borderRadius: 10,
                backgroundColor:
                    UserSession //se user session existir 
                        ? event._def.extendedProps.state === 0 // se o status do agendamento for inativo
                            ? "rgba(255,0,0,1)" // QUANDO ESTA DESATIVADO
                            : event._def.extendedProps.id_usuario === UserSession.usu //se o id do usuario for igual o do agendamento
                                ? '#3BD5F7'// COR DO CARD - É MEU
                                : '#7141FA' // COR DO CARD - QUANDO NÃO É MEU
                        : '' //se userSession não existir
            }}>
                <div className="row mx-0">
                    <p className='text-truncate'>{event.title}</p>
                </div>
                <CustomModal isOpen={isModalOpen} onClose={closeModalInfo} eventInfo={event} />
            </div>
        );
    };



    const FormatDateTime = (data, formato) => {
        if (formato === "yyyy-MM-dd") {
            const dia = String(data.getDate()).padStart(2, '0');
            const mes = String(data.getMonth() + 1).padStart(2, '0');
            const ano = data.getFullYear();
            return `${ano}-${mes}-${dia}`;
        }
        // Adicione outras formatações conforme necessário
        return data.toISOString(); // formato padrão se nenhum formato conhecido for fornecido
    }

    const dataFormatada = FormatDateTime(CurrDate(), "yyyy-MM-dd");

    // Função para subtrair um dia
    const subtrairUmDia = (dataStr) => {
        let data = new Date(dataStr);
        data.setDate(data.getDate() - 1);
        return data.toISOString().split("T")[0];
    }

    // Função conta os digitos da hora
    const closeModal = () => {
        setModalVisible(false);
    };

    function handleNavigate() {
        if (UserSession && UserSession.tipo === 0) {
            navigate("/homeadm");
        } else if (UserSession && UserSession.tipo === 1) {
            navigate("/homeuser");
        } else {
            navigate('/');
        }
    }

    // AQUI VAI SER ONDE ELE VAI CLICAR ABRIR O MODAL PARA VER AS INFORMAÇÕES
    const handleEventClick = (info) => {
    };


    return (
        <>
            <Header />

            <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} >
                <div className="row d-flex justify-content-center">
                    <h1 className="text-center">Meu agendamento</h1>
                    <nav aria-label="breadcrumb my-5">
                        <ol className="breadcrumb fs-6">
                            <li className="breadcrumb-item fw-regular text-info">
                                {/*eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                <a onClick={handleNavigate}>Início</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Meu agendamento</li>
                        </ol>
                    </nav>
                    <div className="col-6  p-3">
                        <div className="form-floating text-center mx-auto">
                            <select
                                className={`form-select d-block mx-auto ${salaSelecionada ? "border-danger" : ''}`}
                                id="floatingSelect"
                                aria-label="Floating label select example"

                                onChange={(e) => {
                                    const values = e.target.value;
                                    setSalaOps(values);
                                    setSalaSelecionada(false)

                                    // Verifica se o valor selecionado é vazio
                                    if (!values) {
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'Oops...',
                                            text: 'Por favor, selecione uma sala!',
                                        });
                                    }
                                }}
                                value={salaOps}
                            >
                                <option disabled hidden value="" className="d-none">
                                    Selecione a Sala
                                </option>
                                {todasSalas
                                    ? todasSalas.map((sala) => (
                                        <option
                                            key={sala.id_sala}
                                            value={sala.id_sala}
                                        >
                                            {sala.nome_sala} {sala.num_sala}
                                        </option>
                                    ))
                                    : null}
                            </select>

                            <label htmlFor="floatingSelect" className="mx-auto">
                                Escolha um espaço
                            </label>



                        </div>

                    </div>
                    <div className="col-3 pt-3">
                        <div className="row d-flex align-content-center align-self-center align-items-center">
                            <div className="col-2">
                                <span style={{ backgroundColor: '#3BD5F7', height: '15px' }} className="badge w-100"> </span>
                            </div>
                            <div className="col-8 fs-6">
                                <small>
                                    Meus agendamentos
                                </small>
                            </div>
                        </div>
                        <div className="row d-flex align-content-center align-self-center align-items-center">
                            <div className="col-2">
                                <span style={{ backgroundColor: '#7141FA', height: '15px' }} className="badge w-100"> </span>
                            </div>
                            <div className="col-8 fs-6">
                                <small>
                                    Agendas de outros usuarios
                                </small>
                            </div>
                        </div>
                        <div className="row d-flex align-content-center align-self-center align-items-center">
                            <div className="col-2">
                                <span style={{ backgroundColor: 'rgba(255,0,0,1)', height: '15px' }} className="badge w-100"> </span>
                            </div>
                            <div className="col-8 fs-6">
                                <small>
                                    Agendamentos cancelados
                                </small>
                            </div>
                        </div>

                    </div>
                </div>


                <div className="row">
                    <div className="shadow-sm h-md-250 position-relative">
                        <div className="p-4 d-flex flex-column position-static">

                            <div className="mb-1 text-dark d-flex justify-content-center">
                                <p id="data-formatada"></p>
                            </div>
                            <FullCalendar
                                initialView='dayGridMonth'
                                themeSystem='bootstrap5'
                                ref={calendarComponentRef}
                                views={["dayGridMonth", "dayGridWeek", "dayGridDay"]}
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                headerToolbar={{
                                    left: 'prev,next today',
                                    center: 'title',
                                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                                }}
                                eventContent={(info) => <EventItem info={info} />}
                                locale={ptLocale}
                                initialDate={dataFormatada}
                                navLinks={true}
                                selectable={true}
                                selectMirror={false}
                                events={dadosDaAgenda}
                                select={Selected}
                                eventClick={handleEventClick}
                                // eventAdd={handleSaveEvent}
                                editable={false}
                                dayMaxEvents={true} // allow "more" link when too many events
                                eventBorderColor={'gray'}
                            />
                        </div>
                    </div>
                </div>
            </div >


            {/* MODAL AQUI */}

            < div style={{ display: isModalVisible ? 'block' : 'none' }} className={`modal-log modal fade modal ${isModalVisible ? 'show' : ''}`} id="exampleModal" tabIndex="-1" labelledby="exampleModal" modal="true" role="dialog" >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="container">

                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Adicionar evento</h1>
                                <button type="button" id="btn-close" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body">
                                <div className="text-center text-danger fw-bold fs-6">
                                    Local aberto das 08:00 às 22:50
                                </div>
                                <div className="row my-3">
                                    <div className="col-md-12 col-sm-12">
                                        <div className="fs-5 fw-bold">Título *</div>
                                        <input ref={titleRef} className="form-control input-text" placeholder={`ex: "Reunião", "Aula de Matemática", etc.`} type="text" name="" id="EventNew" />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <label htmlFor="data-inicial" className='fs-6 fw-bold my-2'>Data inicial *</label>
                                        <input ref={diaInicioRef} className="form-control date-group input-text bg-opacity-25 bg-info fw-semibold " type="date" name="" id="diaInicio"
                                            placeholder="dia de inicio" />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="data-inicial" className='fs-6 fw-bold my-2'>Hora inicial *</label>
                                        <input
                                            onChange={(e) => setHoraInicio(e.target.value)}
                                            value={horaInicio}
                                            ref={horaInicioRef}
                                            className={`form-control ${horaInicioValida} fw-semibold  input-text text-white input-text bg-opacity-50 bg-dark`}
                                            type="time"
                                            min="08:00"
                                            max="22:50"
                                        />
                                        <span>{horaInicioValida}</span>
                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <label htmlFor="data-inicial" className='fs-6 fw-bold'>Data final *</label>
                                        <input

                                            ref={diaFimRef}
                                            className="form-control date-group input-text bg-opacity-25 bg-info fw-semibold "
                                            type="date"
                                            name=""
                                            id="diaFim"
                                            placeholder="dia de inicio" />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="data-inicial" className='fs-6 fw-bold '>Hora final *</label>
                                        <input
                                            onChange={(e) => setHoraFim(e.target.value)}
                                            value={horaFim}
                                            ref={horaFimRef}
                                            className={`form-control ${horaFimValida} fw-semibold  text-white input-text bg-opacity-50 bg-dark`}
                                            type="time"
                                            min="08:00"
                                            max="22:50"
                                        />
                                        <span>{horaFimValida}</span>
                                    </div>
                                </div>
                                <hr style={{ borderWidth: 2, borderColor: '#000', borderRadius: 50 }} />
                                <div className="row">
                                    <div className="col-md-12 text-center text-muted">
                                        (opcional)
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12 col-sm-12 py-2">
                                        <div className="fs-5 text-center fw-bold my-2">Solicitação de Recurso</div>
                                        <select
                                            className="form-select input-text"
                                            id="inputGroupSelect01"
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setSolicitacaoOps(value);
                                            }}
                                            value={solicitacaoOps}
                                        >
                                            <option disabled value="" hidden>Selecione uma solicitação</option>
                                            {solicitacoes && solicitacoes.length > 0 && solicitacoes.map(sol => (
                                                <option
                                                    key={sol.id_solicitacoes}
                                                    value={sol.id_solicitacoes}
                                                >
                                                    {sol.tipo_solicitacao}
                                                </option>
                                            ))}
                                        </select>

                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-12 col-sm-12 my-2">
                                        <div className="fs-5 fw-bold text-center">Descrição</div>
                                        <input
                                            ref={descricaoEventoRef}
                                            type="textarea"
                                            placeholder="Digite aqui..."
                                            rows="4"
                                            cols="30"
                                            className="form-control input-text" id="descricaoEvento"

                                        />
                                    </div>
                                </div>
                                <hr style={{ borderWidth: 2, borderColor: '#000', borderRadius: 50 }} />

                                <div className="row my-2">
                                    <div className="col-md-6 col-sm-12 d-flex justify-content-start">
                                        <button onClick={closeModal} data-bs-dismiss="modal" className="btn bg-disabled">Cancelar</button>
                                    </div>
                                    <div className="col-md-6 col-sm-12 d-flex justify-content-end">
                                        <button onClick={saveEventFromModal} className="btn bg-active" id="SaveEvent">Cadastrar Evento</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </div >

            <div id="mostra-backdrop" style={{ display: isModalVisible ? 'block' : 'none' }} className={`modal-backdrop fade ${isModalVisible ? 'show' : ''}`}></div>
            <Footer />
        </>
    );
}

export default AgendaVazia;
