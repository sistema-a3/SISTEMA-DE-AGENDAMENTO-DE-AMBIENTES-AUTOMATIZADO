import React, { useEffect, useState, useRef } from 'react';
import Header from '../../../components/header';
import { useNavigate } from 'react-router-dom';

// import logo from '../../../img/svg/logo.svg';



function Footer() {

    const UserSession = JSON.parse(localStorage.getItem("user"))
    console.log(UserSession);
    const navigate = useNavigate();
    useEffect(() => {
        if (!UserSession) {
            navigate("/");
        } else if (UserSession.tipo === 0) {
            navigate("/homeadm");
        }
    }, [UserSession, navigate])

    function logout() {
        localStorage.removeItem("user");
        window.location.reload();
    };

    const nomeUsuarioRef = useRef(null);
    function atualizacaoCadastro(){

    };

    return (
        <>
            <Header />
            <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} >
                <div className="row text-center">
                    <div className="fw-bold fs-1 text-uppercase title-sa3">EDITAR PERFIL</div>
                    <div className="fs-3 text-muted">{UserSession ? UserSession.nomeEmpresa : ''}</div>
                </div>
                <nav aria-label="breadcrumb my-5">
                    <ol className="breadcrumb fs-6">
                        <li className="breadcrumb-item fw-regular text-info"><a href="./homeUser">Início</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Editando Perfil </li>
                    </ol>
                </nav>

                {/* Inicio Card Info Usuario */}
                <div className="row">
                    <div className="col-xl-4">
                        <div className="card user mx-3 ">
                            <div className="card-body  profile-card pt-4 d-flex flex-column align-items-center">
                                <h3 className="mb-2"><strong>{UserSession ? UserSession.nome : ''}</strong></h3>
                                <span className="badge bg-primary">{UserSession ? UserSession.nomeSetor : ''}</span>
                                <div className="text-body mt-2">
                                    <h5 className="card-title text-center">Profile</h5>

                                    <div className="row">
                                        <div className="col-lg-3 col-md-4 label "> <strong>Nome</strong></div>
                                        <div className="col-lg-9 col-md-8">{UserSession ? UserSession.nome : ''}</div>
                                    </div>

                                    <div className="row">
                                        <div className="col-lg-3 col-md-4 label"><strong>Empresa</strong></div>
                                        <div className="col-lg-9 col-md-8">{UserSession ? UserSession.nomeEmpresa : ''}</div>
                                    </div>


                                    <div className="row">
                                        <div className="col-lg-3 col-md-4 label"><strong>Email</strong></div>
                                        <div className="col-lg-9 col-md-8">email@example.com</div>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <!-- Profile Edit Form --> */}
                    <div className="col-xl-8">
                        <div className="card">
                            <div className="card-body pt-3">
                                <div className="tab-content pt-2">

                                    <form>
                                        <div className="row text-center">
                                            <div className="fw-bold fs-5 text-center p-3 title-sa3">Editar Dados Pessoais </div>
                                        </div>
                                        <div className="row mb-3">
                                            <label for="fullName" className="col-md-4 col-lg-3 col-form-label">Nome/Apelido</label>
                                            <div className="col-md-8 col-lg-9">
                                                <input name="fullName" value={UserSession ? UserSession.nome : ""} type="text" className="form-control"
                                                    id="fullName" />
                                            </div>
                                        </div>


                                        <div className="row mb-3">
                                            <label for="Job" className="col-md-4 col-lg-3 col-form-label">Cargo</label>
                                            <div className="col-md-8 col-lg-9">
                                                <input name="job" type="text" className="form-control" id="Job"
                                                    value={UserSession ? UserSession.nomeSetor : ""} disabled />
                                            </div>
                                        </div>

                                        <div className="row mb-3">
                                            <label for="Email"
                                                className="col-md-4 col-lg-3 col-form-label">Email</label>
                                            <div className="col-md-8 col-lg-9">
                                                <input name="email" type="email" className="form-control" id="Email"
                                                    value={UserSession ? UserSession.email : ""} />
                                            </div>
                                        </div>


                                        {/* SENHA */}
                                        <div className="row text-center">
                                            <div className="fw-bold fs-5 text-center p-3 title-sa3">Editar Senha</div>
                                        </div>
                                        <div className="row mb-3">
                                            <label for="currentPassword"
                                                className="col-md-4 col-lg-3 col-form-label">Senha Atual</label>
                                            <div className="col-md-8 col-lg-9">
                                                <input name="password" type="password" className="form-control"
                                                    id="currentPassword" />
                                            </div>
                                        </div>

                                        <div className="row mb-3">
                                            <label for="currentPassword"
                                                className="col-md-4 col-lg-3 col-form-label">Nova Senha</label>
                                            <div className="col-md-8 col-lg-9">
                                                <input name="password" type="password" className="form-control"
                                                    id="currentPassword" />
                                            </div>
                                        </div>

                                        <div className="row mb-3">
                                            <label for="renewPassword"
                                                className="col-md-4 col-lg-3 col-form-label">Insira a senha novamente
                                            </label>
                                            <div className="col-md-8 col-lg-9">
                                                <input name="renewpassword" type="password" className="form-control"
                                                    id="renewPassword" />
                                            </div>
                                        </div>
                                        <div className="col-md d-flex justify-content-center">
                                            <div className="btn bg-cadastrar w-25">
                                                Salvar Alterações
                                            </div>
                                        </div>
                                    </form>
                                    {/* FIM SENHA */}



                                </div>

                            </div>


                        </div>
                    </div>
                    {/* Fim Profile Edit Form */}

                </div>
                {/* Fim Card Info Usuario */}

            </div>
        </>
    );
}

export default Footer;
