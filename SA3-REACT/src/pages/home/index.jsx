
//DEPENDENCIAS
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'

//COMPONENTES
import '../../css/bootstrap-icons/bootstrap-icons.css';
import api from '../../servise/api/index';
import Footer from "../../components/footer";

// IMAGEM
import logo from "../../img/svg/logo.svg";
import Frame1 from "../../img/svg/Frame1.svg";
import Frame2 from "../../img/png/Frame2.png";
import Gif from "../../img/jpg/Gifinicio.gif"



// import rootReducer from "../../redux/root-reducer";
function Home() {

    const navigate = useNavigate();

    // const { currentUser } = useSelector(rootReducer => rootReducer.userReducer);


    const [Email, setEmail] = useState('');
    const [Senha, setSenha] = useState('');
    const [Empresa, setEmpresa] = useState('');
    const [Nome, setNome] = useState('');
    const [Telefone, setTelefone] = useState('');


    //FUCTIONS

    //LOGIN
    async function logar() {
        try {
            //DADOS DE LOGIN
            const dados = {
                usuEmail: Email,
                usuSenha: Senha
            };
            //REQUISICAO API
            const res = await api.post('/usuarioslogin', dados);
            //VERIFICA SE O LOGIN FOI EFETUADO
            if (res.data.confirma === true) {
                //DADOS DO USUARIO
                const User = res.data.message;
                //VERIFICA O STATUS DO USUARIO (ATIVO/INATIVO)
                if (User.status === 1) {
                    //VERIFICA O TIPO DO USUARIO (PADRAO/ADM)
                    var modalBackdropElements = document.getElementsByClassName("modal-backdrop");
                    var fadeElements = document.getElementsByClassName("fade");
                    var showElements = document.getElementsByClassName("show");
                    // Iterar sobre cada coleção e remover os elementos
                    removeElements(modalBackdropElements);
                    removeElements(fadeElements);
                    removeElements(showElements);
                    document.body.removeAttribute('class');
                    document.body.removeAttribute('style');
                    //CRIA A SESSION
                    localStorage.setItem('user', JSON.stringify(User));
                    //VERIFICA O TIPO DO USUARIO
                    if (User.tipo === 0) {
                        navigate("/homeadm");
                    } else {
                        navigate("/homeuser");
                    }
                } else {
                    Swal.fire({
                        title: 'Ops! Seu cadastro esta invativo! 😬',
                        text: 'Entre em contato com o responsável da sua empresa',
                        icon: 'error',
                        confirmButtonText: 'Voltar'
                    });
                }
            } else {
                Swal.fire({
                    title: 'Ops! Email ou senha incorretos! 😬',
                    text: 'Favor tente novamete!',
                    icon: 'error',
                    confirmButtonText: 'Voltar'
                });
            }
        } catch (error) {
            handleRequestError(error);
            Swal.fire({
                title: 'Ops! Erro com a central!',
                text: 'entrar em contato conosco',
                icon: 'error',
                confirmButtonText: 'Voltar'
            });
        }
    }

    //CADASTRO
    async function cadastro() {
        //VERIFICA SE TODOS OS DADOS ESTÃO PREENCHIDOS
        if (Email !== '' && Email !== null && Senha !== '' && Senha !== null && Empresa !== '' && Empresa !== null && Nome !== '' && Nome !== null && Telefone !== '' && Telefone !== null) {
            //VALIDA O EMAIL
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(Email)) {
                Swal.fire({
                    title: 'Ops! Email inválido!',
                    text: 'Favor inserir um endereço de email válido!',
                    icon: 'error',
                    confirmButtonText: 'Corrigir'
                });
                return;
            } else {
                try {
                    const dados = {
                        usuEmail: Email,
                        usuSenha: Senha,
                        empNome: Empresa,
                        empTelefone: Telefone,
                        usuNome: Nome
                    }
                    //REQUISICAO API
                    const response = await api.post('/usuarioscadastro', dados);
                    //CADASTRO FEITO COM SUSCESO


                    if (response.data.confirma === true) {
                        Swal.fire({
                            title: 'Conta criada com sucesso 😊',
                            text: 'Seja muito bem-vindo ao nosso sistema de agendamento. Estamos felizes por tê-lo(a) conosco!',
                            icon: 'success',
                            confirmButtonText: 'Acesar agora',
                            showCancelButton: false,
                        }).then((result) => {
                            if (result.isConfirmed) {
                                logar();
                                // navigate("/homeadm");
                            }
                        });
                        //ERRO NO CADASTRO
                    } else {
                        Swal.fire({
                            title: 'Ops! Email já cadastrado! 😔',
                            text: 'Este endereço de email já está associado a uma conta. Se esqueceu sua senha, use a opção de recuperação.',
                            icon: 'error',
                            confirmButtonText: 'Ok'
                        });

                    }
                } catch (error) {
                    if (error.response) {
                        const errorCode = error.response.data.errorCode;
                        switch (errorCode) {
                            case 'EMAIL_DUPLICADO':
                                Swal.fire({
                                    title: 'Ops! Email já cadastrado!',
                                    text: 'Este endereço de email já está associado a uma conta. Se esqueceu sua senha, use a opção de recuperação.',
                                    icon: 'error',
                                    confirmButtonText: 'Ok'
                                });
                                break;
                            case 'OUTRO_ERRO':
                                Swal.fire({
                                    title: 'Ops! Ocorreu um erro!',
                                    text: 'Houve um problema durante o cadastro. Entre em contato com o suporte para obter assistência.',
                                    icon: 'error',
                                    confirmButtonText: 'Ok'
                                });
                                break;
                            // Adicione outros casos conforme necessário
                            default:
                                Swal.fire({
                                    title: 'Ops! Ocorreu um erro!',
                                    text: 'Houve um problema durante o cadastro. Entre em contato com o suporte para obter assistência.',
                                    icon: 'error',
                                    confirmButtonText: 'Ok'
                                });
                        }
                    } else {
                        Swal.fire({
                            title: 'Ops! Ocorreu um erro!',
                            text: 'Houve um problema durante o cadastro. Entre em contato com o suporte para obter assistência.',
                            icon: 'error',
                            confirmButtonText: 'Ok'
                        });
                    }
                }
            }
        } else {
            Swal.fire({
                title: 'Ops! Existe campo vazio!',
                text: 'Favor preencher todos os campos corretamente!',
                icon: 'error',
                confirmButtonText: 'Tentar novamente'
            })
        }
    }


    //VALIDACAO DE TAMANHO DO CAMPO

    //NOME
    const maxLengthNome = (e) => {
        const novoNome = e.target.value;
        const limiteCaracteres = 50;
        if (novoNome.length <= limiteCaracteres) {
            setNome(novoNome);

        } else {
            Swal.fire({
                title: 'Tamanho inválido campo Nome!',
                text: 'tente novamente',
                icon: 'error',
                confirmButtonText: 'Corrigir'
            })
            window.location.reload(true);
        }
    };

    //EMAIL
    const maxLengthEmail = (e) => {
        const novoEmail = e.target.value;
        const limiteCaracteres = 100;
        if (novoEmail.length <= limiteCaracteres) {
            setEmail(novoEmail);

        } else {
            Swal.fire({
                title: 'Tamanho inválido campo Email!',
                text: 'tente novamente',
                icon: 'error',
                confirmButtonText: 'Corrigir'
            });
            window.location.reload(true);
        }
    };

    //SENHA
    const maxLengthSenha = (e) => {
        const novoSenha = e.target.value;
        const limiteCaracteres = 128;
        if (novoSenha.length <= limiteCaracteres) {
            setSenha(novoSenha);

        } else {
            Swal.fire({
                title: 'Tamanho inválido campo Senha!',
                text: 'tente novamente',
                icon: 'error',
                confirmButtonText: 'Corrigir'
            });
            window.location.reload(true);
        }
    };
    //NOME EMPRESA
    const maxLengthEmpresa = (e) => {
        const novoEmpresa = e.target.value;
        const limiteCaracteres = 150;
        if (novoEmpresa.length <= limiteCaracteres) {
            setEmpresa(novoEmpresa);

        } else {
            Swal.fire({
                title: 'Tamanho inválido campo Empresa!',
                text: 'tente novamente',
                icon: 'error',
                confirmButtonText: 'Corrigir'
            });
            window.location.reload(true);
        }
    };

    //TELEFONE
    const maxLengthTelefone = (e) => {
        const novoTelefone = e.target.value;
        const limiteCaracteres = 11;
        if (novoTelefone.length <= limiteCaracteres) {
            setTelefone(novoTelefone);
        } else {
            Swal.fire({
                title: 'Tamanho inválido campo Telefone!',
                text: 'tente novamente',
                icon: 'error',
                confirmButtonText: 'Corrigir'
            });
        }
    };




    function handleRequestError(error) {
        if (error.response) {
            showAlertError(error.response.data.message);
        } else {
            showAlertError('Ocorreu um erro inesperado. Entre em contato com o suporte.');
        }
    }


    function showAlertError(titleCard, errorMessage) {
        Swal.fire({
            title: titleCard,
            text: errorMessage,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }

    function removeElements(elements) {
        for (var i = 0; i < elements.length; i++) {
            elements[i].remove();
        }
    }

    // function extractUserData(data) {
    //     return {
    //         usu: data.usu,
    //         emp: data.emp,
    //         setor: data.setor,
    //         nome: data.nome,
    //         email: data.email,
    //         telefone: data.telefone,
    //         status: data.status,
    //         tipo: data.tipo
    //     };
    // }

    // function saveUserToLocalStorage(user) {
    //     localStorage.setItem('user', JSON.stringify(user));
    // }

    // function handleErrorResponse(status) {
    //     switch (status) {
    //         case 401:
    //             showAlertError('Credenciais Inválidas', 'Verifique seu e-mail e senha.');
    //             break;
    //         case 500:
    //             showAlertError('Erro Interno do Servidor', 'Ocorreu um problema no servidor. Tente novamente mais tarde.');
    //             break;
    //         default:
    //             showAlertError('Credenciais Inválidas', 'Verifique seu e-mail e senha 😬');
    //     }
    // }

    return (
        <>
            <nav className="navbar navbar-expand-lg " >

                <div className="container">
                    <a className="navbar-brand" href="index.html">
                        <img src={logo} alt="" />
                    </a>

                    {/* <!-- BOTÃO QUE SE ESCONDE QUANDO TELA FOR MAIOR E QUANDO MENOR ELE APARECE --> */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNavAltMarkup"
                        aria-controls="navbarNavAltMarkup"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                        style={{ borderColor: "#ffffff" }}
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    {/* <!-- BOTÕES SUPERIOR NA TELA --> */}
                    <div className="collapse navbar-collapse justify-content-end" id="navbarNavAltMarkup">
                        <div className="navbar-nav text-center align-items-center  ">
                            <a
                                className="nav-link fw-bolder text-white"
                                href="#sobre"
                            >
                                Sobre
                            </a>
                            <a
                                className="nav-link fw-bolder text-white"
                                href="#contato"
                            >
                                Contato
                            </a>
                            <a
                                className="nav-link fw-bolder text-white"
                                id="entrar-btn"
                                href="f"
                                data-bs-toggle="modal"
                                data-bs-target="#entrarConta"
                            >
                                Entrar
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="modal-container-teste">
                {/* <!-- AQUI SERA ABERTO QUANDO SE CLICA NO BOTÃO ENTRAR --> */}
                <div className="modal-log modal fade" id="entrarConta" tabIndex="-1" aria-labelledby="entrarContaLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content container rounded-0">
                            <div className="onda-superior"></div>

                            <div className="row justify-content-end m-2">
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="my-5">
                                <div className="row d-flex m-5 mb-3">
                                    <div className="col-12 text-center">
                                        <a className="my-4" href="index.html">
                                            <img src={logo} alt="Logo" />
                                        </a>
                                    </div>
                                </div>
                                <div className="row text-center">
                                    <strong>
                                        <p>Olá! Seja bem-vindo de volta.</p>
                                    </strong>
                                    <p className="text-muted">Faça o seu login agora</p>
                                </div>
                                <div className="row">
                                    <div className="my-3 mx-auto w-75">
                                        <label htmlFor="nomeCompleto" className="form-label text-black-50 mx-2 fw-bolder">Email</label>
                                        <input
                                            autoComplete="off"
                                            type="text"
                                            id="sonos"
                                            value={Email}
                                            className="form-control input-text"
                                            placeholder="nome@exemplo.com"
                                            maxLength={200}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                                {/* CAMPOS DOS INPUTS */}
                                <div className="row">
                                    <div className="my-3 mx-auto w-75">
                                        <label htmlFor="nomeCompleto" className="form-label text-black-50 mx-2 fw-bolder">Senha</label>
                                        <input
                                            autoComplete="off"
                                            type="password"
                                            id="sono"
                                            value={Senha}
                                            className="form-control input-text"
                                            placeholder="********"
                                            maxLength={128}
                                            onChange={(e) => setSenha(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <input
                                        autoComplete="off"
                                        className="btn col-6 btn-light my-3 w-50"
                                        type="submit"
                                        id="acessar-login"
                                        value="Acessar"
                                        onClick={() => logar()}
                                    />
                                </div>
                                <div className="row justify-content-center text-white  mt-5 w-75">
                                    <small className="text-end">
                                        Não tem uma conta?{" "}
                                        <a
                                            href="cadastro.html"
                                            data-bs-toggle="modal"
                                            data-bs-target="#cadastrarConta"
                                            className="fw-bolder mt-5">
                                            Inscreva-se
                                        </a>
                                    </small>
                                </div>
                                <div className="onda-inferior"></div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- FIM DO MODAL --> */}
                <div className="modal-cad modal fade" id="cadastrarConta" tabIndex="-1" aria-labelledby="cadastrarContaLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered rounded-0" id="retangulo">
                        <div className="modal-content container border-0">
                            <div className="row justify-content-end me-2 mt-2">
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="onda-superior"></div>
                            <div className="my-5">
                                <div className="row d-flex mt-5 mb-3">
                                    <div className="col-12 text-center mt-5">
                                        <a className="my-4" href="index.html">
                                            <img src={logo} alt="Logo" />
                                        </a>
                                    </div>
                                </div>
                                <div className="row text-center ">
                                    <strong>
                                        <p>
                                            Cadastre-se para entrar no site, é rápido e fácil
                                        </p>
                                    </strong>
                                </div>
                                <div className="my-3 mx-auto w-75">
                                    <label htmlFor="nomeCompleto" className="form-label text-black-50 mx-2 fw-bolder">Nome</label>
                                    <input
                                        autoComplete="off"
                                        type="text"
                                        id="nomeCompleto"
                                        className="form-control input-text"
                                        placeholder="Nome e sobrenome"
                                        maxLength={50}
                                        onChange={maxLengthNome}
                                    />
                                </div>

                                <div className="my-3 mx-auto w-75">
                                    <label htmlFor="nomeEmpresa" className="form-label text-black-50 mx-2 fw-bolder">Empresa</label>
                                    <input
                                        autoComplete="off"
                                        type="text"
                                        id="nomeEmpresa"
                                        className="form-control input-text"
                                        placeholder="Sua empresa aqui..."
                                        maxLength={150}
                                        onChange={maxLengthEmpresa}
                                    />
                                </div>

                                <div className="my-3 mx-auto w-75">
                                    <label htmlFor="telefoneEmpresa" className="form-label text-black-50 mx-2 fw-bolder">Telefone</label>
                                    <input
                                        autoComplete="off"
                                        type="text"
                                        id="telefoneEmpresa"
                                        className="form-control input-text"
                                        placeholder="(xx) x xxxx-xxxx"
                                        pattern="[0-9]{2} [0-9] [0-9]{4}-[0-9]{4}"
                                        maxLength={11}
                                        onChange={maxLengthTelefone}
                                        required
                                    />
                                </div>

                                <div className="my-3 mx-auto w-75">
                                    <label htmlFor="emailCad" className="form-label text-black-50 mx-2 fw-bolder">Email</label>
                                    <input
                                        autoComplete="off"
                                        type="text"
                                        id="emailCad"
                                        className="form-control input-text"
                                        placeholder="exemplo@aqui.com"
                                        maxLength={100}
                                        onChange={maxLengthEmail}
                                    />
                                </div>

                                <div className="my-3 mx-auto w-75">
                                    <label htmlFor="senha" className="form-label text-black-50 mx-2 fw-bolder">Crie sua senha</label>
                                    <input
                                        autoComplete="off"
                                        type="password"
                                        id="senha"
                                        className="form-control input-text"
                                        placeholder="Senha"
                                        maxLength={100}
                                        onChange={maxLengthSenha}
                                    />
                                </div>

                                <div className="row justify-content-center">
                                    <input
                                        autoComplete="off"
                                        className="btn col-12 btn-light my-3 w-50"
                                        type="submit"
                                        id="cadastrar"
                                        value="Cadastrar"
                                        onClick={() => cadastro()}
                                    />
                                </div>
                                <div className="mt-5 text-white">
                                    <div className="row justify-content-center">
                                        <small className="text-center">

                                            <a href="#" data-bs-toggle="modal" data-bs-target="#entrarConta" className="">
                                                Esqueci a senha
                                            </a>
                                        </small>
                                    </div>

                                    <div className="row justify-content-center mb-5 w-75">
                                        <small className="text-end">
                                            Já tem uma conta?{" "}
                                            <a href="#" data-bs-toggle="modal" data-bs-target="#entrarConta" className="fw-bolder">
                                                Faça login
                                            </a>
                                        </small>
                                    </div>
                                </div>
                            </div>
                            <div className="onda-inferior"></div>
                        </div>
                    </div>
                </div>
            </div >

            {/* <!-- CORPO DA PAGINA --> */}
            < main >
                <div className="container" id="sobre">
                    <div className="row my-5 d-flex justify-content-center align-content-center align-items-center">
                        <div className="col-lg-6 col-md-12 col-sm-12">
                            <h2>
                                {" "}
                                Gerencie seus ambientes de forma eficiente e
                                prática
                            </h2>
                            <p>
                                Agende salas e ambientes de maneira simples e
                                rápida, garatinho a organização e otimizacão dos
                                espaços disponiveis. Tenha controle total sobre
                                os agendamentos e evite conflitos de horários.
                            </p>
                            <form>
                                <a
                                    className="btn btn-lg"
                                    id="cadastrar"
                                    href="cadastro.html"
                                    data-bs-toggle="modal"
                                    data-bs-target="#cadastrarConta"
                                >
                                    {" "}
                                    Cadastrar-se
                                </a>
                            </form>
                        </div>
                        <div className="col-lg-6 col-md-12 d-lg-flex justify-content-end d-lg-block d-md-none d-sm-none my-5">
                            <img
                                src={Frame1}
                                className="img-fluid "
                                alt="Pessoa apontando as salas"
                            />
                        </div>
                    </div>

                    <div id="circulo"></div>

                    <div className="row my-5 d-flex justify-content-start align-items-center">
                        <h3 className="fw-bolder text-center fs-1 my-5" id="color-white">Sobre nós</h3>
                        <div className="col-lg-6 col-md-12 col-sm-12">
                            <h2 className="title">
                                Facilitando o <strong>controle</strong> e a{" "}
                                <strong>eficiência</strong> no uso de espaços
                            </h2>
                            <p className="my-3">
                                Seja para uma escola, empresa ou qualquer outra
                                instituição, o nosso sistema de gerenciamento de 
                                <strong> ambientes</strong> foi projetado para{" "}
                                <strong>otimizar</strong> sua organização e
                                proporcionar um controle total sobre seus
                                espaços e recursos. Com recursos avançados de
                                agendamento, solicitação de serviços e
                                diferentes níveis de acesso,{" "}
                                <strong>oferecemos a solução perfeita</strong>{" "}
                                para atender às suas necessidades únicas.
                            </p>
                        </div>
                        <div className="col-lg-6 col-md-12 d-lg-flex justify-content-end d-lg-block d-md-none d-sm-none">
                            <img
                                src={Frame2}
                                className="img-fluid"
                                alt="Pessoa apontando as salas"
                            />
                        </div>
                    </div>
                    <div className="row mb-5">
                        <h3 className="fw-bolder text-center fs-1 my-5">
                            Recursos em Destaque
                        </h3>
                        <div className="col-lg-4 col-md-6 col-sm-12 d-flex justify-content-center">
                            <div className="card home cor-1">
                                <div className="card-body text-center">
                                    <div className="card-title fs-5 fw-bold my-5">
                                        Agendamento Simplificado
                                    </div>
                                    <div className="my-5">
                                        <p className="text-justify">
                                            Usuários podem reservar espaços de
                                            acordo com a disponibilidade,
                                            garantindo que o uso dos ambientes
                                            seja otimizado.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12 d-flex justify-content-center">
                            <div className="card home cor-2">
                                <div className="card-body text-center">
                                    <div className="card-title fs-5 fw-bold mt-5">
                                        Solicitação de Serviços e Materiais
                                    </div>
                                    <div className="my-3">
                                        <p className="text-justify">
                                            Além de agendar salas, você pode
                                            solicitar serviços adicionais e
                                            materiais de apoio necessários para
                                            suas atividades. Desde equipamentos
                                            de apresentação até suporte técnico.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12 d-flex justify-content-center">
                            <div className="card home cor-3">
                                <div className="card-body text-center my-5">
                                    <div className="card-title fs-5 fw-bold">
                                        Níveis de Acesso Diferenciados
                                    </div>
                                    <div className="my-3">
                                        <p className="text-justify">
                                            Entendemos a relevância da segurança e controle em nosso sistema, que proporciona vários níveis de acesso. Usuários comuns podem agendar espaços, enquanto aqueles com permissões avançadas gerenciam solicitações, aprovações e ajustes.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row d-flex align-items-center">
                        <h3 className="fw-bolder text-center fs-1 my-5">
                            Explore agora nossa plataforma de Gerenciamento de
                            Ambientes!
                        </h3>
                        <div className="col-lg-5 col-md-5 col-sm-12">
                            <div className="">
                                <img
                                    className="img-fluid"
                                    src={Gif}
                                    alt=""
                                />
                            </div>
                        </div>
                        <div className="col-lg-7 col-md-7 col-sm-12 ">
                            <p className="text-start fs-5">
                                Não importa o tamanho da sua organização ou a
                                natureza das suas necessidades, nossa Plataforma
                                de Gerenciamento de ambientes está pronta para
                                elevar sua eficiência e organização a um novo
                                patamar. Experimente hoje mesmo e descubra como
                                é fácil simplificar o agendamento, controlar o
                                uso de espaços e melhorar a gestão de serviços.
                            </p>
                        </div>
                    </div>
                </div>

            </main >

            {/* <!-- CONTACTS --> */}

            < div className="container" id="contato" >
                <div className="row justify-content-center">
                    <div className="col-md-6 text-center my-5 ">
                        <h2 className="heading-section fw-bolder text-center fs-1 my-5">Contato</h2>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-md-12">
                        <div className="wrapper">
                            <div className="row no-gutters">
                                <div className="col-lg-8 col-md-7 order-md-last d-flex align-items-stretch">
                                    <div className="contact-wrap w-100 p-md-5 p-4">
                                        <h3 className="mb-4">Entrar em contato</h3>
                                        <div
                                            id="form-message-warning"
                                            className="mb-4"
                                        ></div>
                                        {/* <div
                                            className="alert alert-success"
                                            role="alert mb-4"
                                        >
                                            Sua mensagem foi enviada, obrigado!
                                        </div> */}
                                        <form
                                            method="POST"
                                            id="contactForm"
                                            name="contactForm"
                                            className="contactForm"
                                        >
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label
                                                            className="label"
                                                            htmlFor="name"
                                                        >
                                                            Nome completo
                                                        </label>
                                                        <input
                                                            autoComplete="off"
                                                            type="text"
                                                            className="form-control"
                                                            required
                                                            name="name"
                                                            id="name"
                                                            placeholder="Ex: João Carlos"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label
                                                            className="label"
                                                            htmlFor="emailLog"
                                                        >
                                                            Email
                                                        </label>
                                                        <input
                                                            autoComplete="off"
                                                            type="email"
                                                            className="form-control"
                                                            required
                                                            name="email"
                                                            id="emailLog"
                                                            placeholder="nome@exemplo.com"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <label
                                                            className="label"
                                                            htmlFor="subject"
                                                        >
                                                            Assunto
                                                        </label>
                                                        <input
                                                            autoComplete="off"
                                                            type="text"
                                                            className="form-control"
                                                            required
                                                            name="subject"
                                                            id="subject"
                                                            placeholder="..."
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <label
                                                            className="label"
                                                            htmlFor="#"
                                                        >
                                                            Mensagem
                                                        </label>
                                                        <textarea
                                                            required
                                                            name="message"
                                                            className="form-control"
                                                            id="message"
                                                            cols="30"
                                                            rows="4"
                                                            placeholder="Olá, tudo bem?"
                                                        ></textarea>
                                                    </div>
                                                </div>
                                                <div className="col-md-4 mt-5">
                                                    <div className="form-group">
                                                        <input
                                                            autoComplete="off"
                                                            type="submit"
                                                            id="entrar-btn"
                                                            value="Enviar mensagem"
                                                            className="btn btn-primary"
                                                        />
                                                        <div className="submitting"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-5 d-flex align-items-stretch">
                                    <div className="bg-contact w-100 p-md-5 p-4 text-light">
                                        <div className="row d-flex justify-content-center mb-5">
                                            <img
                                                src={logo}
                                                className=" col-5"
                                                alt="Logo"
                                            />
                                        </div>
                                        <div className="row">
                                            <h3>Vamos entrar em contato</h3>
                                            <p className="mb-4">
                                                Estamos abertos para qualquer
                                                sugestão ou apenas para bater um
                                                papo
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

            {/* <!-- Footer --> */}
            < Footer />
            {/* <!-- Footer --> */}
        </>
    );
}

export default Home;
