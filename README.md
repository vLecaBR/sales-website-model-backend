# 🇧🇷 README em Português
# 🛒 E-commerce Project Backend - Projeto de Portfólio

Este repositório contém o código-fonte do backend de um projeto de e-commerce, desenvolvido utilizando Node.js e SQLite. O objetivo é fornecer funcionalidades básicas de autenticação e gerenciamento de usuários, permitindo que os usuários se registrem, façam login e atualizem suas informações.

---

### ✨ Funcionalidades

- 📝 **Cadastro de Usuários**: Permite que novos usuários se cadastrem com nome, email e senha  
- 🔑 **Login**: Usuários podem se autenticar usando email e senha, recebendo um token JWT  
- ✏️ **Atualização de Informações do Usuário**: Usuários autenticados podem atualizar seus dados pessoais  
- 🔒 **Proteção de Rotas**: Rotas sensíveis são protegidas por autenticação, garantindo que apenas usuários logados possam acessá-las

---

### 🛠️ Tecnologias Utilizadas

- **Node.js** – Ambiente de execução JavaScript para desenvolvimento do servidor  
- **Express** – Framework web para construção de APIs de forma rápida e eficiente  
- **SQLite** – Banco de dados leve e incorporado, ideal para desenvolvimento e prototipagem  
- **JSON Web Token (JWT)** – Utilizado para autenticação de usuários  
- **dotenv** – Carrega variáveis de ambiente a partir de um arquivo `.env`, mantendo a configuração segura  

---

### ⚙️ Como Rodar o Projeto

#### Pré-requisitos

Certifique-se de que o Node.js esteja instalado na sua máquina. Para verificar, utilize o comando:

node -v

#### Passo a passo

1. Clone este repositório em sua máquina local:  
   git clone https://github.com/vLecaBR/sales-website-model-backend

2. Acesse a pasta do projeto:  
   cd backend

3. Instale as dependências:  
   npm install

4. Crie um arquivo `.env` no diretório raiz do projeto e adicione suas variáveis de ambiente necessárias (exemplo: JWT_SECRET).

5. Inicie o servidor:  
   node server.js

O servidor estará rodando em: http://localhost:5000

---

### 💡 Melhorias Futuras

- Integração com API de pagamento para transações reais  
- Sistema de Notificações: Alerta os usuários sobre atualizações de conta ou promoções  
- Gerenciamento de Produtos: Funcionalidades para adicionar, editar e excluir produtos do catálogo  
- Melhorias em Segurança: Implementação de práticas de segurança adicionais, como limitação de taxa e validação mais rigorosa de entradas  

---

### 📬 Contato

- Email: vitartasleca@gmail.com  
- LinkedIn: https://www.linkedin.com/in/victor-leca-vlkbr/

---

> ℹ️ Este projeto foi desenvolvido para fins educacionais e de portfólio. Não possui processamento real de pagamentos ou gerenciamento de pedidos.

---

### 📄 Licença

Este projeto foi desenvolvido para fins educacionais e uso de portfólio. Entrar em contato em caso de querer utilizar.

---
---
---

# 🇺🇸 README in English
# 🛒 E-commerce Project Backend - Portfolio Project

This repository contains the source code for the backend of an e-commerce project, developed using Node.js and SQLite. The goal is to provide basic user authentication and management functionalities, allowing users to register, log in, and update their information.

---

### ✨ Features

- 📝 **User Registration**: Allows new users to sign up with their name, email, and password  
- 🔑 **Login**: Users can authenticate using email and password, receiving a JWT token  
- ✏️ **User Information Update**: Authenticated users can update their personal details  
- 🔒 **Route Protection**: Sensitive routes are protected by authentication, ensuring only logged-in users can access them

---

### 🛠️ Technologies Used

- **Node.js** – JavaScript runtime environment for server-side development  
- **Express** – Web framework for building APIs quickly and efficiently  
- **SQLite** – Lightweight, embedded database, ideal for development and prototyping  
- **JSON Web Token (JWT)** – Used for user authentication  
- **dotenv** – Loads environment variables from a `.env` file to keep configuration secure  

---

### ⚙️ How to Run the Project

#### Prerequisites

Make sure you have Node.js installed on your machine. You can check with the following command:

node -v

#### Steps

1. Clone the repository to your local machine:  
   git clone https://github.com/vLecaBR/sales-website-model-backend

2. Navigate to the project folder:  
   cd backend

3. Install the dependencies:  
   npm install

4. Create a `.env` file in the root directory of the project and add your necessary environment variables (e.g., JWT_SECRET).

5. Start the server:  
   node server.js

The server will be running at: http://localhost:5000

---

### 💡 Potential Future Improvements

- Payment API integration for handling real transactions  
- Notification System: To alert users about account updates or promotions  
- Product Management: Features to add, edit, and delete products from the catalog  
- Security Enhancements: Implementing additional security practices, such as rate limiting and stricter input validation  

---

### 📬 Contact

- Email: vitartasleca@gmail.com  
- LinkedIn: https://www.linkedin.com/in/victor-leca-vlkbr/

---

> ℹ️ This project was developed for educational purposes and portfolio use. It does not include real payment processing or order handling.

---

### 📄 License

This project was developed for educational purposes and portfolio use. Please contact us if you would like to use it.

