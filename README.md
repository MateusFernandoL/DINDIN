# DinDin

API RESTful em Node

## Descrição

Projeto criado como exercício para a instituição de ensino em que estudei: Cubos Academy.

## Instalação

1. Clone este repositório: `git clone https://git@github.com:MateusFernandoL/DINDIN.git`
2. Entre no diretório do projeto: `cd DINDIN`
3. Instale as dependências: `npm install`
4. Execute o projeto: `npm start`

## Como Usar

Para usar a API, basta enviar solicitações HTTP para os endpoints disponíveis.

### Endpoints

Aqui estão os endpoints disponíveis na API:

- `post /usuario` : Essa é a rota que será utilizada para cadastrar um novo usuario no sistema.
- `post /login` : Essa é a rota que permite o usuario cadastrado realizar o login no sistema.
- `get /usuario` : Essa é a rota que será chamada quando o usuario quiser obter os dados do seu próprio perfil.
- `put /usuario` : Essa é a rota que será chamada quando o usuário quiser realizar alterações no seu próprio usuário.
- `get /categoria` : Essa é a rota que será chamada quando o usuario logado quiser listar todas as categorias cadastradas.
- `get /transacao` : Essa é a rota que será chamada quando o usuario logado quiser listar todas as suas transações cadastradas.
- `post /transacao` : Essa é a rota que será utilizada para cadastrar uma transação associada ao usuário logado.
- `get /transacao/extrato` : Essa é a rota que será chamada quando o usuario logado quiser obter o extrato de todas as suas transações cadastradas.
- `put /transacao/:id` : Essa é a rota que será chamada quando o usuario logado quiser atualizar uma das suas transações cadastradas.
- `get /transacao/:id` : Essa é a rota que será chamada quando o usuario logado quiser obter uma das suas transações cadastradas.
- `delete /transacao/:id` : Essa é a rota que será chamada quando o usuario logado quiser excluir uma das suas transações cadastradas.

Para usar a API, envie solicitações HTTP para esses endpoints usando um cliente HTTP, como o [Postman](https://www.postman.com/) ou o [cURL](https://curl.se/).
