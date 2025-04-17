<h1>E-commerce Project Backend</h1><br>
This repository contains the source code for the backend of an e-commerce project, developed using Node.js and SQLite. The goal is to provide basic user authentication and management functionalities, allowing users to register, log in, and update their information.

📋 Features

User Registration: Allows new users to sign up with their name, email, and password.

Login: Users can authenticate using email and password, receiving a JWT token.

User Information Update: Authenticated users can update their personal details.

Route Protection: Sensitive routes are protected by authentication, ensuring only logged-in users can access them. <br>

🛠️ Technologies Used

Node.js: JavaScript runtime environment for server-side development.

Express: Web framework for building APIs quickly and efficiently.

SQLite: Lightweight, embedded database, ideal for development and prototyping.

JSON Web Token (JWT): Used for user authentication.

dotenv: Loads environment variables from a .env file to keep configuration secure. <br>

⚙️ How to Run the Project
Prerequisites
Make sure you have Node.js installed on your machine. You can check with the following command:
node -v

Step-by-Step

Clone this repository to your local machine:
git clone https://github.com/vLecaBR/sales-website-model-backend

Navigate to the project folder:
cd backend

Install the dependencies:
npm install

Create a .env file in the root directory of the project and add your necessary environment variables (e.g., JWT_SECRET).

Start the server:
node server.js

The server will be running at http://localhost:5000. <br>

💡 Potential Future Improvements

Payment API Integration: For handling real transactions.

Notification System: To alert users about account updates or promotions.

Product Management: Features to add, edit, and delete products from the catalog.

Security Enhancements: Implementing additional security practices, such as rate limiting and stricter input validation. <br>

📬 Contact
If you have any questions or suggestions about this project, feel free to reach out:
Email: vitartasleca@gmail.com
LinkedIn: https://www.linkedin.com/in/victor-leca-vlkbr/ <br>

Note: This project was developed for educational purposes and as part of my personal portfolio. It does not include real payment processing or order handling. <br>

License
This project is licensed under the MIT License. <br>

I hope this project helps demonstrate my skills and serves as inspiration for anyone looking to build their own e-commerce backend!
