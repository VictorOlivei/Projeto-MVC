const jwt = require('jsonwebtoken');
const config = require('../config');
const logger = require('../utils/logger');

/**
 * Middleware para verificação de autenticação via JWT
 * Garante que apenas usuários autenticados possam acessar rotas protegidas
 */
const authMiddleware = (req, res, next) => {
  try {
    // Obtém o token do cabeçalho de autorização
    const authHeader = req.headers.authorization;
    
    // Verifica se o token foi fornecido
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn(`Tentativa de acesso sem token: ${req.originalUrl}`);
      return res.status(401).json({ 
        success: false, 
        message: 'Token de autenticação não fornecido' 
      });
    }
    
    // Extrai o token do cabeçalho (remove "Bearer ")
    const token = authHeader.split(' ')[1];
    
    // Verifica e decodifica o token
    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    // Adiciona as informações do usuário decodificadas ao objeto de requisição
    req.user = decoded;
    
    // Registra o acesso autenticado
    logger.info(`Acesso autenticado: ${req.originalUrl} - Usuário: ${decoded.id}`);
    
    // Passa para o próximo middleware
    next();
  } catch (error) {
    // Registra o erro de autenticação
    logger.warn(`Falha de autenticação: ${req.originalUrl} - ${error.message}`);
    
    // Verifica o tipo de erro
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token de autenticação expirado' 
      });
    }
    
    return res.status(401).json({ 
      success: false, 
      message: 'Token de autenticação inválido' 
    });
  }
};

/**
 * Middleware para verificação de permissões de usuário
 * Permite restringir acesso baseado em papéis/permissões
 * @param {Array} roles - Array de papéis permitidos
 */
const authorizeRoles = (roles = []) => {
  return (req, res, next) => {
    // Verifica se o middleware de autenticação foi executado primeiro
    if (!req.user) {
      return res.status(500).json({ 
        success: false, 
        message: 'Configuração de servidor inválida, autenticação deve ser verificada antes da autorização' 
      });
    }

    // Verifica se o usuário possui o papel necessário
    if (!roles.includes(req.user.role)) {
      logger.warn(`Acesso não autorizado: ${req.originalUrl} - Usuário: ${req.user.id} - Role: ${req.user.role}`);
      return res.status(403).json({ 
        success: false, 
        message: 'Você não tem permissão para acessar este recurso' 
      });
    }

    // Se tudo estiver correto, passa para o próximo middleware
    next();
  };
};

module.exports = {
  authMiddleware,
  authorizeRoles
};