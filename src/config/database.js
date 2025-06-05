// Configuração do banco de dados
const { Sequelize } = require("sequelize");
require("dotenv").config();

// Cria a instância do Sequelize com as configurações do banco de dados
const sequelize = new Sequelize(
  process.env.DB_NAME || "mvp_database",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "titiacleusa123", // Use a senha que você definiu
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    port: process.env.DB_PORT || 3306,
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    define: {
      timestamps: true,
      underscored: true,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Função para testar a conexão com o banco de dados
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexão com o banco de dados estabelecida com sucesso.");
    return true;
  } catch (error) {
    console.error("Não foi possível conectar ao banco de dados:", error);
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection,
};
