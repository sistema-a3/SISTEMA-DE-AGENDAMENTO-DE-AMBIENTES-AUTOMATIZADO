# Sistema de Agendamento de Ambientes Automatizado

Desenvolvido como Trabalho de Conclusão de Curso (TCC), este sistema oferece uma solução eficiente e automatizada para o agendamento de ambientes. Composto por uma API (sa3-api) para gerenciamento de dados e lógica de negócios, e um frontend React (sa3-react) proporcionando uma interface intuitiva. A flexibilidade do projeto permite configurar o endereço IP da API e adaptar a conexão com o banco de dados. Distribuído sob a Licença MIT, fomentando a colaboração e desenvolvimento conjunto.

# TCC - Sistema de agendamento de ambientes automatizado.

## Descrição
Este é o código fonte do nosso Trabalho de Conclusão de Curso (TCC) intitulado "Sistema de agendamento de ambientes automatizado". O projeto é composto por duas partes principais: a API (sa3-api) e o frontend React (sa3-react). .

## Pré-requisitos
Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina.

## Instalação

### 1. API (sa3-api)
1. Abra o terminal do CMD na pasta "sa3-api".
2. Execute o seguinte comando para instalar as dependências:
    ```bash
    npm install
    ```

- **Trocar o IP da API:**
3. Caso seja necessário alterar o IP da API, vá até o arquivo `sa3-react/src/pages/servise/api/index.js` e modifique o endereço conforme necessário.
  Exemplo:
  ```javascript
    const apiUrl = 'http://novo-endereco-da-api';
  ```

### 2. Frontend React (sa3-react)
1. Abra o terminal do CMD na pasta "sa3-react".
2. Execute o seguinte comando para instalar as dependências:
    ```bash
    npm install
    ```

## Configuração

### Banco de Dados (sa3-api)
- Caso seja necessário configurar a conexão com o banco de dados, acesse o arquivo `sa3-api/database/connection.js` e faça as alterações conforme necessário.

## Execução

### 1. API (sa3-api)
1. No terminal dentro da pasta "sa3-api", execute o seguinte comando:
    ```bash
    npm run dev
    ```
   Isso iniciará a API.

### 2. Frontend React (sa3-react)
1. No terminal dentro da pasta "sa3-react", execute o seguinte comando:
    ```bash
    npm start
    ```
   Isso iniciará o aplicativo React.

## Contribuição
Se desejar contribuir para este projeto, siga as diretrizes de contribuição e abra uma issue para discutir as alterações propostas.

## Licença
Este projeto está licenciado sob a [Licença MIT](LICENSE).
