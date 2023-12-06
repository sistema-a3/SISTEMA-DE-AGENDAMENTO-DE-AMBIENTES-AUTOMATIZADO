//DEPENDENCIAS
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'

//COMPONENTES
import api from '../../../servise/api';
import Footer from '../../../components/footer';

//IMAGENS
import Logo from "../../../img/svg/logo.svg";
import imgUser from "../../../img/svg/cadastroUsuario.svg"
import HeaderAdm from '../../../components/headerAdm';


//VARIÁVEIS

function CadUsuario() {
    const navigate = useNavigate()
    const [usuario, setUsuario] = useState({ id_setor: '' });
    const [nomeUsuario, setNomeUsuario] = useState(null);
    const [email, setEmail] = useState(null);
    const [senha, setSenha] = useState(null);
    const [senhaIgual, setSenhaIgual] = useState(null);
    const [novaSenha, setNovaSenha] = useState(null);
    const [setores, setSetores] = useState([]);
    const [idSetor, setSetor] = useState();
    const [UserSession, setSession] = useState(JSON.parse(localStorage.getItem("user")));
    const maxLength = 8;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const handleSenhaIgualChange = (e) => setSenhaIgual(e.target.value);
    const handleSenhaChange = (e) => setNovaSenha(e.target.value);

    useEffect(() => {
        const carregarSetores = async () => {
            try {

                const idEmp = UserSession.emp;

                if (idEmp) {
                    const resposta = await api.get(`/Setores/${idEmp}`); // Substitua pela sua rota real
                    setSetores(resposta.data);
                }
            } catch (error) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Erro!',
                    text: 'Tente novamente mais tarde!',
                    confirmButtonText: 'Sair'
                });
            }
        };
        carregarSetores();
    }, []);

    async function cadastrousuario() {
        try {
            if (!nomeUsuario || !novaSenha || !senhaIgual || !email || !idSetor) {
                Swal.fire({
                    title: 'Atenção!',
                    text: 'Campo vazio! Por favor preencha todos os campos',
                    icon: 'warning',
                    confirmButtonText: 'OK'
                });
                return;
            }
            const user = JSON.parse(localStorage.getItem('user'));
            const idEmp = user?.emp;
            if (!emailRegex.test(email)) {
                Swal.fire({
                    title: 'E-mail inválido',
                    text: 'Insira um e-mail válido',
                    icon: 'warning',
                    confirmButtonText: 'OK'
                });
                return;
            }
            if (novaSenha !== senhaIgual) {
                Swal.fire({
                    title: 'As senhas precisam ser iguais!',
                    text: 'Por favor digite a mesma senha nos dois campos',
                    icon: 'warning',
                    confirmButtonText: 'OK'
                });
                return;
            }
            if (novaSenha.length < 8) {
                Swal.fire({
                    title: 'Atenção!',
                    text: `O tamanho da senha deve ter no mínimo 8 caracteres`,
                    icon: 'warning',
                    confirmButtonText: 'Ok'
                });
                return;
            }
            // setSenha(novaSenha);
            const dados = {
                "usuNome": nomeUsuario,
                "idSet": idSetor,
                "usuEmail": email,
                "usuSenha": novaSenha,
                "idEmp": idEmp
            };
            const resposta = await api.post('/usuarioscadastrocomum', dados);
            if (!resposta.data.confirma) {
                Swal.fire({
                    title: 'Ops! Email já cadastrado',
                    text: 'Por favor tente outro email',
                    icon: 'warning',
                    confirmButtonText: 'Okay'
                });
            } else {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Cadastro realizado com sucesso!',
                    showConfirmButton: true,
                });
                setNomeUsuario('');
                setSetor('');
                setEmail('');
                setSenha('');
                setNovaSenha('');
                setSenhaIgual('');
            }
        } catch (error) {
            if (error.response && error.response.status === 500) {
                Swal.fire({
                    title: 'Erro no servidor',
                    text: 'Tente mais tarde ou contate o administrador do sistema',
                    icon: 'error',
                    confirmButtonText: 'OK'
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
                    <div className='container'>
                        <div className="row text-center">
                            <div className="fw-bold fs-1 text-uppercase title-sa3">CADASTRO DO USUARIO</div>
                            <div className="fs-3 text-muted">{UserSession ? UserSession.nomeEmpresa : ''}</div>
                        </div>

                        {/* <!-- BODY --> */}
                        <nav aria-label="breadcrumb my-5">
                            <ol className="breadcrumb fs-6">
                                <li className="breadcrumb-item fw-regular text-info"><a href="./homeadm">Início</a></li>
                                <li className="breadcrumb-item active" aria-current="page">Adicionando Usúario</li>
                            </ol>
                        </nav>
                        <div className="row my-5">
                            <h3 className="fw-bolder">Registre seu usuário</h3>
                            <div className="col-lg-6 col-md-12 col-sm-12 order-0 mb-5">
                                <div className="fs-6">
                                    <p>
                                        Realize o cadastro de todos os setores da sua empresa para que, posteriormente, você
                                        possa atribuí-los aos respectivos usuários.
                                    </p>
                                    <p>
                                        Se ainda não fez o cadastro dos setores, <a className="link-primary fw-bold"
                                            href="./cadSetor">clique
                                            aqui </a>.
                                    </p>
                                    <p>
                                        Lembre-se, um <strong>setor bem cadastrado</strong> é um setor feliz! 😄
                                    </p>
                                    <p>
                                        Espero que goste!
                                    </p>
                                    <div className="d-flex justify-content-center">
                                        <img className="img-fluid d-lg-block d-md-none d-sm-none" width="70%"
                                            src={imgUser} alt="imagem-cadUsuario" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-12 col-sm-12 align-self-start">
                                <h5 className="fw-bolder mb-3">Dados pessoais</h5>

                                <div className="my-3">
                                    <label for="nomeCompleto" className="form-label fw-bolder">Nome completo</label>
                                    <input
                                        type="text"
                                        name=""
                                        id="nomeCompleto"
                                        className="form-control input-text"
                                        placeholder="ex: João Costa"
                                        value={nomeUsuario}
                                        onChange={(e) => setNomeUsuario(e.target.value)}
                                    />
                                </div>


                                <div className="my-3">
                                    <label for="setor" className="form-label fw-bolder">Setor</label>

                                    <select
                                        className="form-select input-text"
                                        id="inputGroupSelect01"
                                        value={idSetor}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setUsuario((prevState) => ({
                                                ...prevState,
                                                id_setor: value
                                            }));
                                            setSetor(value)
                                        }}

                                    >
                                        <option selected>Selecione</option>
                                        {setores.map(setor => (
                                            <option
                                                key={setor.id_setor}
                                                value={setor.id_setor}
                                                selected={usuario.id_setor === setor.id_setor}
                                            >
                                                {setor.nome_setor}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <h5 className="fw-bolder my-3">Dados de login</h5>

                                <div className="my-3">
                                    <label for="email" className="form-label fw-bolder">Email</label>
                                    <input type="text" name="" id="email" className="form-control input-text"
                                        placeholder="joao@exemplo.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="my-3">
                                    <label for="senha" className="form-label fw-bolder">Senha</label>
                                    <input type="password" name="" id="senha" className="form-control input-text"
                                        placeholder="********"
                                        value={novaSenha}
                                        onChange={handleSenhaChange}

                                    />
                                    <small id="helpId" className="my-2 text-muted d-flex justify-content-end">sua senha deve conter
                                        no minimo 8 caracteres.</small>
                                </div>

                                <div className="my-3">
                                    <label for="repetirSenha" className="form-label fw-bolder">Repita a senha</label>
                                    <input type="password" name="" id="repetirSenha" className="form-control input-text"
                                        placeholder="********"
                                        value={senhaIgual}
                                        onChange={handleSenhaIgualChange}

                                    />
                                </div>
                                <div className="my-3">
                                    <div className="row">
                                        <div className="col-md-6 d-flex justify-content-center">
                                            <div className="btn bg-disabled w-75" id="" onClick={() => { navigate('/homeadm') }}>
                                                <a href="javascript:void(0);" className=''> Voltar </a>
                                            </div>
                                        </div>
                                        <div className="col-md-6 d-flex justify-content-center">
                                            <div className="btn bg-cadastrar w-75" id=""
                                                onClick={() => cadastrousuario()}
                                            >
                                                Cadastrar
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div >
                </main>
            </div>

            <Footer />
        </>
    );
}

export default CadUsuario;
