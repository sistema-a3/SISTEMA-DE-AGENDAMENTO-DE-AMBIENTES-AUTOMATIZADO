import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Calendarsvg from '../../../img/svg/Calendar.svg';
import api from '../../../servise/api/index'
import Footer from '../../../components/footer';
// import logo from "../../../img/svg/logo.svg";
import Header from '../../../components/header';
import Swal from 'sweetalert2';

function HomeUser() {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const dataAtual = new Date();

    // const [timelineDataa, setTimelineData] = useState([]);
    const [responseDates, setResponseDates] = useState([]);


    const UserSession = JSON.parse(localStorage.getItem('user'))

    const navigate = useNavigate();

    function abrirPage(rota) {
        navigate(rota);
    }

    const [isModalVisible, setModalVisible] = useState(false);
    const [isModificado, setIsModificado] = useState(false);

    const modifica = () => setIsModificado(!isModificado);

    useEffect(() => {

        const fetchData = async () => {
            if (UserSession) {
                try {
                    const usuId = UserSession.usu;

                    const response = await api.post('/agendausuario', { usuId });
                    setResponseDates(response.data.message);

                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: "Entre em contato com o suporte.",
                        showConfirmButton: "ok",
                    })
                }
            };
        }

        fetchData();
    }, [isModificado, UserSession]);



    const [dataFormatada, setDataFormatada] = useState('');

    const excluirAgenda = async (e) => {
        try {
            const res = await api.delete(`/deletaragenda/${e}`);
            if (res.data.confirma) {
                Swal.fire({
                    icon: 'success',
                    title: `Exclusão`,
                    text: 'Agendamento deletado com sucesso',
                    showConfirmButton: 'Ok',
                    timer: 1500
                })
                modifica();
                fecharModal()
            }
        } catch (error) {
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: error.response.data.message,
            })

        }
    }

    useEffect(() => {
        // Inicialização dos arrays dentro do useEffect
        const diasDaSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
        const mesesDoAno = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

        const diaDaSemana = diasDaSemana[dataAtual.getDay()];
        const diaDoMes = dataAtual.getDate();
        const mes = mesesDoAno[dataAtual.getMonth()];
        const ano = dataAtual.getFullYear();
        setDataFormatada(`${diaDaSemana}, ${diaDoMes} de ${mes} de ${ano}`);
        // eslint-disable-next-line no-use-before-define
    }, [dataAtual]);



    function getNomeDoMesAbreviada(data) {
        const mesesDoAno = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        const dataAgenda = new Date(data);
        const mesNumeros = dataAgenda.getMonth();
        return mesesDoAno[mesNumeros];
    }

    function getNomeDoMes(data) {
        const meses = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];

        const mesesNumeros = {};

        for (let i = 1; i <= 12; i++) {
            mesesNumeros[i] = meses[i - 1];
        }

        const dataAgenda = new Date(data);
        const mesNumero = dataAgenda.getMonth();
        return meses[mesNumero + 1];
    }

    function groupByYearAndMonth(data) {
        return data.reduce((acc, item) => {
            const date = new Date(item.data_agenda);
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate(); // Obtém o dia

            if (!acc[year]) {
                acc[year] = {};
            }

            if (!acc[year][month]) {
                acc[year][month] = {};
            }

            if (!acc[year][month][day]) {
                acc[year][month][day] = [];
            }

            acc[year][month][day].push(item);

            return acc;
        }, {});
    }

    function renderTimelineData(data, dataAtual, abrirModal) {
        const filteredData = data.filter((evento) => new Date(evento.data_agenda) < dataAtual);
        const groupedData = groupByYearAndMonth(filteredData);

        return Object.keys(groupedData)
            .sort((a, b) => b - a)
            .map((year) => (
                <div key={year}>
                    <h2>{year}</h2>
                    {Object.keys(groupedData[year])
                        .sort((a, b) => b - a)
                        .map((month) => (
                            <div key={month}>
                                <span className='fs-6 text-muted'>{getNomeDoMes(month)}</span>
                                <div className="row">
                                    {Object.keys(groupedData[year][month])
                                        .sort((a, b) => a - b) // Ordene os dias em ordem crescente
                                        .map((day) => (
                                            groupedData[year][month][day].map((item, index) => (
                                                <div className="col-lg-4 col-md-4 my-3" key={index}>
                                                    <div className="card p-3 d-flex align-items-center" onClick={() => abrirModal(item)}>
                                                        <div className='mx-2 col-1 text-center text-white bg-warning ' style={{ borderRadius: '50px' }}>
                                                            <div className="">{day} </div>
                                                        </div>
                                                        <div className='mx-2 col-10 text-center' style={{ borderRadius: '50px' }}>
                                                            <div className="fs-6 text-muted">{item.nome_reserva}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ))}
                                </div>
                            </div>
                        ))}
                </div>
            ));
    }

    function renderEvento(e, dataAtual, abrirModal) {
        return (
            <div key={e.id_agenda} className="col-lg-3 col-md-3 col-sm-12 my-3" onClick={() => abrirModal(e)}>
                <div className="card p-3">
                    <div className="card-body">
                        <div className="col-12">
                            <h4 className="card-title">{e.nome_reserva}</h4>
                        </div>
                        <p className="card-text col-12">{e.desc_reserva}</p>
                        <div className="row">
                            <div className="col-2">
                                <i className="fa-regular fa-calendar-days fa-sm"></i>
                            </div>
                            <div className="col-3">
                                {e.data_agenda.split("T")[0].split("-")[2]}
                            </div>
                            <div className="col-7">
                                {getNomeDoMesAbreviada(e.data_agenda)}, {e.data_agenda.split("-")[0]}
                            </div>
                        </div>
                        <div className="row my-2">
                            <p
                                className={
                                    e.status_agenda === 1
                                        ? "bg-success opacity-75 text-white w-50"
                                        : "bg-danger opacity-75 text-white w-50"
                                }
                                style={{ borderRadius: '50px' }}
                            >
                                {e.status_agenda === 1 ? "agendado" : "cancelado"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    function renderEventos(responseDates, dataAtual, abrirModal) {
        return responseDates
            .filter((e) => new Date(e.data_agenda) >= dataAtual)
            .map((e, index) => renderEvento(e, dataAtual, abrirModal));
    }

    const [eventoSelecionado, setEventoSelecionado] = useState(null);
    const [modalVisivel, setModalVisivel] = useState(false);


    function abrirModal(evento) {
        setEventoSelecionado(evento);
        setModalVisible(true);
        setModalVisivel(true);
    }

    function fecharModal() {
        setEventoSelecionado(null);
        setModalVisivel(false);
        setModalVisible(false);

    }



    return (
        <>
            <Header />

            <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} >
                <main className="mx-5">
                    <div className="row logo ">
                        <div className=" imgfundo col-lg-4 d-lg-block d-md-block my-2 d-none ">
                            <img
                                src={Calendarsvg}
                                alt="Calendario"
                                width="420px "
                            />
                        </div>
                        <div className="col-lg-7 d-lg-block d-md-block text-ce col-md-7 p-5 justify-content-center text-center fs-4 ">
                            <h1>Bem-vindo(a) {UserSession ? UserSession.nome : ''} </h1>
                            <p className="text-center text-secondary">
                                {UserSession ? UserSession.nomeEmpresa : ''}

                            </p>
                            <div className='fs-6 text-dark text-center rounded-2 fs-4 custom-bg-color' id="data-formatada">
                                {dataFormatada}
                            </div>
                            <div className="sub-title text-center p-3">
                                <div className="fs-2">Ambiente do Usuário</div>
                            </div>

                            <div className="page-header text-center align-content-center ">
                                <div className="fs-5 mb-4">Atividades Recentes</div>
                            </div>

                            <div className="row">
                                <div className="d-flex justify-content-center">
                                    <div style={{ backgroundColor: "#78D6E3" }} onClick={() => abrirPage("/agenda")} className="button_personalizado w-22 text-center ">Criar evento</div>
                                </div>
                            </div>


                        </div>
                        {/* <div className='col-5'>

                        </div> */}

                    </div>



                    <div className="container">
                        <div className="row">
                            {responseDates && renderEventos(responseDates, dataAtual, abrirModal)}
                        </div>

                        <div className="row">
                            {responseDates && renderTimelineData(responseDates, dataAtual, abrirModal)}
                        </div>

                        {/* Modal */}
                        {modalVisivel && eventoSelecionado && (
                            <>
                                <div className={`modal fade ${modalVisivel ? 'show' : ''}`} id="modalCardAgendamento" tabIndex="-1" role="dialog" aria-labelledby={`modalCardAgendamento1`} aria-hidden={!modalVisivel} style={{ display: modalVisivel ? 'block' : 'none' }}>
                                    <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content container">
                                            <div className="row justify-content-end m-2">
                                                <button
                                                    type="button"
                                                    className="btn-close"
                                                    data-dismiss="modal" onClick={fecharModal}
                                                ></button>
                                            </div>

                                            <div className="text-center">
                                                <strong>
                                                    <h4 className="fw-bold fs-4 text-center">
                                                        Informações sobre o agendamento
                                                    </h4>
                                                </strong>
                                            </div>

                                            <div className="container-sm p-4 px-5">
                                                <div className="my-3">
                                                    <div className="fs-4 fw-bold">Titulo</div>
                                                    <div className="">
                                                        <p>{eventoSelecionado?.nome_reserva}</p>
                                                    </div>
                                                </div>
                                                <div className="my-3">
                                                    <div className="fs-4 fw-bold">Descrição</div>
                                                    <p>{eventoSelecionado?.desc_reserva}</p>
                                                </div>
                                                <div className="my-3">
                                                    <div className="fs-4 fw-bold">Ambiente Cadastrado</div>
                                                    <p>{eventoSelecionado?.nome_sala} {eventoSelecionado ? eventoSelecionado?.num_sala : ""}</p>
                                                </div>
                                                <div className="my-3">
                                                    <div className="fs-4 fw-bold">Data agendada</div>
                                                    <div className="row my-2">
                                                        <div className="col-4 fw-bold text-center text-white d-flex justify-content-center" >
                                                            <div className='bg-dark col-8' style={{ borderRadius: '50px' }}>
                                                                dia
                                                            </div>
                                                        </div>
                                                        <div className="col-4 fw-bold text-center text-white d-flex justify-content-center" >
                                                            <div className='bg-info col-8' style={{ borderRadius: '50px' }}>
                                                                mês
                                                            </div>
                                                        </div>
                                                        <div className="col-4 fw-bold text-center text-white d-flex justify-content-center" >
                                                            <div className='bg-warning  col-8' style={{ borderRadius: '50px' }}>
                                                                ano
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-4 text-center fs-4">{eventoSelecionado?.data_agenda.split("T")[0].split("-")[2]}</div>
                                                        <div className="col-4 text-center fs-4">{eventoSelecionado?.data_agenda.split("T")[0].split("-")[1]}</div>
                                                        <div className="col-4 text-center fs-4">{eventoSelecionado?.data_agenda.split("T")[0].split("-")[0]}</div>
                                                    </div>
                                                </div>
                                                <div className="my-3">
                                                    <div className="fs-4 fw-bold text-center my-2">Status</div>
                                                    {eventoSelecionado && (
                                                        <div className="row d-flex justify-content-center">
                                                            <div className={`fs-5 text-center w-50 text-white ${new Date(eventoSelecionado.data_agenda.split("T")[0]) < dataAtual ? "bg-primary bg-gradient" : (eventoSelecionado.status_agenda === 1 ? "bg-success opacity-75" : "bg-danger opacity-75")}`} style={{ borderRadius: '50px' }}>
                                                                {new Date(eventoSelecionado.data_agenda.split("T")[0]) < dataAtual ? "Realizado" : (eventoSelecionado.status_agenda === 1 ? "Agendado" : "Cancelado")}
                                                            </div>
                                                        </div>
                                                    )}

                                                </div>

                                                <div className="modal-footer">
                                                </div>
                                                <div className="row justify-content-center">
                                                    {eventoSelecionado && (
                                                        <div className="col-lg-6 col-md-6 col-sm-6">
                                                            <input
                                                                className="btn rounded-5 my-3 p-2 mx-0 w-100 bg-disabled"
                                                                type="submit"
                                                                id=""
                                                                value="Fechar"
                                                                data-dismiss="modal"
                                                                onClick={fecharModal}
                                                            />
                                                        </div>
                                                    )}

                                                    {eventoSelecionado && new Date(eventoSelecionado.data_agenda.split("T")[0]) >= dataAtual && (
                                                        <div className="col-lg-6 col-md-6 col-sm-6">
                                                            <input
                                                                className="btn rounded-5 my-3 p-2 mx-2 w-100 bg-warning fw-bold "
                                                                type="submit"
                                                                id=""
                                                                value="Excluir"

                                                                onClick={() => excluirAgenda(eventoSelecionado.id_agenda)}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </>
                        )}
                    </div>
                </main >
            </div >

            {
                <div id="mostra-backdrop" style={{ display: isModalVisible ? 'block' : 'none' }} className={` ${isModalVisible ? 'show modal-backdrop fade' : ''}`}></div>
            }
            <Footer />
        </>
    );
}

export default HomeUser;