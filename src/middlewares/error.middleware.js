const logger = require('../utils/logger');

/**
 * Middleware para tratamento centralizado de erros
 * Captura exceções lançadas durante o processamento de requisições
 * e gera respostas padronizadas para o cliente
 */
const errorMiddleware = (err, req, res, next) => {
  // Captura informações relevantes para o log
  const { method, url, ip } = req;
  
  // Define o código de status HTTP baseado no erro ou usa 500 (Internal Server Error)
  const statusCode = err.statusCode || 500;
  
  // Define a mensagem de erro para o usuário (amigável em produção)
  const message = process.env.NODE_ENV === 'production' && statusCode === 500
    ? 'Erro interno no servidor'
    : err.message || 'Algo deu errado';
    
  // Registra o erro no sistema de log
  logger.error(`${method} ${url} - ${statusCode} - ${err.message}`, { 
    ip,
    stack: err.stack,
    body: req.body
  });
  
  // Envia resposta formatada para o cliente
  res.status(statusCode).json({
    success: false,
    message,
    // Inclui detalhes adicionais apenas em ambiente de desenvolvimento
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

module.exports = errorMiddleware;