Backend do Projeto de E-commerce <br>
Este repositório contém o código-fonte do backend de um projeto de e-commerce, desenvolvido com Node.js e SQLite. O objetivo é fornecer funcionalidades básicas de autenticação e gerenciamento de usuários, permitindo que os usuários se cadastrem, façam login e atualizem suas informações.

📋 Funcionalidades

Cadastro de Usuário: Permite que novos usuários se registrem no sistema com nome, email e senha.
Login: Usuários podem se autenticar usando email e senha, recebendo um token JWT.
Atualização de Informações do Usuário: Usuários autenticados podem atualizar suas informações pessoais.
Proteção de Rotas: Rotas sensíveis estão protegidas por autenticação, garantindo que apenas usuários logados possam acessá-las. <br>
🛠️ Tecnologias Utilizadas

Node.js: Ambiente de execução JavaScript no lado do servidor.
Express: Framework web para construir APIs de forma rápida e eficiente.
SQLite: Banco de dados leve e embutido, ideal para desenvolvimento e prototipagem.
JSON Web Token (JWT): Usado para autenticação de usuários.
dotenv: Carrega variáveis de ambiente do arquivo .env, mantendo as configurações seguras. <br>
⚙️ Como Rodar o Projeto Pré-requisitos

Certifique-se de ter o Node.js instalado na sua máquina. Você pode verificar se o Node está instalado com o seguinte comando:<br> 
node -v

Passo a Passo <br>

Clone este repositório para sua máquina local: <br>

git clone https://github.com/vLecaBR/sales-website-model-backend

Navegue até a pasta do projeto:<br>
cd backend

Instale as dependências:<br>
npm install

Crie um arquivo .env na raiz do projeto e adicione suas variáveis de ambiente necessárias (exemplo: JWT_SECRET). <br>

Inicie o servidor: <br>
node server.js

O servidor estará rodando em http://localhost:5000. <br>

💡 Possíveis Melhorias Futuras

Integração com APIs de pagamento: Para realizar transações reais.
Sistema de notificações: Para informar os usuários sobre atualizações de conta ou promoções.
Gerenciamento de produtos: Funções para adicionar, editar e remover produtos do catálogo.
Melhorias na segurança: Implementação de práticas de segurança adicionais, como rate limiting e validação mais rigorosa de entradas. <br>
📬 Contato Caso tenha dúvidas ou sugestões sobre este projeto, sinta-se à vontade para entrar em contato:<br> 
Email: vitartasleca@gmail.com <br> 
LinkedIn: https://www.linkedin.com/in/victor-leca-vlkbr/ <br>

Nota: Este projeto foi desenvolvido com fins educacionais e como parte do meu portfólio pessoal. Não há funcionalidades de pagamento real ou processamento de pedidos. <br>

Licença <br> Este projeto está licenciado sob a licença MIT <br>

Espero que este projeto ajude a demonstrar minhas habilidades e que seja útil para quem estiver buscando inspiração para construir seu próprio backend de e-commerce!
