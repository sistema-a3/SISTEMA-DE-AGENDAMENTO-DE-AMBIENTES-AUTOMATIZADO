//DEPENDENCIAS
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'

//COMPONENTES
import api from '../../../servise/api';
import Footer from '../../../components/footer';

//IMAGENS
import ImgCadSetor from "../../../img/svg/cadastroSetor.svg";
import HeaderAdm from '../../../components/headerAdm';



function CadSetor() {

    const navigate = useNavigate()
    const [nomeSetor, setNomeSetor] = useState(null);
    const [setores, setSetores] = useState(null);
    const UserSession = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        async function carregarSetores() {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const idEmp = user?.emp;
                const resposta = await api.get(`/Setores/${idEmp}`); // Substitua pela sua rota real
                setSetores(resposta.data);
            } catch (error) {
                Swal.fire({
                    title: 'Erro ao carregar setores!',
                    text: 'Tente novamente mais tarde!',
                    icon: 'error',
                    confirmButtonText: 'Sair'
                });
            }
        }
        carregarSetores();
    }, [setores]);

    async function cadastrarSetor() {
        try {
            if (!nomeSetor) {
                Swal.fire({
                    title: 'Atenção!',
                    text: 'Preencha todos os campos corretamente!',
                    icon: 'warning',
                    confirmButtonText: 'Ok'
                });
                return;
            }

            const user = JSON.parse(localStorage.getItem('user'));
            const idEmp = user?.emp;

            const dados = {
                "IdEmpresa": idEmp,
                "nomeSetor": nomeSetor
            };

            const resposta = await api.post('/cadastrarsetor', dados);

            if (resposta.data.confirma) {
                Swal.fire({
                    title: 'Sucesso!',
                    text: 'O Setor foi cadastrado com sucesso!',
                    icon: 'success',
                    confirmButtonText: 'Ok'
                });
                setNomeSetor('');
            } else {
                Swal.fire({
                    title: 'Atenção!',
                    text: 'Este setor já existe na empresa!',
                    icon: 'warning',
                    timer: 2500,
                    confirmButtonText: 'Ok'
                });
                setNomeSetor('');
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

    return (
        <>


            <div className="flex-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

                <HeaderAdm />


                <main className="height-100 bg-light">

                    {/* <!-- TITLE --> */}
                    <div className='container'>
                        <div class="row text-center">
                            <div class="fw-bold fs-1 text-uppercase title-sa3">CADASTRO DE SETORES</div>
                            <div class="fs-3 text-muted">{UserSession ? UserSession.nomeEmpresa : ''}</div>
                        </div>

                        {/* <!-- BODY --> */}
                        <nav aria-label="breadcrumb my-5">
                            <ol className="breadcrumb fs-6">
                                <li className="breadcrumb-item fw-regular text-info"><a href="./homeadm">Início</a></li>
                                <li className="breadcrumb-item active" aria-current="page">Adicionando Setor</li>
                            </ol>
                        </nav>
                        <div className="row my-5">
                            <h3 className="fw-bolder text-black">Registre os setores de sua empresa</h3>
                            <div className="col-lg-6 col-md-12 col-sm-12 order-0 mb-5">
                                <div className="fs-6">
                                    <p>
                                        Para que o processo de cadastro de usuários ocorra de forma organizada e eficiente, é
                                        essencial que primeiramente sejam definidos os setores da empresa no sistema.
                                    </p>
                                    <p>
                                        Ao estabelecer esses setores, você poderá categorizar e associar os usuários de acordo
                                        com suas respectivas áreas de atuação ou responsabilidades.
                                    </p>

                                    <p>
                                        É como cortar uma pizza: cada fatia tem seu sabor, e todo mundo sabe o que está
                                        escolhendo! 🍕
                                    </p>
                                    <div className="d-flex justify-content-center">
                                        <img className="img-fluid d-lg-block d-md-none d-sm-none" width="50%"
                                            src={ImgCadSetor} alt="imagem-cadSetor" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-12 col-sm-12 align-self-start">
                                <h5 className="fw-bolder mb-3 text-black">Setor</h5>

                                <div className="my-3">
                                    <label for="nomeCompleto" className="form-label fw-bolder">Nome do setor</label>
                                    <input
                                        type="text"
                                        name=""
                                        id="nomeCompleto"
                                        className="form-control input-text"
                                        placeholder="ex: “Professor”, “Administração”, “Coordenador”, e etc."
                                        value={nomeSetor}
                                        onChange={(e) => setNomeSetor(e.target.value)}
                                    />
                                </div>
                                <p id="helpId" className="my-2 text-muted d-flex justify-content-end">
                                    Ao definir os setores, certifique-se de preencher o nome corretamente, evitando erros de
                                    ortografia.
                                </p>

                                <div className="my-3">
                                    <div className="row">
                                        <div className="col-md-6 d-flex justify-content-center">
                                            <div className="btn bg-disabled w-75" id="" onClick={() => { navigate('/homeadm') }}>
                                                {/*eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                                <a >
                                                    Voltar
                                                </a>
                                            </div>
                                        </div>
                                        <div
                                            className="col-md-6 d-flex justify-content-center"
                                            onClick={() => cadastrarSetor()}
                                        >
                                            <div className="btn bg-active w-75" id="">
                                                Cadastrar
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    <table className="align-middle w-100" style={{}}>
                                        <thead className="">
                                            <th colspan="5">
                                                <div className="mx-3 my-3 fs-4 fw-bolder text-black">Setores Cadastrado com sucesso </div>
                                            </th>
                                            <tr>
                                                <th>
                                                    <div className="mx-3">Nome</div>
                                                </th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {setores ?
                                                setores.map(
                                                    setor => {

                                                        return (
                                                            <tr>
                                                                <td>
                                                                    <div className="d-flex align-items-start">
                                                                        <div className="">
                                                                            <p className=" fs-5 fw-bold text-truncate mx-3">{setor.nome_setor}</p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <p className={`text-center fs-6 text-bold mb-0 ${setor.status_setor === 1 ? 'bg-active' : 'bg-disabled'}`}>
                                                                        {setor
                                                                            ? setor.status_setor === 1
                                                                                ? 'ativo'
                                                                                : 'inativo'
                                                                            : null}

                                                                    </p>
                                                                </td>
                                                            </tr>
                                                        )
                                                    }
                                                )
                                                : null
                                            }
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                        </div>
                    </div>
                </main >

            </div >
            <Footer />
        </>

    );
}

export default CadSetor;
