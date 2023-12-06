
//DEPENDENCIAS
const express = require('express');
const router = express.Router();

//COMPONENTES
const UsuarioController = require('../controllers/usuarioController');
const EmpresaController = require('../controllers/EmpresaController');
const SolicitacoesController = require('../controllers/SolicitacoesController');
const SalasController = require('../controllers/SalaController');
const FuncionamentosController = require('../controllers/FuncionamentoController');
const AgendasController = require('../controllers/agendaController');
const EmpresasUsuariosController = require('../controllers/empresasUsuariosController');
const AgendaSolicitacoesController = require('../controllers/AgendaSolicitacoesController');
const SetoresController = require('../controllers/setoresController');

//const upload = require('../middlewares/uploadImage');

//ROTAS


//USUARIOS

//LISTAR USUARIO POR ID
router.get('/Usuarios/:idUsuario', UsuarioController.infoUsuario);

//LOGIN
router.post('/usuarioslogin', UsuarioController.login);

//CADASTRO USUARIO ADMIN
router.post('/usuarioscadastro', UsuarioController.cadastro);

//CADASTRO USUARIO PADRÃO
router.post('/usuarioscadastrocomum', UsuarioController.cadastrocomum);

//EDITAR USUARIO PADRAO(ADMIN)
router.put('/editarusuario/:idUsuario' , UsuarioController.editarusuariocomunadm);

//DELETE USUARIO PADRAO(ADMIN)
router.delete('/deletarusuario/:idUsuario' , UsuarioController.deletarusuariocomunadm);


//EMPRESA

//LISTA A SALAS DA EMPRESA
router.post('/empresasala', EmpresaController.listarEmpresaSala);

//LISTA O SETOR DA EMPRESA
router.post('/empresasetor', EmpresaController.listarEmpresaSetor);

//LISTA A SOLICITACOES DA EMPRESA
router.post('/empresasolicitacoes', EmpresaController.listarEmpresaSolicitacoes);

//LISTA OS USUARIOS DA EMPRESA
router.post('/empresausuariosreservas', EmpresasUsuariosController.listarEmpresasUsuariosReservas);


//SOLICITACOES

//CADASTRO SOLICITACAO
router.post('/cadastrarsolicitacao', SolicitacoesController.cadastrarsolicitacoes);

//EDITAR SOLICITACAO
router.put('/editarsolicitacao/:idSolicitacao', SolicitacoesController.editarsolicitacao);

//DELETE SOLICITACAO
router.delete('/deletarsolicitacao/:idSolicitacao', SolicitacoesController.deletarsolicitacao);


//SALA

//CADASTRAR SALA
router.post('/cadastrarsala', SalasController.cadastrarsala);

//EDITAR SALA
router.put('/editarsala/:idSala', SalasController.editarsala);

//DELETE SALA
router.delete('/deletarsala/:idSala', SalasController.deletarsala)


//AGENDA

//AGENDAMENTOS DO USUARIO
router.post('/agendausuario', AgendasController.agendausuario);


//SETORES

//CADASTRO DO SETOR
router.post('/cadastrarsetor' , SetoresController.cadastrarsetores);

//EDITAR SETOR
router.put('/editarsetor/:idSetor' , SetoresController.altearsetores);

//DELETAR SETOR 
router.delete('/deletarsetor/:idSetor' , SetoresController.deletarsetor)




//GET SALA ID EMPRESA
router.post('/agendasala',AgendasController.agendasala)

router.get('/Setores/:idSetores', SetoresController.listarSetores);

router.post('/dadosempresa', EmpresaController.dadosempresa);

//cadastro agenda
router.post('/cadastroagenda', AgendasController.cadastroagenda);

router.put('/editaragenda/:idAgenda', AgendasController.editaragenda);

router.patch('/cancelaragenda/:idAgenda' , AgendasController.cancelaragenda);

router.delete('/deletaragenda/:idAgenda', AgendasController.deletaragenda);

//DELETE
//DELETE
//DELETE
//DELETE






router.get('/AgendaSolicitacoes', AgendaSolicitacoesController.listarAgendaSolicitacoes);
router.post('/AgendaSolicitacoes', AgendaSolicitacoesController.cadastrarAgendaSolicitacoes);
router.patch('/AgendaSolicitacoes/:idAgenda',AgendaSolicitacoesController.editarAgendaSolicitacoes);
router.delete('/AgendaSolicitacoes/:idSolicitacoes/:idAgenda', AgendaSolicitacoesController.excluirAgendaSolicitacoes);

// router.get('/Setores', SetoresController.listarSetores);




module.exports = router;