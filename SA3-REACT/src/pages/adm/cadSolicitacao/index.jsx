//DEPENDENCIAS
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

//COMPONENTES
import Footer from '../../../components/footer';
import api from '../../../servise/api';
import Swal from 'sweetalert2';

//IMAGENS
import HeaderAdm from '../../../components/headerAdm';



function CadSolicitação() {

    const navigate = useNavigate()
    const [nomeSolicitacao, setNomeSolicitacao] = useState('');
    const [solicitacoes, setSolicitacoes] = useState(null);
    const UserSession = JSON.parse(localStorage.getItem("user"))

    useEffect(() => {
        async function carregarSolicitacoes() {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const idEmpresa = user?.emp;
                const resposta = await api.post('/empresasolicitacoes', { idEmpresa });
                setSolicitacoes(resposta.data);
            } catch (error) {
                Swal.fire({
                    title: 'Erro ao carregar solicitações!',
                    text: 'Tente novamente mais tarde!',
                    icon: 'error',
                    confirmButtonText: 'Sair'
                });
            }
        }
        carregarSolicitacoes();
    }, [solicitacoes]);

    const cadastrarSolicitacao = async () => {
        if (!nomeSolicitacao) {
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'Campo obrigatório! Por favor preencha o campo de nome da solicitação.'
            })
            return;
        }
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) {
            console.error('Usuário não encontrado no localStorage');
            // Adicione qualquer lógica adicional necessária para lidar com o usuário ausente
            return;
        }

        const idEmpresa = userData?.emp;

        if (!idEmpresa) {
            console.error('ID da empresa não encontrado no objeto do usuário');
            // Adicione qualquer lógica adicional necessária para lidar com o ID da empresa ausente
            return;
        }
        try {
            const dados = {
                nomeSolicitacao,
                idEmpresa,
            };
            const resposta = await api.post('/cadastrarsolicitacao', dados);
            if (resposta.data.confirma) {
                Swal.fire({
                    title: 'Sucesso!',
                    text: `Solicitação foi cadastrado com sucesso!`,
                    icon: 'success',
                    confirmButtonText: 'Ok'
                });
                setNomeSolicitacao('');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro ao cadastrar a solicitação',
                    text: 'A solicitação já existe no sistema'
                })
                setNomeSolicitacao('');
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Erro na operação!',
                text: 'Houve um erro ao cadastrar a solicitação.',
            });
        }
    };
    return (
        <>
            <div className="flex-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <HeaderAdm />
                <main className="height-100 bg-light">
                    {/* <!-- Código da Pagina cadastro --> */}

                    {/* <!-- TITLE --> */}
                    <div className='container'>
                        <div className="row text-center">
                            <div className="fw-bold fs-1 text-uppercase title-sa3">CADASTRO DE SOLICITAÇÕES</div>
                            <div className="fs-3 text-muted">{UserSession ? UserSession.nomeEmpresa : ''}</div>
                        </div>

                        {/* <!-- BODY --> */}
                        <nav aria-label="breadcrumb my-5">
                            <ol className="breadcrumb fs-6">
                                <li className="breadcrumb-item fw-regular text-info"><a href="./homeadm">Início</a></li>
                                <li className="breadcrumb-item active" aria-current="page">Adicionando Solicitação</li>
                            </ol>
                        </nav>
                        <div className="row my-5">
                            <h3 className="fw-bolder text-black">Registre os tipos de solicitações</h3>
                            <div className="col-lg-6 col-md-12 col-sm-12 order-0 mb-5">
                                <div className="fs-6">
                                    <p>
                                        Estas solicitações podem variar desde serviços básicos até pedidos específicos.
                                    </p>
                                    <p>
                                        Aqui estão alguns exemplos de solicitações que podem ser cadastradas:
                                    </p>

                                    <div className="my-2">
                                        &bull; <strong> Limpeza do Ambiente: </strong> Garantir que a sala esteja sempre limpa e
                                        organizada antes e depois de cada uso.
                                    </div>

                                    <div className="my-2">
                                        &bull; <strong> Material de Apoio: </strong> Fornecer itens como canetas, blocos de
                                        notas, apagadores, entre outros.
                                    </div>

                                    <div className="my-2">
                                        &bull; <strong> Datashow: </strong> Disponibilização e configuração de projetores para
                                        apresentações.
                                    </div>

                                    <div className="my-2">
                                        &bull; <strong> Nova Mesa: </strong> Substituição ou adição de mesas conforme a
                                        necessidade.
                                    </div>

                                    &bull; <strong> Etc... </strong>

                                    <p className="my-5">
                                        Ao definir e cadastrar estas e outras solicitações pertinentes à sua empresa,
                                        você
                                        garante que todos os agendamentos sejam feitos com clareza sobre o que é
                                        necessário
                                        e o
                                        que pode ser esperado do ambiente. Isso ajuda na coordenação e preparação da
                                        sala,
                                        garantindo que tudo ocorra da maneira mais fluida e eficiente possível.
                                    </p>

                                </div>
                            </div>
                            <div className="col-lg-6 col-md-12 col-sm-12 align-self-start">
                                <h5 className="fw-bolder mb-3 text-black">Solicitação</h5>
                                <div className="my-3">
                                    <label htmlFor="nomeCompleto" className="form-label fw-bolder">Nome da solicitação</label>
                                    <input
                                        type="text"
                                        name=""
                                        id="nomeCompleto"
                                        className="form-control input-text"
                                        placeholder="ex: “Limpeza do ambiente”, “Material de apoio”, e etc."
                                        value={nomeSolicitacao}
                                        onChange={(e) => setNomeSolicitacao(e.target.value)}

                                    />
                                </div>
                                <p id="helpId" className="my-2 text-muted d-flex justify-content-end">
                                    Para que possamos otimizar o uso das nossas salas e garantir que todos os recursos e
                                    serviços necessários estejam à disposição de quem as utiliza.

                                    É fundamental que você cadastre previamente os tipos de solicitações que podem ser
                                    feitos para cada sala agendada.
                                </p>

                                <div className="my-3">
                                    <div className="row">
                                        <div className="col-md-6 d-flex justify-content-center">
                                            <div className="btn bg-disabled w-75" id="" onClick={() => { navigate('/homeadm') }}>
                                                {/*eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                                <a> Voltar </a>
                                            </div>
                                        </div>
                                        <div className="col-md-6 d-flex justify-content-center">
                                            <div
                                                className="btn bg-active w-75"
                                                id=""
                                                onClick={() => cadastrarSolicitacao()}
                                            >
                                                Cadastrar
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    <table class="align-middle w-100" style={{}}>
                                        <thead class="">
                                            <th colspan="5">
                                                <div class="mx-3 my-3 fs-4 fw-bolder text-black">Solicitações cadastradas com sucesso</div>
                                            </th>
                                            <tr>
                                                <th>
                                                    <div class="mx-3">Nome</div>
                                                </th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {solicitacoes ?
                                                solicitacoes.map(
                                                    solicitacoes => {

                                                        return (
                                                            <tr>
                                                                <td>
                                                                    <div class="d-flex align-items-start">
                                                                        <div class="">
                                                                            <p class=" fs-5 fw-bold text-truncate mx-3">{solicitacoes.tipo_solicitacao}</p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <p className={`text-center fs-6 text-bold mb-0 ${solicitacoes.status_solicitacao === 1 ? 'bg-active' : 'bg-disabled'}`}>
                                                                        {solicitacoes
                                                                            ? solicitacoes.status_solicitacao === 1
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
                </main>
            </div>
            <Footer />
        </>
    );
}

export default CadSolicitação;
