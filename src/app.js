// Importações principais
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Importação das configurações
const config = require('./config');

// Importação dos middlewares
const errorMiddleware = require('./middlewares/error.middleware');

// Importação das rotas
const authRoutes = require('./routes/auth.routes');
const logRoutes = require('./routes/log.routes');
const healthRoutes = require('./routes/health.routes');

// Inicialização do logger
const logger = require('./utils/logger');

// Inicialização da aplicação Express
const app = express();

// Aplicação dos middlewares de segurança e utilitários
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração de logs de requisições
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'logs', 'access.log'), 
  { flags: 'a' }
);
app.use(morgan('combined', { stream: accessLogStream }));

// Aplicação das rotas
app.use('/auth', authRoutes);
app.use('/logs', logRoutes);
app.use('/health', healthRoutes);

// Middleware para rotas não encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

// Middleware para tratamento centralizado de erros
app.use(errorMiddleware);

// Inicialização do servidor
const PORT = config.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;