//DEPENDENCIAS
import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'

//COMPONENTES
import api from '../../../servise/api';
import Footer from "../../../components/footer";

//IMAGENS
import foto1 from "../../../img/png/imgok.png";
import HeaderAdm from '../../../components/headerAdm';

function CadSala() {
    const [nomeSala, setNomeSala] = useState('');
    const [numeroSala, setNumeroSala] = useState(null);
    const [descricaoSala, setDescricaoSala] = useState('');
    const UserSession = JSON.parse(localStorage.getItem("user"));

    const navigate = useNavigate();

    async function cadastrarSala() {
        if (!nomeSala || !descricaoSala) {
            Swal.fire({
                title: 'Atenção!',
                text: 'Preencha todos os campos corretamente!',
                icon: 'warning',
                confirmButtonText: 'Ok'
            });
            return;
        } else if (nomeSala.length >= 99) {
            Swal.fire({
                title: 'Atenção!',
                text: 'O nome da sala é muito grande!',
                icon: 'warning',
                confirmButtonText: 'Ok'
            })
        } else if (numeroSala != null && numeroSala.length >= 10) {
            Swal.fire({
                title: 'Atenção!',
                text: 'O número de sala é muito grande!',
                icon: 'warning',
                confirmButtonText: 'Ok'
            })
        } else if (descricaoSala.length >= 499) {
            Swal.fire({
                title: 'Atenção!',
                text: 'A descrição da sala é muito grande!',
                icon: 'warning',
                confirmButtonText: 'Ok'
            })
        } else {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const idEmp = user.emp;
                const dados = {
                    IdEmpresa: idEmp,
                    NomeSala: nomeSala,
                    NumeroSala: numeroSala ? numeroSala : null,
                    DescricaoSala: descricaoSala
                };
                const resposta = await api.post('/cadastrarsala', dados);
                if (resposta.data.confirma) {
                    Swal.fire({
                        title: 'Sucesso!',
                        text: 'A sala foi cadastrada com sucesso!',
                        icon: 'success',
                        confirmButtonText: 'Ok'
                    });
                    setNomeSala('');
                    setDescricaoSala('');
                    setNumeroSala('');
                } else {
                    Swal.fire({
                        title: 'Atenção!',
                        text: 'Esta sala já existe na empresa!',
                        icon: 'warning',
                        timer: 2500,
                        confirmButtonText: 'Ok'
                    });
                    setNomeSala('');
                    setDescricaoSala('');
                    setNumeroSala('');
                }
            } catch (error) {
                Swal.fire({
                    title: 'Erro!',
                    text: 'Houve um erro na operação',
                    icon: 'error',
                    confirmButtonText: 'Confirmar'
                });
            }
        }
    }
    return (
        <>

            <div className="flex-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <HeaderAdm />

                <main className="height-100 bg-light">
                    {/* <!-- Código da Pagina cadastro --> */}

                    {/* <!-- TITLE --> */}
                    <div className='container' >
                        <div class="row text-center">
                            <div class="fw-bold fs-1 text-uppercase title-sa3">CADASTRO SALA</div>
                            <div class="fs-3 text-muted">{UserSession ? UserSession.nomeEmpresa : ''}</div>
                        </div>

                        {/* <!-- BODY --> */}
                        <nav aria-label="breadcrumb my-5">
                            <ol className="breadcrumb fs-6">
                                <li className="breadcrumb-item fw-regular text-info"><div onClick={() => navigate("/homeadm")}>Início</div></li>
                                <li className="breadcrumb-item active" aria-current="page">Adicionando Sala</li>
                            </ol>
                        </nav>
                        <div className="row my-5">
                            <h3 className="fw-bolder">Cadastre sua sala</h3>
                            <div className="col-lg-6 col-md-12 col-sm-12 order-0 mb-5">
                                <div className="fs-6">
                                    <p>
                                        Para que o processo de reserva de salas transcorra sem contratempos, é fundamental que
                                        todas estejam devidamente cadastradas em nosso sistema.
                                    </p>
                                    <p>
                                        Ao detalhar aspectos como nome, número e características da sala, facilitamos a escolha
                                        e evitamos surpresas.
                                    </p>
                                    <p>
                                        Pense nisso como ao escolher um livro pela capa: quando bem descrito, sabemos exatamente
                                        a história que nos espera! 📚
                                    </p>

                                    <div className="d-flex justify-content-center">
                                        <img className="img-fluid d-lg-block d-md-none d-sm-none" width="70%" src={foto1} alt="imagem-cadUsuario" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-12 col-sm-12 align-self-start">
                                <h5 className="fw-bolder mb-3">Criar sala</h5>

                                <div className="my-3">
                                    <label htmlFor="nomeCompleto" className="form-label fw-bolder">Nome</label>
                                    <input
                                        type="text"
                                        name=""
                                        id="nomeCompleto"
                                        className="form-control input-text"
                                        placeholder="ex: Laboratório"
                                        value={nomeSala}
                                        onChange={(e) => setNomeSala(e.target.value)}
                                    />
                                </div>


                                <div className="my-3">
                                    <label htmlFor="numero" className="form-label fw-bolder">Número</label>
                                    <input
                                        type="text"
                                        name=""
                                        id="numeroSala"
                                        className="form-control input-text"
                                        placeholder="ex: 002"
                                        value={numeroSala}
                                        onChange={(e) => setNumeroSala(e.target.value)}
                                        pattern="[0-9]{2} [0-9] [0-9]{4}-[0-9]{4}"

                                    />
                                    <small id="helpId" className="my-2 text-muted d-flex justify-content-end">deve conter somente
                                        números</small>
                                </div>

                                <div className="my-3">
                                    <label htmlFor="descricao" className="form-label fw-bolder">Descrição</label>
                                    <textarea
                                        className="form-control input-text"
                                        placeholder="descrição como esta sala é..."
                                        id="desSala"
                                        style={{ height: "100px" }}
                                        value={descricaoSala}
                                        onChange={(e) => setDescricaoSala(e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="my-3">
                                    <div className="row">
                                        <div className="col-md-6 d-flex justify-content-center">
                                            <div className="btn bg-disabled w-75" id="" onClick={() => { navigate('/homeadm') }}>
                                                {/*eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                                <a href='#'>
                                                    Voltar
                                                </a>
                                            </div>
                                        </div>
                                        <div
                                            className="col-md-6 d-flex justify-content-center"
                                            onClick={() => cadastrarSala()}
                                        >
                                            <div className="btn bg-active w-75">
                                                Cadastrar
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <Footer style={{ bottom: 0 }} />
        </>
    );
}

export default CadSala;
