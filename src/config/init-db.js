/**
 * Inicialização do banco de dados
 * Este arquivo é responsável por sincronizar os modelos com o banco de dados
 * e criar registros iniciais quando necessário
 */
const { sequelize, testConnection } = require("./database");
const UserModel = require("../models/user.model");
const logger = require("../utils/logger");
const fs = require("fs");
const path = require("path");

// Arquivo para controlar se as tabelas já foram criadas
const DB_INIT_FLAG_FILE = path.join(__dirname, "../../db_initialized.flag");

// Função para inicializar o banco de dados
const initializeDatabase = async () => {
  try {
    // Testa a conexão com o banco de dados
    const connected = await testConnection();

    if (!connected) {
      logger.error(
        "Falha ao conectar com o banco de dados. Verifique as configurações."
      );
      return false;
    }

    // Verifica se é a primeira execução
    const isFirstRun = !fs.existsSync(DB_INIT_FLAG_FILE);

    // Sincroniza os modelos com o banco de dados
    // { force: true } recria as tabelas (use apenas na primeira execução)
    // { alter: true } faz alterações nas tabelas existentes
    const syncOptions = isFirstRun
      ? { force: true }
      : process.env.NODE_ENV === "development"
      ? { alter: true }
      : {};

    console.log(
      `Sincronizando banco de dados. Primeira execução: ${isFirstRun}`
    );
    await sequelize.sync(syncOptions);
    logger.info(
      `Modelos sincronizados com o banco de dados. Modo: ${
        isFirstRun ? "force" : "alter"
      }`
    );

    // Cria o arquivo de flag após a primeira sincronização
    if (isFirstRun) {
      fs.writeFileSync(DB_INIT_FLAG_FILE, new Date().toISOString());
      console.log("Arquivo de controle de inicialização criado.");
    }

    // Inicializa usuários padrão
    await UserModel.initializeDefaultUsers();
    logger.info("Usuários iniciais verificados/criados");

    return true;
  } catch (error) {
    logger.error("Erro ao inicializar o banco de dados:", error);
    return false;
  }
};

module.exports = { initializeDatabase };
