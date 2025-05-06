const express = require('express');
const LogController = require('../controllers/log.controller');
const { authMiddleware, authorizeRoles } = require('../middlewares/auth.middleware');

// Criação do roteador
const router = express.Router();

/**
 * Rotas de logs
 * Implementa os endpoints para acesso aos logs do sistema
 * Apenas usuários autenticados com papel 'admin' podem acessar
 */

// Rota para obter logs - GET /logs
// Protegida por autenticação e autorização (apenas admins)
router.get('/', authMiddleware, authorizeRoles(['admin']), LogController.getLogs);

module.exports = router;