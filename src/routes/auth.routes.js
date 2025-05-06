const express = require('express');
const AuthController = require('../controllers/auth.controller');

// Criação do roteador
const router = express.Router();

/**
 * Rotas de autenticação
 * Implementa os endpoints necessários para autenticação de usuários
 */

// Rota de login - POST /auth/login
router.post('/login', AuthController.login);

// Rota de registro - POST /auth/register
router.post('/register', AuthController.register);

module.exports = router;