'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize; //! Define a variável sequelize
if (config.use_env_variable) { //! Verifica se existe uma variável de ambiente para o banco de dados
  sequelize = new Sequelize(process.env[config.use_env_variable], config); //! Conecta ao banco de dados com a variável de ambiente
} else { //! Caso não tenha variável de ambiente, conecta com as configurações do arquivo config.json
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname) //! Lê todos os arquivos do diretório
  .filter(file => { //! Filtra os arquivos para não importar o index.js
    return ( //! Retorna os arquivos que não começam com "." e não são o index.js
      file.indexOf('.') !== 0 && //! Verifica se o arquivo não começa com "."
      file !== basename && //! Verifica se o arquivo não é o index.js
      file.slice(-3) === '.js' && //! Verifica se o arquivo termina com ".js"
      file.indexOf('.test.js') === -1 //! Verifica se o arquivo não é um arquivo de teste
    );
  }) 
  .forEach(file => { //! Para cada arquivo encontrado, importa o model
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes); //! Importa o model
    db[model.name] = model; //! Adiciona o model ao objeto db
  });

Object.keys(db).forEach(modelName => { //! Para cada model, verifica se existe a função associate
  if (db[modelName].associate) { //! Se existir a função associate, chama a função associate
    db[modelName].associate(db); //! Chama a função associate
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
