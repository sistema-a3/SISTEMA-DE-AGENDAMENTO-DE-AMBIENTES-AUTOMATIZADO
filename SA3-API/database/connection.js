const mysql = require('mysql2/promise');

//CONEXAO BANCO

const bd_porta = '3306'; // porta

const bd_usuario = ''; // usuário
const bd_senha = ''; // senha
const bd_servidor = ''; // servidor
const bd_banco = ''; // nome do banco
let connection;

//CONFIG
const config = {
    host: bd_servidor,
    port: bd_porta, //Default: 3306
    user: bd_usuario,
    password: bd_senha,
    database: bd_banco,
    waitForConnections: true,
    connectionLimit: 10, //Default: 10 - deixar 100 ou 1000
    queueLimit: 0,
}

/* 
    -queueLimit-
    O número máximo de solicitações de conexão que o pool enfileirará 
    antes de retornar um erro do getConnection. Se definido como 0, não 
    há limite para o número de solicitações de conexão enfileiradas. (Padrão: 0)
*/

//TESTE DE CONEXAO
try {
    //CRIA CONEXAO
    connection = mysql.createPool(config);

    console.log('Chamou conexão MySql!');

} catch (error) {
    console.log(error);
}

module.exports = connection;