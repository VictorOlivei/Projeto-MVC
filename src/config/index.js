// Importação do pacote dotenv para carregar variáveis de ambiente
require('dotenv').config();

// Objeto de configuração centralizada
const config = {
  // Configurações do servidor
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Configurações de autenticação
  JWT_SECRET: process.env.JWT_SECRET || 'segredo-mvc-arquitetura',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
  
  // Configurações de log
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  LOG_FILE: process.env.LOG_FILE || 'app.log',
  
  // Outras configurações sensíveis (banco de dados, serviços externos, etc.)
  // DB_URI: process.env.DB_URI || 'mongodb://localhost:27017/mvp'
};

module.exports = config;